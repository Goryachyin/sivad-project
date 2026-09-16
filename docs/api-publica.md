# API pública de SIVAD

Documentación interactiva:

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- Esquema OpenAPI: `http://localhost:8000/api/esquema/`

## Endpoints

| Ruta | Descripción |
|---|---|
| `/api/publica/resumen/` | Conteo total y distribución por estatus. |
| `/api/publica/serie-temporal/` | Conteos mensuales por fecha de inicio de síntomas. |
| `/api/publica/distribucion-territorial/` | Conteos por entidad o municipio. |
| `/api/publica/mapa-entidades/` | Límites de entidades cargados en GeoJSON, con conteo de casos confirmados. |

Filtros: `anio_inicial`, `anio_final`, `entidad`, `municipio` y `estatus`. El estatus predeterminado es `2` para casos confirmados.

Ejemplo de confirmados de Guerrero durante 2020:

```text
/api/publica/resumen/?anio_inicial=2020&anio_final=2020&entidad=12
```
