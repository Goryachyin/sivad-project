# Auditoría UX — panel público SIVAD

Fecha: 15 de septiembre de 2026. Alcance: consulta pública de dengue en escritorio y móvil. Se evaluó el flujo de consulta nacional, el filtro por entidad (clave `12`, Guerrero), el estado vacío (clave `99`) y la indisponibilidad de API con datos de prueba.

## Resultado

El recorrido principal es comprensible y mantiene la procedencia de los datos visible: la API devolvió 24,224 casos confirmados nacionales de 2020 y 609 para Guerrero. En móvil, filtros, métricas, gráfica y tabla se apilan sin requerir desplazamiento horizontal.

## Problemas encontrados y corregidos

| Hallazgo | Corrección aplicada |
| --- | --- |
| La llamada directa a `localhost:8000` fallaba por origen distinto. | Se configuró el proxy de desarrollo de Vite para `/api`; el panel ahora consume los endpoints reales. |
| Serie temporal y distribución territorial usaban una forma de respuesta equivocada. | Se adaptaron `serie_mensual` y los campos territoriales reales antes de renderizar. |
| Podían mostrarse filas sin nombre y valores `NaN`. | Se excluyen resultados territoriales sin nombre y se normalizan los campos consumidos. |
| No había un estado explícito cuando una consulta no devolvía datos. | Se añadió el mensaje de estado vacío con una acción clara: revisar o eliminar el filtro. |
| El rojo podía interpretarse por sí solo como una alerta. | Siempre acompaña el texto “Casos confirmados”; los datos de prueba se anuncian además con el símbolo `⚠` y texto. |
| La navegación era escasa en pantalla pequeña. | En móvil se conserva la marca y el enlace de API, mientras la información se presenta en una sola columna legible. |

## Criterios revisados

- Visibilidad del estado: indicador “Actualizando consulta…”, fuente de datos y estado vacío.
- Correspondencia con el dominio: casos confirmados, periodo histórico y clasificación oficial se nombran explícitamente.
- Prevención de errores: ejemplo de clave de entidad y mensaje de recuperación ante consulta sin resultados.
- Accesibilidad: controles con etiquetas, navegación semántica, tabla con encabezados, contraste alto y señalización textual además del color.
- Adaptación móvil: prueba a 390 × 844 px; no se detectó desbordamiento horizontal.

Pendiente para una fase posterior: selector por nombre de entidad y mapa PostGIS/Leaflet, cuando se publique una geometría optimizada para consumo web.
