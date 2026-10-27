# Guía para ejecutar SIVAD en otro equipo

## Requisitos

- Git, si el proyecto se obtiene desde un repositorio.
- Docker Desktop actualizado y en ejecución.
- Al menos 4 GB de memoria disponibles para Docker.
- Puerto local `8000` libre.

No es necesario instalar Python, PostgreSQL, PostGIS ni GDAL directamente en el equipo. Docker proporciona estos componentes dentro de los contenedores.

## Obtener el proyecto

Copiar o clonar la carpeta completa del proyecto. Deben incluirse, como mínimo:

```text
backend/
  data/
  Dockerfile
  requirements.txt
docker-compose.yml
docs/
```

Los archivos de datos bajo `backend/data/` son necesarios para cargar catálogos y el corte histórico incluido.

## Migrar una base de datos existente

Si el sistema ya tiene usuarios, registros epidemiológicos, importaciones o geometrías cargadas, estos datos están en el volumen Docker `datos_postgres`. Para trasladarlos a otro equipo se recomienda un respaldo lógico de PostgreSQL/PostGIS, no copiar directamente los archivos internos del volumen.

En el equipo de origen, con los servicios iniciados, crear el respaldo:

```powershell
docker compose exec base_datos sh -c "pg_dump -U sivad -Fc sivad -f /tmp/sivad.dump"

$contenedor = docker compose ps -q base_datos
docker cp "${contenedor}:/tmp/sivad.dump" .\respaldo-sivad.dump

docker compose exec base_datos rm /tmp/sivad.dump
```

Copiar al nuevo equipo la carpeta completa del proyecto, el archivo `respaldo-sivad.dump` y, si existen, los archivos `.env` con la configuración local.

En el equipo destino, antes de iniciar el backend, levantar solo la base de datos y restaurar el respaldo:

```powershell
docker compose up -d base_datos

$contenedor = docker compose ps -q base_datos
docker cp .\respaldo-sivad.dump "${contenedor}:/tmp/sivad.dump"

docker compose exec base_datos sh -c "pg_restore -U sivad -d sivad --clean --if-exists /tmp/sivad.dump"
docker compose exec base_datos rm /tmp/sivad.dump
```

Después continuar con el inicio normal de todos los servicios. El respaldo recupera la base `sivad`, incluidos los usuarios, datos epidemiológicos, catálogos, importaciones y geometrías PostGIS.

## Iniciar los servicios

Abrir una terminal en la raíz del proyecto y ejecutar:

```text
docker compose up --build -d
```

Este comando construye el backend, inicia PostgreSQL/PostGIS y aplica automáticamente las migraciones. En el primer inicio puede tardar varios minutos porque descarga las imágenes y dependencias.

Comprobar el estado:

```text
docker compose ps
```

Comprobar el backend en un navegador:

```text
http://localhost:8000/estado/
```

La respuesta esperada contiene `SIVAD` y el estado `disponible`.

Para visualizar la base de datos desde pgAdmin, consulta [Desarrollo con Docker](docker-desarrollo.md#conectar-pgadmin), donde se indican el host, puerto y credenciales de desarrollo.

## Crear el administrador

Crear una cuenta administrativa local:

```text
docker compose exec backend python manage.py createsuperuser
```

Elegir un nombre de usuario, correo opcional y contraseña segura. Después acceder a:

```text
http://localhost:8000/administracion/
```

## Cargar catálogos territoriales

Ejecutar una sola vez por base de datos nueva:

```text
docker compose exec backend python manage.py cargar_catalogos data/diccionario_datos_dengue/catalogos_dengue.xlsx
```

## Importar datos epidemiológicos

Sustituir `USUARIO_ADMINISTRADOR` por el nombre de usuario creado:

```text
docker compose exec backend python manage.py importar_dengue "data/2020/datos_abiertos_dengue_311220/Datos abiertos dengue_311220.csv" --usuario USUARIO_ADMINISTRADOR
```

Al finalizar, la administración mostrará la importación, los conteos aceptados/rechazados y la muestra de errores detectados.

## Comandos operativos

Ver registros del backend:

```text
docker compose logs -f backend
```

Detener servicios sin borrar datos:

```text
docker compose down
```

Iniciar nuevamente:

```text
docker compose up -d
```

Recrear todo, incluida la base local y sus datos:

```text
docker compose down -v
docker compose up --build -d
```

El último procedimiento elimina la base de datos local. Después será necesario crear de nuevo el superusuario, cargar catálogos e importar los CSV.

Si hay información que se desea conservar, crear un respaldo antes de ejecutar `docker compose down -v`.

## Actualizar el código

Después de obtener cambios que modifiquen dependencias, Dockerfile o modelos Django, ejecutar:

```text
docker compose up --build -d
```

Si los cambios incluyen nuevas migraciones, el contenedor las aplicará al iniciar. Si se agregan modelos nuevos, generar las migraciones antes de publicar el cambio:

```text
docker compose run --rm --entrypoint python backend manage.py makemigrations
```

## Consideraciones para producción

- No usar la contraseña incluida en `docker-compose.yml` fuera de desarrollo.
- Configurar `SECRETO_DJANGO` como secreto seguro.
- Configurar `DEPURACION=False`.
- Limitar `HOSTS_PERMITIDOS` al dominio público real.
- Usar PostgreSQL administrado con PostGIS y respaldos automáticos.
- Guardar los archivos de origen en almacenamiento persistente y respaldado.
