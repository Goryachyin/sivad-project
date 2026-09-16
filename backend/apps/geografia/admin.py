from django.contrib import admin

from .models import EntidadFederativa, Municipio


@admin.register(EntidadFederativa)
class AdministracionEntidadFederativa(admin.ModelAdmin):
    list_display = ("codigo", "nombre", "abreviatura")
    search_fields = ("codigo", "nombre")


@admin.register(Municipio)
class AdministracionMunicipio(admin.ModelAdmin):
    list_display = ("codigo", "nombre", "entidad")
    list_filter = ("entidad",)
    search_fields = ("codigo", "nombre")

