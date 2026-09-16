# Progreso del proyecto SIVAD

## Propósito

SIVAD es el Sistema de Información y Visualización Analítica del Dengue. Su primera versión integra datos históricos de dengue, permite administrarlos de manera trazable y prepara la información para su consulta territorial y temporal.

## Alcance actual

La primera etapa implementada cubre el núcleo de datos y administración definido en la ERS:

- autenticación administrativa de Django;
- almacenamiento espacial con PostgreSQL y PostGIS;
- catálogos de entidades federativas y municipios;
- importación validada de archivos CSV de dengue;
- registro de cada operación de importación;
- conservación del estado actual de cada registro epidemiológico;
- entorno Docker reproducible con Django, GDAL y PostGIS.

## Arquitectura implementada

```text
Navegador
    |
    +-- Administración Django: http://localhost:8000/administracion/
    |
Django + Gunicorn + GDAL
    |
PostgreSQL 16 + PostGIS 3.5
```

El servicio `backend` utiliza Django y GDAL para trabajar con campos geográficos. El servicio `base_datos` usa PostgreSQL 16 y PostGIS 3.5. Los recursos estáticos de la administración son recolectados al iniciar y servidos por WhiteNoise.

## Componentes del backend

| Aplicación | Responsabilidad |
|---|---|
| `usuarios` | Administración de cuentas y acceso al módulo protegido. |
| `geografia` | Entidades federativas, municipios y futuras geometrías oficiales. |
| `importaciones` | Bitácora, validación y trazabilidad de las cargas. |
| `epidemiologia` | Registros de dengue, clasificación y relaciones territoriales. |
| `paneles` | Base para los futuros endpoints públicos del dashboard. |

## Datos cargados

Se importó el corte más reciente disponible de 2020: `datos_abiertos_dengue_311220`.

| Resultado | Cantidad |
|---|---:|
| Registros aceptados | 120,228 |
| Registros rechazados | 11 |
| Casos probables | 67,432 |
| Casos confirmados | 24,224 |
| Casos descartados | 28,572 |

Los 11 registros rechazados tienen una combinación de entidad y municipio que no corresponde al catálogo territorial. El detalle de dichas filas se conserva en la importación dentro de la administración.

## Reglas implementadas

- `ID_REGISTRO` identifica un registro epidemiológico de manera única.
- Las actualizaciones se aplican por `ID_REGISTRO`; los cortes semanales no se suman entre sí.
- El indicador principal futuro será el conteo de registros con `ESTATUS_CASO = 2`, es decir, casos confirmados.
- Los estatus probable y descartado se conservan para consulta, pero no se confunden con casos confirmados.
- Las fechas se normalizan desde los formatos `AAAA-MM-DD` y `DD/MM/AAAA`.
- Los códigos territoriales se contrastan con los catálogos cargados.
- Un mismo archivo no se vuelve a importar si tiene un hash SHA-256 ya procesado.

## Verificaciones realizadas

- Migraciones Django aplicadas correctamente.
- PostGIS disponible y funcional.
- Catálogos cargados: 38 entidades federativas y 2,500 municipios.
- Endpoint de estado disponible en `http://localhost:8000/estado/`.
- Recursos estáticos del administrador verificados con respuestas CSS y JavaScript correctas.

## Próximos pasos

1. Crear la API pública del dashboard.
2. Incorporar filtros por periodo, entidad y municipio.
3. Exponer indicadores y series temporales validadas.
4. Construir el frontend con React y TypeScript.
5. Añadir mapas, gráficas y pruebas automatizadas.
