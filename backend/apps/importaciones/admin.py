from django.contrib import admin

from .models import ImportacionDatos


@admin.register(ImportacionDatos)
class AdministracionImportacionDatos(admin.ModelAdmin):
    list_display = ("archivo_original", "fecha_carga", "estado", "registros_recibidos", "registros_aceptados", "registros_rechazados")
    list_filter = ("estado",)
    search_fields = ("archivo_original", "hash_archivo")
    readonly_fields = ("fecha_carga", "hash_archivo")

