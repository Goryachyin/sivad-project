# Desarrollo con Docker

Docker crea un contenedor para Django con GDAL y otro para PostgreSQL 16 con PostGIS 3.5.

## Inicio

Desde la raíz del proyecto, ejecutar:

```text
docker compose up --build
```

El backend queda disponible en `http://localhost:8000/estado/` y la administración en `http://localhost:8000/administracion/`.

El contenedor Django aplica migraciones al iniciar. Una vez en ejecución, crear el administrador con:

```text
docker compose exec backend python manage.py createsuperuser
```

Después, cargar los catálogos y el corte de 2020 siguiendo [importacion-dengue.md](importacion-dengue.md).

## Producción

En un servicio de hosting se despliega solo la imagen de `backend/Dockerfile`. La base de datos debe ser un servicio PostgreSQL administrado con la extensión PostGIS habilitada. Se deben configurar `SECRETO_DJANGO`, `DEPURACION=False`, `HOSTS_PERMITIDOS` y `URL_BD` como secretos del proveedor.

No se deben usar las contraseñas incluidas en `docker-compose.yml` fuera del desarrollo local.
