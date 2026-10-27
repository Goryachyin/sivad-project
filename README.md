# SIVAD

Sistema de Información y Visualización Analítica del Dengue.

## Inicio del backend

1. Crear un entorno virtual con Python 3.12 o superior.
2. Instalar dependencias: `pip install -r backend/requirements.txt`.
3. Copiar `backend/.env.example` como `backend/.env` y configurar PostgreSQL/PostGIS.
4. Entrar a `backend/`.
5. Ejecutar `python manage.py makemigrations` y `python manage.py migrate`.
6. Crear un administrador con `python manage.py createsuperuser`.
7. Iniciar el servidor con `python manage.py runserver`.

## Documentación

- [Desarrollo con Docker](docs/docker-desarrollo.md)
- [Progreso del proyecto](docs/progreso-del-proyecto.md)
- [Guía de ejecución en otro equipo](docs/guia-ejecucion-en-otro-equipo.md)
- [Arquitectura del backend](docs/arquitectura-backend.md)
- [Importación de datos de dengue](docs/importacion-dengue.md)
