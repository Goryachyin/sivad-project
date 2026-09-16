"""Carga los catálogos territoriales suministrados por la fuente."""

from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from openpyxl import load_workbook

from apps.geografia.models import EntidadFederativa, Municipio


class Command(BaseCommand):
    help = "Carga entidades y municipios desde catalogos_dengue.xlsx."

    def add_arguments(self, parser):
        parser.add_argument("archivo", type=Path)

    def handle(self, *args, **options):
        archivo = options["archivo"]
        if not archivo.is_file():
            raise CommandError(f"No existe el archivo: {archivo}")

        libro = load_workbook(archivo, read_only=True, data_only=True)
        try:
            hoja_entidades = libro["CATÁLOGO ENTIDAD"]
        except KeyError:
            hoja_entidades = next(hoja for hoja in libro.worksheets if "ENTIDAD" in hoja.title)
        try:
            hoja_municipios = libro["CATÁLOGO MUNICIPIO"]
        except KeyError:
            hoja_municipios = next(hoja for hoja in libro.worksheets if "MUNICIPIO" in hoja.title)

        entidades = {}
        for codigo, nombre, abreviatura in list(hoja_entidades.values)[1:]:
            entidad, _ = EntidadFederativa.objects.update_or_create(
                codigo=str(codigo).zfill(2),
                defaults={"nombre": nombre.strip(), "abreviatura": (abreviatura or "").strip()},
            )
            entidades[entidad.codigo] = entidad

        municipios = 0
        for codigo, nombre, codigo_entidad in list(hoja_municipios.values)[1:]:
            entidad = entidades.get(str(codigo_entidad).zfill(2))
            if entidad is None:
                continue
            Municipio.objects.update_or_create(
                entidad=entidad,
                codigo=str(codigo).zfill(3),
                defaults={"nombre": nombre.strip()},
            )
            municipios += 1

        self.stdout.write(self.style.SUCCESS(f"Se cargaron {len(entidades)} entidades y {municipios} municipios."))
