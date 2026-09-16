from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    """Usuario que administra importaciones y parámetros del sistema."""

    class Meta:
        verbose_name = "usuario"
        verbose_name_plural = "usuarios"

