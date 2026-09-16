"""Importa un corte CSV de dengue con validación y trazabilidad."""

import csv
import hashlib
from datetime import datetime
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.epidemiologia.models import RegistroEpidemiologico
from apps.geografia.models import EntidadFederativa, Municipio
from apps.importaciones.models import ImportacionDatos


COLUMNAS_REQUERIDAS = {
    "FECHA_ACTUALIZACION", "ID_REGISTRO", "SEXO", "EDAD_ANOS", "ENTIDAD_RES",
    "MUNICIPIO_RES", "FECHA_SIGN_SINTOMAS", "DEFUNCION", "DICTAMEN",
    "TOMA_MUESTRA", "RESULTADO_PCR", "ESTATUS_CASO", "ENTIDAD_ASIG", "MUNICIPIO_ASIG",
}


class Command(BaseCommand):
    help = "Valida e importa un corte CSV de datos abiertos de dengue."

    def add_arguments(self, parser):
        parser.add_argument("archivo", type=Path)
        parser.add_argument("--usuario", required=True, help="Nombre del administrador responsable.")

    def handle(self, *args, **options):
        archivo = options["archivo"]
        if not archivo.is_file():
            raise CommandError(f"No existe el archivo: {archivo}")
        usuario = get_user_model().objects.filter(username=options["usuario"]).first()
        if usuario is None:
            raise CommandError("El usuario administrador indicado no existe.")

        hash_archivo = hashlib.sha256(archivo.read_bytes()).hexdigest()
        importacion_previa = ImportacionDatos.objects.filter(hash_archivo=hash_archivo).first()
        if importacion_previa and importacion_previa.estado == ImportacionDatos.Estado.PROCESADA:
            raise CommandError("El archivo ya fue importado anteriormente.")

        with archivo.open("r", encoding="utf-8-sig", newline="") as origen:
            lector = csv.DictReader(origen)
            faltantes = COLUMNAS_REQUERIDAS.difference(lector.fieldnames or [])
            if faltantes:
                raise CommandError(f"Faltan columnas obligatorias: {', '.join(sorted(faltantes))}")
            filas = list(lector)

        importacion, _ = ImportacionDatos.objects.update_or_create(
            hash_archivo=hash_archivo,
            defaults={
                "archivo_original": archivo.name,
                "usuario": usuario,
                "registros_recibidos": len(filas),
                "registros_aceptados": 0,
                "registros_rechazados": 0,
                "detalle_errores": {},
                "estado": ImportacionDatos.Estado.VALIDANDO,
            },
        )
        self.entidades = {entidad.codigo: entidad for entidad in EntidadFederativa.objects.all()}
        self.municipios = {
            (municipio.entidad_id, municipio.codigo): municipio
            for municipio in Municipio.objects.select_related("entidad")
        }
        errores, registros = [], []
        with transaction.atomic():
            for numero, fila in enumerate(filas, start=2):
                try:
                    datos = self._normalizar_fila(fila, importacion)
                    registros.append(RegistroEpidemiologico(**datos))
                except (ValueError, KeyError) as error:
                    if len(errores) < 100:
                        errores.append({"fila": numero, "error": str(error)})
            RegistroEpidemiologico.objects.bulk_create(
                registros,
                batch_size=2000,
                update_conflicts=True,
                update_fields=[
                    "fecha_actualizacion_fuente", "fecha_inicio_sintomas", "edad_anos", "sexo",
                    "estatus_caso", "dictamen", "toma_muestra", "resultado_pcr", "defuncion",
                    "entidad_asignada", "municipio_asignado", "entidad_residencia",
                    "municipio_residencia", "importacion_actual", "actualizado_en",
                ],
                unique_fields=["id_registro"],
            )

        aceptados = len(registros)
        rechazados = len(filas) - aceptados
        importacion.registros_aceptados = aceptados
        importacion.registros_rechazados = rechazados
        importacion.detalle_errores = {"muestra": errores}
        importacion.estado = ImportacionDatos.Estado.PROCESADA if not rechazados else ImportacionDatos.Estado.CON_ERRORES
        importacion.save(update_fields=["registros_aceptados", "registros_rechazados", "detalle_errores", "estado"])
        self.stdout.write(self.style.SUCCESS(f"Importación finalizada: {aceptados} aceptados y {rechazados} rechazados."))

    def _normalizar_fila(self, fila, importacion):
        estatus = int(fila["ESTATUS_CASO"])
        if estatus not in RegistroEpidemiologico.EstatusCaso.values:
            raise ValueError("ESTATUS_CASO no pertenece al catálogo.")
        entidad_asignada, municipio_asignado = self._territorio(fila["ENTIDAD_ASIG"], fila["MUNICIPIO_ASIG"])
        entidad_residencia, municipio_residencia = self._territorio(fila["ENTIDAD_RES"], fila["MUNICIPIO_RES"])
        return {
            "id_registro": fila["ID_REGISTRO"].strip(),
            "fecha_actualizacion_fuente": self._fecha(fila["FECHA_ACTUALIZACION"]),
            "fecha_inicio_sintomas": self._fecha(fila["FECHA_SIGN_SINTOMAS"]),
            "edad_anos": self._entero_opcional(fila["EDAD_ANOS"]),
            "sexo": self._entero_opcional(fila["SEXO"]),
            "estatus_caso": estatus,
            "dictamen": self._entero_opcional(fila["DICTAMEN"]),
            "toma_muestra": self._entero_opcional(fila["TOMA_MUESTRA"]),
            "resultado_pcr": self._entero_opcional(fila["RESULTADO_PCR"]),
            "defuncion": self._entero_opcional(fila["DEFUNCION"]),
            "entidad_asignada": entidad_asignada,
            "municipio_asignado": municipio_asignado,
            "entidad_residencia": entidad_residencia,
            "municipio_residencia": municipio_residencia,
            "importacion_actual": importacion,
        }

    @staticmethod
    def _fecha(valor):
        for formato in ("%Y-%m-%d", "%d/%m/%Y"):
            try:
                return datetime.strptime(valor.strip(), formato).date()
            except ValueError:
                continue
        raise ValueError("Fecha inválida o ausente.")

    @staticmethod
    def _entero_opcional(valor):
        return int(valor) if valor and valor.strip() else None

    def _territorio(self, codigo_entidad, codigo_municipio):
        entidad_codigo = str(codigo_entidad).zfill(2)
        municipio_codigo = str(codigo_municipio).zfill(3)
        if entidad_codigo == "99" or municipio_codigo in {"000", "999"}:
            return None, None
        entidad = self.entidades.get(entidad_codigo)
        if entidad is None:
            raise ValueError("La entidad territorial no existe en el catálogo.")
        municipio = self.municipios.get((entidad.id, municipio_codigo))
        if municipio is None:
            raise ValueError("El municipio no corresponde con la entidad en el catálogo.")
        return entidad, municipio
