from django.contrib.gis.db import models


class EntidadFederativa(models.Model):
    codigo = models.CharField("código", max_length=2, unique=True)
    nombre = models.CharField("nombre", max_length=100)
    abreviatura = models.CharField("abreviatura", max_length=5, blank=True)
    geometria = models.MultiPolygonField("geometría", null=True, blank=True, srid=4326)

    class Meta:
        verbose_name = "entidad federativa"
        verbose_name_plural = "entidades federativas"
        ordering = ["codigo"]

    def __str__(self) -> str:
        return self.nombre


class Municipio(models.Model):
    entidad = models.ForeignKey(EntidadFederativa, on_delete=models.PROTECT, related_name="municipios")
    codigo = models.CharField("código", max_length=3)
    nombre = models.CharField("nombre", max_length=150)
    geometria = models.MultiPolygonField("geometría", null=True, blank=True, srid=4326)

    class Meta:
        verbose_name = "municipio"
        verbose_name_plural = "municipios"
        ordering = ["entidad__codigo", "codigo"]
        constraints = [models.UniqueConstraint(fields=["entidad", "codigo"], name="municipio_codigo_por_entidad_unico")]

    def __str__(self) -> str:
        return f"{self.nombre}, {self.entidad.nombre}"

