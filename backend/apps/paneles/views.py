"""Endpoints públicos para el dashboard epidemiológico."""

import json
from datetime import date

from django.db.models import Count
from django.db.models.functions import ExtractYear, TruncMonth
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.epidemiologia.models import RegistroEpidemiologico
from apps.geografia.models import EntidadFederativa, Municipio


FILTROS = [
    OpenApiParameter("anio_inicial", OpenApiTypes.INT, OpenApiParameter.QUERY),
    OpenApiParameter("anio_final", OpenApiTypes.INT, OpenApiParameter.QUERY),
    OpenApiParameter("fecha_inicial", OpenApiTypes.DATE, OpenApiParameter.QUERY, description="Fecha inclusiva AAAA-MM-DD. Tiene prioridad sobre anio_inicial."),
    OpenApiParameter("fecha_final", OpenApiTypes.DATE, OpenApiParameter.QUERY, description="Fecha inclusiva AAAA-MM-DD. Tiene prioridad sobre anio_final."),
    OpenApiParameter("entidad", OpenApiTypes.STR, OpenApiParameter.QUERY, description="Código de entidad."),
    OpenApiParameter("municipio", OpenApiTypes.STR, OpenApiParameter.QUERY, description="Requiere entidad."),
    OpenApiParameter("estatus", OpenApiTypes.STR, OpenApiParameter.QUERY, description="1 probable, 2 confirmado, 3 descartado. Predeterminado: 2."),
]


def filtrar(parametros):
    consulta = RegistroEpidemiologico.objects.all()
    try:
        fecha_inicial = parametros.get("fecha_inicial")
        fecha_final = parametros.get("fecha_final")
        if fecha_inicial:
            consulta = consulta.filter(fecha_inicio_sintomas__gte=date.fromisoformat(fecha_inicial))
        elif parametros.get("anio_inicial"):
            consulta = consulta.filter(fecha_inicio_sintomas__year__gte=int(parametros["anio_inicial"]))
        if fecha_final:
            consulta = consulta.filter(fecha_inicio_sintomas__lte=date.fromisoformat(fecha_final))
        elif parametros.get("anio_final"):
            consulta = consulta.filter(fecha_inicio_sintomas__year__lte=int(parametros["anio_final"]))
        if fecha_inicial and fecha_final and date.fromisoformat(fecha_inicial) > date.fromisoformat(fecha_final):
            raise ValueError("fecha_inicial no puede ser posterior a fecha_final.")
        entidad, municipio = parametros.get("entidad"), parametros.get("municipio")
        if municipio and not entidad:
            raise ValueError("El filtro municipio requiere entidad.")
        if entidad:
            consulta = consulta.filter(entidad_asignada__codigo=str(entidad).zfill(2))
        if municipio:
            consulta = consulta.filter(municipio_asignado__codigo=str(municipio).zfill(3))
        estatus = [int(valor) for valor in parametros.get("estatus", "2").split(",")]
        if not set(estatus).issubset({1, 2, 3}):
            raise ValueError("Estatus permitido: 1, 2 o 3.")
    except ValueError as error:
        raise ValueError(f"Filtro inválido: {error}") from error
    return consulta.filter(estatus_caso__in=estatus)


class VistaPublica(APIView):
    def consulta(self, request):
        try:
            return filtrar(request.query_params), None
        except ValueError as error:
            return None, Response({"detalle": str(error)}, status=400)


class AniosDisponiblesVista(APIView):
    """Lista los años que cuentan con registros epidemiológicos cargados."""

    @extend_schema(summary="Años epidemiológicos disponibles", responses=OpenApiTypes.OBJECT)
    def get(self, request):
        anios = RegistroEpidemiologico.objects.exclude(fecha_inicio_sintomas__isnull=True).annotate(
            anio=ExtractYear("fecha_inicio_sintomas")
        ).values_list("anio", flat=True).distinct().order_by("-anio")
        return Response({"anios": list(anios)})


class EntidadesDisponiblesVista(APIView):
    """Lista el catálogo nacional para los controles de consulta."""

    @extend_schema(summary="Entidades federativas disponibles", responses=OpenApiTypes.OBJECT)
    def get(self, request):
        entidades = EntidadFederativa.objects.filter(codigo__lte="32").values("codigo", "nombre").order_by("codigo")
        return Response({"entidades": list(entidades)})


class ResumenEpidemiologicoVista(VistaPublica):
    @extend_schema(parameters=FILTROS, summary="Resumen epidemiológico", responses=OpenApiTypes.OBJECT)
    def get(self, request):
        consulta, error = self.consulta(request)
        if error:
            return error
        return Response({"total_registros": consulta.count(), "por_estatus": list(consulta.values("estatus_caso").annotate(total=Count("id")).order_by("estatus_caso")), "filtros_aplicados": dict(request.query_params)})


class SerieTemporalVista(VistaPublica):
    @extend_schema(parameters=FILTROS, summary="Serie mensual de casos", responses=OpenApiTypes.OBJECT)
    def get(self, request):
        consulta, error = self.consulta(request)
        if error:
            return error
        serie = consulta.annotate(periodo=TruncMonth("fecha_inicio_sintomas")).values("periodo", "estatus_caso").annotate(total=Count("id")).order_by("periodo", "estatus_caso")
        return Response({"serie_mensual": list(serie), "filtros_aplicados": dict(request.query_params)})


class DistribucionTerritorialVista(VistaPublica):
    @extend_schema(parameters=FILTROS + [OpenApiParameter("nivel", OpenApiTypes.STR, OpenApiParameter.QUERY, description="entidad o municipio")], summary="Distribución territorial", responses=OpenApiTypes.OBJECT)
    def get(self, request):
        consulta, error = self.consulta(request)
        if error:
            return error
        nivel = request.query_params.get("nivel", "entidad")
        if nivel == "entidad":
            campos = ["entidad_asignada__codigo", "entidad_asignada__nombre"]
        elif nivel == "municipio" and request.query_params.get("entidad"):
            campos = ["municipio_asignado__codigo", "municipio_asignado__nombre"]
        else:
            return Response({"detalle": "Nivel permitido: entidad, o municipio acompañado de entidad."}, status=400)
        return Response({"nivel": nivel, "resultados": list(consulta.values(*campos).annotate(total=Count("id")).order_by("-total")), "filtros_aplicados": dict(request.query_params)})


class MapaEntidadesVista(VistaPublica):
    """Devuelve los límites cargados y el total de casos para cada entidad."""

    @extend_schema(parameters=FILTROS, summary="Mapa GeoJSON de entidades", responses=OpenApiTypes.OBJECT)
    def get(self, request):
        consulta, error = self.consulta(request)
        if error:
            return error

        conteos = {
            fila["entidad_asignada__codigo"]: fila["total"]
            for fila in consulta.values("entidad_asignada__codigo").annotate(total=Count("id"))
            if fila["entidad_asignada__codigo"]
        }
        caracteristicas = []
        for entidad in EntidadFederativa.objects.exclude(geometria__isnull=True):
            caracteristicas.append({
                "type": "Feature",
                "id": entidad.codigo,
                "properties": {
                    "codigo": entidad.codigo,
                    "nombre": entidad.nombre,
                    "casos_confirmados": conteos.get(entidad.codigo, 0),
                },
                # El navegador usa una versión simplificada; PostGIS conserva el límite original.
                "geometry": json.loads(entidad.geometria.simplify(0.005, preserve_topology=True).geojson),
            })
        return Response({
            "type": "FeatureCollection",
            "features": caracteristicas,
            "filtros_aplicados": dict(request.query_params),
        })


class MapaMunicipiosVista(VistaPublica):
    """Devuelve los límites municipales de una entidad y sus casos confirmados."""

    @extend_schema(parameters=FILTROS, summary="Mapa GeoJSON de municipios", responses=OpenApiTypes.OBJECT)
    def get(self, request):
        consulta, error = self.consulta(request)
        if error:
            return error
        codigo_entidad = request.query_params.get("entidad")
        if not codigo_entidad:
            return Response({"detalle": "El mapa municipal requiere el parámetro entidad."}, status=400)
        codigo_entidad = str(codigo_entidad).zfill(2)
        conteos = {
            fila["municipio_asignado__codigo"]: fila["total"]
            for fila in consulta.values("municipio_asignado__codigo").annotate(total=Count("id"))
            if fila["municipio_asignado__codigo"]
        }
        caracteristicas = []
        municipios = Municipio.objects.filter(entidad__codigo=codigo_entidad, geometria__isnull=False)
        for municipio in municipios:
            geometria = municipio.geometria.simplify(0.001, preserve_topology=True)
            caracteristicas.append({
                "type": "Feature",
                "id": f"{codigo_entidad}{municipio.codigo}",
                "properties": {
                    "codigo": municipio.codigo,
                    "nombre": municipio.nombre,
                    "casos_confirmados": conteos.get(municipio.codigo, 0),
                },
                "geometry": json.loads(geometria.geojson),
                "punto_representativo": json.loads(geometria.point_on_surface.geojson),
            })
        return Response({"type": "FeatureCollection", "features": caracteristicas, "entidad": codigo_entidad, "filtros_aplicados": dict(request.query_params)})
