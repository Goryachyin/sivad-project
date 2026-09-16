from django.contrib import admin

from .models import RegistroEpidemiologico


@admin.register(RegistroEpidemiologico)
class AdministracionRegistroEpidemiologico(admin.ModelAdmin):
    list_display = ("id_registro", "fecha_inicio_sintomas", "estatus_caso", "entidad_asignada", "municipio_asignado")
    list_filter = ("estatus_caso", "entidad_asignada")
    search_fields = ("id_registro",)
    date_hierarchy = "fecha_inicio_sintomas"

