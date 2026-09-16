from django.db import models


class RegistroEpidemiologico(models.Model):
    class EstatusCaso(models.IntegerChoices):
        PROBABLE = 1, "Probable"
        CONFIRMADO = 2, "Confirmado"
        DESCARTADO = 3, "Descartado"

    class SiNo(models.IntegerChoices):
        SI = 1, "Sí"
        NO = 2, "No"

    id_registro = models.CharField("identificador de registro", max_length=20, unique=True)
    fecha_actualizacion_fuente = models.DateField("fecha de actualización de la fuente")
    fecha_inicio_sintomas = models.DateField("fecha de inicio de síntomas")
    edad_anos = models.PositiveSmallIntegerField("edad en años", null=True, blank=True)
    sexo = models.PositiveSmallIntegerField("sexo", null=True, blank=True)
    estatus_caso = models.PositiveSmallIntegerField("estatus del caso", choices=EstatusCaso.choices)
    dictamen = models.PositiveSmallIntegerField("dictamen", null=True, blank=True)
    toma_muestra = models.PositiveSmallIntegerField("toma de muestra", choices=SiNo.choices, null=True, blank=True)
    resultado_pcr = models.PositiveSmallIntegerField("resultado PCR", null=True, blank=True)
    defuncion = models.PositiveSmallIntegerField("defunción", choices=SiNo.choices, null=True, blank=True)
    entidad_asignada = models.ForeignKey("geografia.EntidadFederativa", on_delete=models.PROTECT, related_name="registros_asignados", null=True, blank=True)
    municipio_asignado = models.ForeignKey("geografia.Municipio", on_delete=models.PROTECT, related_name="registros_asignados", null=True, blank=True)
    entidad_residencia = models.ForeignKey("geografia.EntidadFederativa", on_delete=models.PROTECT, related_name="registros_residencia", null=True, blank=True)
    municipio_residencia = models.ForeignKey("geografia.Municipio", on_delete=models.PROTECT, related_name="registros_residencia", null=True, blank=True)
    importacion_actual = models.ForeignKey("importaciones.ImportacionDatos", on_delete=models.PROTECT, related_name="registros_actualizados")
    creado_en = models.DateTimeField("creado en", auto_now_add=True)
    actualizado_en = models.DateTimeField("actualizado en", auto_now=True)

    class Meta:
        verbose_name = "registro epidemiológico"
        verbose_name_plural = "registros epidemiológicos"
        indexes = [
            models.Index(fields=["estatus_caso", "fecha_inicio_sintomas"]),
            models.Index(fields=["entidad_asignada", "municipio_asignado"]),
        ]

    def __str__(self) -> str:
        return self.id_registro

