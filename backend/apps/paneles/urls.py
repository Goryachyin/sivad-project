from django.urls import path

from .views import AniosDisponiblesVista, DistribucionTerritorialVista, EntidadesDisponiblesVista, MapaEntidadesVista, MapaMunicipiosVista, ResumenEpidemiologicoVista, SerieTemporalVista

app_name = "paneles"
urlpatterns = [
    path("anios-disponibles/", AniosDisponiblesVista.as_view(), name="anios-disponibles"),
    path("entidades-disponibles/", EntidadesDisponiblesVista.as_view(), name="entidades-disponibles"),
    path("resumen/", ResumenEpidemiologicoVista.as_view(), name="resumen"),
    path("serie-temporal/", SerieTemporalVista.as_view(), name="serie-temporal"),
    path("distribucion-territorial/", DistribucionTerritorialVista.as_view(), name="distribucion-territorial"),
    path("mapa-entidades/", MapaEntidadesVista.as_view(), name="mapa-entidades"),
    path("mapa-municipios/", MapaMunicipiosVista.as_view(), name="mapa-municipios"),
]
