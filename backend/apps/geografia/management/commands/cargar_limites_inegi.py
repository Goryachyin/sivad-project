"""Carga las áreas geoestadísticas estatales publicadas por INEGI."""

import json
from urllib.request import urlopen

from django.contrib.gis.geos import GEOSGeometry
from django.core.management.base import BaseCommand, CommandError

from apps.geografia.models import EntidadFederativa


URL_INEGI = "https://gaia.inegi.org.mx/wscatgeo/v2/geo/mgee/"
SRID_ORIGEN = 6365  # GCS_Mexico_ITRF2008, declarado por el servicio de INEGI.


class Command(BaseCommand):
    help = "Carga límites estatales desde el servicio GeoJSON oficial de INEGI."

    def handle(self, *args, **options):
        try:
            with urlopen(URL_INEGI, timeout=90) as respuesta:
                contenido = json.load(respuesta)
        except OSError as error:
            raise CommandError(f"No fue posible consultar INEGI: {error}") from error

        caracteristicas = contenido.get("features", [])
        if len(caracteristicas) != 32:
            raise CommandError(f"INEGI devolvió {len(caracteristicas)} áreas; se esperaban 32.")

        actualizadas = 0
        for caracteristica in caracteristicas:
            propiedades = caracteristica.get("properties", {})
            codigo = str(propiedades.get("cve_ent", "")).zfill(2)
            try:
                entidad = EntidadFederativa.objects.get(codigo=codigo)
            except EntidadFederativa.DoesNotExist as error:
                raise CommandError(f"La clave {codigo} de INEGI no existe en el catálogo local.") from error
            geometria = GEOSGeometry(json.dumps(caracteristica["geometry"]), srid=SRID_ORIGEN)
            entidad.geometria = geometria.transform(4326, clone=True)
            entidad.save(update_fields=["geometria"])
            actualizadas += 1

        fuente = contenido.get("metadatos", {}).get("Fuente_informacion_vectorial", "INEGI")
        self.stdout.write(self.style.SUCCESS(f"{actualizadas} límites cargados. Fuente: {fuente}"))
