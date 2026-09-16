"""Ajustes principales del backend de SIVAD."""

from pathlib import Path

import environ

DIRECTORIO_BASE = Path(__file__).resolve().parent.parent
env = environ.Env(DEPURACION=(bool, False))
environ.Env.read_env(DIRECTORIO_BASE / ".env")

SECRET_KEY = env("SECRETO_DJANGO", default="solo-para-desarrollo-no-usar-en-produccion")
DEBUG = env("DEPURACION")
ALLOWED_HOSTS = env.list("HOSTS_PERMITIDOS", default=["localhost", "127.0.0.1"])

INSTALLED_APPS = [
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "django.contrib.gis", "apps.usuarios", "apps.geografia", "apps.importaciones",
    "apps.epidemiologia", "apps.paneles", "rest_framework", "drf_spectacular",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware", "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware", "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware", "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")
ROOT_URLCONF = "configuracion.urls"
TEMPLATES = [{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [], "APP_DIRS": True,
              "OPTIONS": {"context_processors": ["django.template.context_processors.request", "django.contrib.auth.context_processors.auth", "django.contrib.messages.context_processors.messages"]}}]
WSGI_APPLICATION = "configuracion.wsgi.application"
ASGI_APPLICATION = "configuracion.asgi.application"
DATABASES = {
    "default": env.db("URL_BD") if env("URL_BD", default="") else {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": env("NOMBRE_BD", default="sivad"),
        "USER": env("USUARIO_BD", default="sivad"),
        "PASSWORD": env("CONTRASENA_BD", default="sivad"),
        "HOST": env("HOST_BD", default="127.0.0.1"),
        "PORT": env("PUERTO_BD", default="5432"),
    }
}
AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = "es-mx"
TIME_ZONE = "America/Mexico_City"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
STATIC_ROOT = DIRECTORIO_BASE / "staticfiles"
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "usuarios.Usuario"

REST_FRAMEWORK = {"DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema", "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"]}
SPECTACULAR_SETTINGS = {"TITLE": "API pública de SIVAD", "DESCRIPTION": "Consulta de indicadores históricos de dengue para México.", "VERSION": "1.0.0", "SERVE_INCLUDE_SCHEMA": False}
