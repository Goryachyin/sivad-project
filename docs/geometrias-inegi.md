# Geometrías oficiales para el mapa

El mapa consume límites de áreas geoestadísticas estatales (AGEE) mediante el servicio GeoJSON oficial del INEGI. La carga transforma el sistema de referencia publicado por el servicio (`EPSG:6365`, GCS_Mexico_ITRF2008) a `EPSG:4326`, que es el SRID almacenado por PostGIS en SIVAD.

La API entrega una simplificación de visualización de los polígonos. Los límites originales se conservan en PostGIS; la simplificación solo reduce el peso de descarga del navegador.

## Carga

Con los contenedores activos, ejecutar desde la raíz:

```powershell
docker compose exec backend python manage.py cargar_limites_inegi
```

El comando exige que INEGI devuelva exactamente 32 áreas y que cada clave exista en el catálogo local; así evita cargas parciales o desalineadas. Puede ejecutarse nuevamente para actualizar los límites.

Fuente: [Servicio GeoJSON de áreas geoestadísticas estatales de INEGI](https://gaia.inegi.org.mx/wscatgeo/v2/geo/mgee/). La respuesta consultada identifica su fuente vectorial como Marco Geoestadístico, diciembre de 2025.
