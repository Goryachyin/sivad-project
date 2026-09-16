from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


def estado_servicio(request):
    return JsonResponse({"servicio": "SIVAD", "estado": "disponible"})


urlpatterns = [
    path("administracion/", admin.site.urls),
    path("estado/", estado_servicio, name="estado-servicio"),
    path("api/publica/", include("apps.paneles.urls")),
    path("api/esquema/", SpectacularAPIView.as_view(), name="esquema-api"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="esquema-api"), name="documentacion-api"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="esquema-api"), name="redoc-api"),
]
