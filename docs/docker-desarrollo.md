# Desarrollo con Docker

Docker crea un contenedor para Django con GDAL y otro para PostgreSQL 16 con PostGIS 3.5.

## Inicio

Desde la raíz del proyecto, ejecutar:

```text
docker compose up --build
```

El backend queda disponible en `http://localhost:8000/estado/` y la administración en `http://localhost:8000/administracion/`.

## Conectar pgAdmin

El servicio `base_datos` publica el puerto de PostgreSQL en el equipo local (`5432:5432`). Con los contenedores en ejecución, registra un servidor en pgAdmin con estos datos:

| Campo | Valor |
|---|---|
| Host name/address | `localhost` |
| Port | `5432` |
| Maintenance database | `sivad` |
| Username | `sivad` |
| Password | `sivad_desarrollo` |

Si cambias el puerto publicado en `docker-compose.yml` porque el `5432` ya está ocupado, por ejemplo a `5433:5432`, usa ese puerto del equipo (`5433`) en pgAdmin. Después de cambiar la configuración, aplica el cambio con:

```text
docker compose up -d base_datos
```

Si pgAdmin muestra `FATAL: role "sivad" does not exist`, comprueba que `docker compose ps` muestre el mapeo de puerto del servicio `base_datos` y que pgAdmin se conecte a ese puerto. Puede haber otro servidor PostgreSQL escuchando en el puerto local.

La publicación del puerto está pensada para desarrollo local; no uses estas credenciales ni expongas este puerto en producción.

El contenedor Django aplica migraciones al iniciar. Una vez en ejecución, crear el administrador con:

```text
docker compose exec backend python manage.py createsuperuser
```

Después, cargar los catálogos y el corte de 2020 siguiendo [importacion-dengue.md](importacion-dengue.md).

## Producción

En un servicio de hosting se despliega solo la imagen de `backend/Dockerfile`. La base de datos debe ser un servicio PostgreSQL administrado con la extensión PostGIS habilitada. Se deben configurar `SECRETO_DJANGO`, `DEPURACION=False`, `HOSTS_PERMITIDOS` y `URL_BD` como secretos del proveedor.

No se deben usar las contraseñas incluidas en `docker-compose.yml` ni publicar el puerto de la base de datos fuera del desarrollo local.
