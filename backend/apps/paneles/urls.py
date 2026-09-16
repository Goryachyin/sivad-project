from django.urls import path

from .views import DistribucionTerritorialVista, MapaEntidadesVista, ResumenEpidemiologicoVista, SerieTemporalVista

app_name = "paneles"
urlpatterns = [
    path("resumen/", ResumenEpidemiologicoVista.as_view(), name="resumen"),
    path("serie-temporal/", SerieTemporalVista.as_view(), name="serie-temporal"),
    path("distribucion-territorial/", DistribucionTerritorialVista.as_view(), name="distribucion-territorial"),
    path("mapa-entidades/", MapaEntidadesVista.as_view(), name="mapa-entidades"),
]
