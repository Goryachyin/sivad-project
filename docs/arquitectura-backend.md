# Arquitectura del backend

El backend usa Django y PostgreSQL con la extensión PostGIS.

## Aplicaciones

- `usuarios`: acceso de administradores.
- `geografia`: entidades federativas, municipios y geometrías.
- `importaciones`: cargas de archivos y bitácora de validación.
- `epidemiologia`: registro actual de cada notificación de dengue.
- `paneles`: consultas públicas agregadas para el dashboard.

## Regla de actualización

`ID_REGISTRO` es único. Cada nueva carga actualiza el registro existente cuando el identificador ya exista y registra la importación que produjo la versión actual.

Los cortes semanales no deben agregarse entre sí. Para 2020 se utilizará inicialmente el corte más reciente: `datos_abiertos_dengue_311220`.

