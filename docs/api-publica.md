# API pública de SIVAD

Documentación interactiva:

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- Esquema OpenAPI: `http://localhost:8000/api/esquema/`

## Endpoints

| Ruta | Descripción |
|---|---|
| `/api/publica/resumen/` | Conteo total y distribución por estatus. |
| `/api/publica/anios-disponibles/` | Años con registros epidemiológicos cargados. |
| `/api/publica/entidades-disponibles/` | Catálogo de entidades federativas con clave y nombre. |
| `/api/publica/serie-temporal/` | Conteos mensuales por fecha de inicio de síntomas. |
| `/api/publica/distribucion-territorial/` | Conteos por entidad o municipio. |
| `/api/publica/mapa-entidades/` | Límites de entidades cargados en GeoJSON, con conteo de casos confirmados. |
| `/api/publica/mapa-municipios/?entidad=12` | Límites municipales GeoJSON de una entidad, con conteo y punto representativo. |

Filtros: `anio_inicial`, `anio_final`, `entidad`, `municipio` y `estatus`. El estatus predeterminado es `2` para casos confirmados.

Ejemplo de confirmados de Guerrero durante 2020:

```text
/api/publica/resumen/?anio_inicial=2020&anio_final=2020&entidad=12
```
