from django.conf import settings
from django.db import models


class ImportacionDatos(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        VALIDANDO = "validando", "Validando"
        PROCESADA = "procesada", "Procesada"
        CON_ERRORES = "con_errores", "Con errores"
        RECHAZADA = "rechazada", "Rechazada"

    archivo_original = models.CharField("archivo original", max_length=255)
    hash_archivo = models.CharField("hash SHA-256", max_length=64, unique=True)
    fecha_carga = models.DateTimeField("fecha de carga", auto_now_add=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="importaciones_realizadas")
    registros_recibidos = models.PositiveIntegerField("registros recibidos", default=0)
    registros_aceptados = models.PositiveIntegerField("registros aceptados", default=0)
    registros_rechazados = models.PositiveIntegerField("registros rechazados", default=0)
    estado = models.CharField("estado", max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    detalle_errores = models.JSONField("detalle de errores", default=dict, blank=True)

    class Meta:
        verbose_name = "importación de datos"
        verbose_name_plural = "importaciones de datos"
        ordering = ["-fecha_carga"]

    def __str__(self) -> str:
        return f"{self.archivo_original} ({self.fecha_carga:%Y-%m-%d})"

