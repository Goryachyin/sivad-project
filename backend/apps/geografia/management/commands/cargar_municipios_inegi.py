"""Carga áreas geoestadísticas municipales publicadas por INEGI."""

import json
from urllib.request import urlopen

from django.contrib.gis.geos import GEOSGeometry
from django.core.management.base import BaseCommand, CommandError

from apps.geografia.models import EntidadFederativa, Municipio


URL_INEGI = "https://gaia.inegi.org.mx/wscatgeo/v2/geo/mgem/{codigo}/"
SRID_ORIGEN = 6365


class Command(BaseCommand):
    help = "Carga límites municipales desde el servicio GeoJSON oficial de INEGI."

    def add_arguments(self, parser):
        parser.add_argument("--entidad", help="Clave de entidad a cargar; omitir para cargar todo México.")

    def handle(self, *args, **options):
        codigo = options.get("entidad")
        entidades = EntidadFederativa.objects.all()
        if codigo:
            entidades = entidades.filter(codigo=str(codigo).zfill(2))
        if not entidades.exists():
            raise CommandError("No existe la entidad solicitada en el catálogo local.")

        actualizados = 0
        omitidos = []
        for entidad in entidades:
            try:
                with urlopen(URL_INEGI.format(codigo=entidad.codigo), timeout=120) as respuesta:
                    contenido = json.load(respuesta)
            except OSError as error:
                raise CommandError(f"No fue posible consultar INEGI para {entidad.codigo}: {error}") from error

            for caracteristica in contenido.get("features", []):
                propiedades = caracteristica.get("properties", {})
                codigo_municipio = str(propiedades.get("cve_mun", "")).zfill(3)
                try:
                    municipio = Municipio.objects.get(entidad=entidad, codigo=codigo_municipio)
                except Municipio.DoesNotExist:
                    omitidos.append(f"{entidad.codigo}{codigo_municipio}")
                    continue
                geometria = GEOSGeometry(json.dumps(caracteristica["geometry"]), srid=SRID_ORIGEN)
                municipio.geometria = geometria.transform(4326, clone=True)
                municipio.save(update_fields=["geometria"])
                actualizados += 1
            self.stdout.write(f"{entidad.codigo}: límites municipales cargados.")

        mensaje = f"{actualizados} límites municipales cargados."
        if omitidos:
            mensaje += f" {len(omitidos)} claves de INEGI no existen en el catálogo local: {', '.join(omitidos)}."
        self.stdout.write(self.style.SUCCESS(mensaje))
