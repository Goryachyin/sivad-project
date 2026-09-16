# DOCUMENTO DE ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (ERS)

## Sistema Web de Integración y Visualización Analítica de Indicadores Epidemiológicos del Dengue para la Alerta Temprana

**Institución:** Tecnológico Nacional de México — Instituto Tecnológico de Acapulco  
**Carrera:** Ingeniería en Sistemas Computacionales  
**Asignatura:** Taller de Investigación II  
**Versión:** 1.0  
**Fecha:** Septiembre de 2026  

---

# 1. Introducción

## 1.1 Propósito del documento

El presente Documento de Especificación de Requisitos de Software (ERS) tiene como finalidad definir de manera formal las características, funciones, restricciones y criterios de aceptación del sistema web propuesto para la integración, consulta, visualización y análisis de información epidemiológica relacionada con el dengue.

El documento servirá como referencia para las etapas de análisis, diseño, desarrollo, pruebas, implementación y validación del sistema.

La propuesta tiene como objetivo desarrollar una aplicación web que recoja, ordene y comparta información sobre enfermedades vectoriales, principalmente dengue, incorporando variables territoriales para identificar tendencias y generar información relacionada con posibles zonas de riesgo.

La ERS también establece una distinción entre:

- funcionalidades correspondientes al núcleo inicial del sistema;
- funcionalidades que requieren información ambiental adicional;
- funcionalidades avanzadas de análisis y predicción que deberán validarse antes de incorporarse como mecanismos de alerta.

---

# 2. Alcance del sistema

## 2.1 Nombre del sistema

**Sistema Web de Integración y Visualización Analítica de Indicadores Epidemiológicos del Dengue para la Alerta Temprana.**

Para efectos del presente documento podrá utilizarse la abreviatura:

**SIVAD — Sistema de Información y Visualización Analítica del Dengue.**

## 2.2 Descripción general

El sistema será una plataforma web destinada a organizar y facilitar la consulta de información epidemiológica del dengue mediante una interfaz interactiva.

El sistema permitirá consultar información histórica, analizar su comportamiento temporal y territorial y representar los resultados mediante indicadores, gráficas y mapas.

El proyecto preliminar plantea precisamente la integración de una base de datos histórica, un dashboard interactivo, mapas, gráficas e indicadores.

## 2.3 Cobertura temporal

La plataforma deberá trabajar con:

**Todos los años disponibles en las fuentes de información incorporadas al sistema.**

El sistema no deberá asumir un año inicial o final fijo. La cobertura temporal deberá determinarse dinámicamente a partir de los datos cargados.

## 2.4 Cobertura geográfica

La cobertura será:

**Todo México, con énfasis analítico y visual en el estado de Guerrero.**

Esto amplía el alcance geográfico planteado inicialmente para Guerrero, permitiendo conservar Guerrero como territorio prioritario sin limitar la plataforma a dicho estado.

La información deberá poder analizarse, como mínimo, a nivel de:

- entidad federativa;
- municipio.

Cuando las fuentes lo permitan, podrán incorporarse niveles geográficos adicionales en etapas posteriores.

## 2.5 Usuarios

El sistema contemplará dos perfiles principales:

### Usuario público

Podrá acceder al sistema sin autenticación.

Tendrá acceso a las funcionalidades de:

- consulta;
- filtrado;
- visualización;
- mapas;
- gráficas;
- indicadores;
- análisis histórico disponible para consulta pública.

El planteamiento original contempla como usuarios potenciales a autoridades sanitarias, personal de vigilancia epidemiológica, investigadores, alumnos, instituciones educativas y gubernamentales y personas interesadas en consultar información sobre dengue.

### Administrador

Tendrá acceso mediante autenticación y podrá realizar operaciones de administración de datos y configuración que no estarán disponibles para el usuario público.

Entre estas operaciones se contempla:

- carga de información;
- validación de importaciones;
- administración de conjuntos de datos;
- consulta de registros de procesamiento;
- administración de parámetros del sistema;
- revisión de errores de procesamiento.

---

# 3. Objetivos del sistema

## 3.1 Objetivo general

Desarrollar una aplicación web que recoja, ordene y comparta información sobre enfermedades vectoriales, principalmente dengue, integrando información territorial para identificar tendencias y generar información sobre áreas potencialmente peligrosas, con énfasis en Guerrero.

## 3.2 Objetivos específicos

El sistema deberá contribuir a:

1. Construir una base de datos histórica a partir de registros públicos.
2. Integrar información epidemiológica y territorial.
3. Incorporar posteriormente variables ambientales relevantes.
4. Permitir consultas mediante un dashboard interactivo.
5. Visualizar la distribución y comportamiento de los casos mediante mapas, gráficas e indicadores.
6. Facilitar la comparación temporal y territorial.
7. Generar indicadores relacionados con posibles condiciones de riesgo cuando existan datos y métodos suficientemente validados.
8. Comprobar mediante pruebas el correcto funcionamiento de la extracción, almacenamiento, procesamiento, visualización, análisis, predicción, funcionamiento y usabilidad.

---

# 4. Descripción de los datos

## 4.1 Fuente inicial

El conjunto de datos proporcionado para la especificación corresponde a:

**`dengue_abierto.csv`**

Este conjunto constituye la fuente inicial para el desarrollo de la base histórica epidemiológica.

El proyecto preliminar plantea utilizar información pública relacionada con el dengue y señala como referencia a la Dirección General de Epidemiología del Gobierno de México.

## 4.2 Información epidemiológica disponible

La estructura del conjunto de datos contiene campos relacionados con características del registro, ubicación, fechas, características del paciente, antecedentes, defunción, dictamen, toma de muestra, resultado de laboratorio y estado del caso.

Entre las variables identificadas se encuentran campos correspondientes a:

- fecha de actualización;
- identificador del registro;
- sexo;
- edad;
- entidad de residencia;
- municipio de residencia;
- entidad y municipio de notificación;
- institución de notificación;
- fecha de inicio de síntomas;
- tipo de paciente;
- condiciones clínicas;
- defunción;
- dictamen;
- toma de muestra;
- resultado PCR;
- estatus del caso;
- entidad y municipio asignados.

Estas variables permitirán establecer la base inicial para las consultas epidemiológicas y territoriales.

## 4.3 Fuentes ambientales

Las fuentes ambientales **no forman parte de la primera versión de los datos del sistema**.

Su integración queda definida como una etapa posterior.

El documento preliminar contempla específicamente la incorporación de:

- precipitación;
- temperatura;
- humedad.



Por lo tanto, ningún requisito de la primera versión deberá asumir que dichas variables ya están disponibles.

---

# 5. Actores del sistema

| Actor | Descripción |
|---|---|
| Usuario público | Consulta información epidemiológica sin autenticación. |
| Investigador/estudiante | Utiliza las consultas y visualizaciones para análisis académico. |
| Personal de vigilancia | Consulta tendencias y distribución territorial. |
| Autoridad sanitaria | Puede consultar información para análisis y monitoreo. |
| Administrador | Administra datos, procesos de actualización y configuración. |
| Fuente de datos | Proporciona conjuntos de información epidemiológica al sistema. |

Los perfiles de autoridades sanitarias, vigilancia epidemiológica, investigadores, alumnos e instituciones se encuentran contemplados en el proyecto preliminar.

---

# 6. Requisitos funcionales

Los requisitos funcionales se identifican mediante el prefijo **RF**.

## RF-01 — Acceso público

**Descripción:**  
El sistema deberá permitir que cualquier usuario consulte la información epidemiológica pública sin necesidad de crear una cuenta o iniciar sesión.

**Prioridad:** Alta.

**Criterio de aceptación:**  
Un usuario no autenticado deberá poder acceder al dashboard y realizar consultas públicas.

---

## RF-02 — Autenticación administrativa

**Descripción:**  
El sistema deberá proporcionar un mecanismo de autenticación para acceder al módulo administrativo.

**Prioridad:** Alta.

**Criterio de aceptación:**  
Las funciones administrativas deberán permanecer inaccesibles para usuarios no autenticados.

---

## RF-03 — Importación de datos

**Descripción:**  
El administrador deberá poder incorporar conjuntos de datos epidemiológicos al sistema.

La primera implementación deberá contemplar como fuente de entrada el archivo CSV utilizado como conjunto de datos inicial.

**Prioridad:** Alta.

**Criterio de aceptación:**

- El administrador selecciona un archivo válido.
- El sistema verifica su estructura.
- El sistema identifica errores.
- El sistema informa el resultado de la importación.
- Los datos válidos quedan disponibles para procesamiento.

---

## RF-04 — Validación de datos

**Descripción:**  
Antes de almacenar información, el sistema deberá validar la estructura y consistencia básica del conjunto de datos.

La validación deberá considerar, según corresponda:

- campos obligatorios;
- tipos de datos;
- fechas;
- identificadores;
- valores inválidos;
- registros duplicados;
- entidades y municipios;
- valores faltantes;
- códigos utilizados por la fuente.

**Prioridad:** Alta.

**Criterio de aceptación:**  
Un conjunto de datos que no cumpla las reglas mínimas deberá ser rechazado o marcado para revisión sin incorporarse silenciosamente a la información oficial.

---

## RF-05 — Almacenamiento histórico

**Descripción:**  
El sistema deberá almacenar los datos epidemiológicos procesados en una estructura persistente que permita realizar consultas históricas.

**Prioridad:** Alta.

**Criterio de aceptación:**  
Los registros importados correctamente deberán permanecer disponibles después de finalizar el proceso de carga.

---

## RF-06 — Consulta temporal

**Descripción:**  
El usuario podrá consultar información seleccionando diferentes periodos.

Los filtros deberán permitir, como mínimo:

- año;
- periodo inicial;
- periodo final.

Cuando la granularidad disponible lo permita, podrán incorporarse:

- mes;
- semana epidemiológica;
- fecha.

**Prioridad:** Alta.

**Criterio de aceptación:**  
Al modificar el periodo, las visualizaciones deberán actualizarse utilizando exclusivamente los datos correspondientes al intervalo seleccionado.

---

## RF-07 — Consulta territorial

**Descripción:**  
El usuario podrá filtrar información por:

- México;
- entidad federativa;
- municipio.

**Prioridad:** Alta.

**Criterio de aceptación:**  
La selección de una entidad deberá actualizar los indicadores, gráficas y mapas relacionados con dicha entidad.

---

## RF-08 — Énfasis en Guerrero

**Descripción:**  
El sistema deberá proporcionar mecanismos que faciliten la consulta y análisis de Guerrero sin excluir el resto de México.

**Prioridad:** Alta.

**Criterio de aceptación:**  
Guerrero deberá poder seleccionarse directamente desde la interfaz y deberá ser posible consultar sus municipios y comportamiento histórico.

---

## RF-09 — Dashboard epidemiológico

**Descripción:**  
El sistema deberá proporcionar un dashboard que concentre los principales indicadores y visualizaciones epidemiológicas.

El dashboard podrá incluir:

- total de registros/casos según clasificación definida;
- distribución territorial;
- evolución temporal;
- comparación entre entidades;
- comparación entre municipios;
- indicadores epidemiológicos disponibles.

El concepto de dashboard planteado en el proyecto consiste precisamente en concentrar indicadores y visualizaciones, incluyendo filtros interactivos.

**Prioridad:** Alta.

---

## RF-10 — Visualización mediante gráficas

**Descripción:**  
El sistema deberá representar la información mediante gráficas adecuadas para analizar su comportamiento temporal y territorial.

Se podrán contemplar:

- gráficas de líneas;
- barras;
- distribución porcentual;
- comparaciones;
- tendencias históricas.

**Prioridad:** Alta.

---

## RF-11 — Visualización cartográfica

**Descripción:**  
El sistema deberá proporcionar mapas interactivos para representar la distribución territorial de los casos.

El mapa deberá permitir seleccionar o consultar:

- entidades;
- municipios;
- periodos;
- indicadores disponibles.

El proyecto plantea explícitamente utilizar mapas para observar la distribución geográfica de los casos y facilitar la comparación entre territorios.

**Prioridad:** Alta.

---

## RF-12 — Indicadores epidemiológicos

**Descripción:**  
El sistema deberá calcular y presentar indicadores epidemiológicos definidos formalmente por el proyecto.

Como candidatos iniciales se contemplan:

- número de casos;
- distribución porcentual;
- variación temporal;
- incidencia, cuando se disponga de la población necesaria;
- letalidad, cuando las variables disponibles permitan calcularla.

La definición matemática definitiva de cada indicador deberá documentarse antes de su implementación.

El documento preliminar menciona número de casos, tasa de incidencia, letalidad y canal endémico como ejemplos de indicadores epidemiológicos.

---

## RF-13 — Comparación temporal

**Descripción:**  
El sistema deberá permitir comparar el comportamiento del dengue entre diferentes periodos.

Ejemplos:

- año contra año;
- periodo contra periodo;
- evolución histórica de un municipio;
- evolución histórica de una entidad.

**Prioridad:** Alta.

---

## RF-14 — Comparación territorial

**Descripción:**  
El sistema deberá permitir comparar diferentes entidades y municipios mediante indicadores y visualizaciones.

**Prioridad:** Alta.

**Criterio de aceptación:**  
El usuario deberá poder seleccionar al menos dos unidades territoriales cuando la visualización utilizada soporte comparación.

---

## RF-15 — Consulta detallada de municipio

**Descripción:**  
El sistema deberá permitir seleccionar un municipio y mostrar información histórica correspondiente al mismo.

La vista podrá incluir:

- casos;
- evolución temporal;
- indicadores;
- distribución por características disponibles;
- información territorial;
- posteriormente, variables ambientales.

**Prioridad:** Alta.

---

## RF-16 — Integración de variables ambientales

**Descripción:**  
En una etapa posterior, el sistema deberá permitir incorporar información ambiental asociada temporal y territorialmente a los registros epidemiológicos.

Las variables consideradas inicialmente serán:

- temperatura;
- precipitación;
- humedad.

**Prioridad:** Media / segunda etapa.

**Criterio de aceptación:**  
Una vez integrada una fuente ambiental validada, el sistema deberá poder relacionar sus datos con la unidad temporal y territorial correspondiente.

---

## RF-17 — Análisis de relación epidemiológica-ambiental

**Descripción:**  
Cuando existan datos ambientales suficientes, el sistema deberá permitir explorar relaciones entre los casos de dengue y las condiciones ambientales.

El objetivo será identificar patrones o comportamientos, no establecer automáticamente causalidad.

El proyecto plantea buscar correlaciones o comportamientos entre casos y condiciones ambientales.

**Prioridad:** Media / segunda etapa.

---

## RF-18 — Indicadores de riesgo

**Descripción:**  
En una etapa posterior, el sistema podrá generar indicadores destinados a identificar municipios o zonas que presenten condiciones potencialmente favorables para el vector o para un incremento de casos.

**Prioridad:** Media / segunda etapa.

**Restricción:**  
Los indicadores de riesgo deberán contar con una metodología documentada y validada antes de presentarse como información de alerta.

El documento preliminar contempla niveles de riesgo para representar visualmente posibles condiciones favorables.

---

## RF-19 — Alertas tempranas

**Descripción:**  
En una etapa posterior, el sistema podrá generar alertas basadas en indicadores epidemiológicos, territoriales y ambientales.

Las alertas deberán indicar:

- territorio;
- periodo;
- indicador utilizado;
- nivel o condición detectada;
- fecha de generación;
- metodología utilizada.

**Prioridad:** Media / segunda etapa.

**Restricción:**  
Una alerta generada por el sistema deberá presentarse como resultado analítico del sistema y no como diagnóstico médico ni como instrucción sanitaria.

---

## RF-20 — Administración de conjuntos de datos

**Descripción:**  
El administrador deberá poder consultar información relacionada con las cargas realizadas.

Como mínimo:

- nombre del archivo;
- fecha de carga;
- cantidad de registros;
- resultado de validación;
- errores detectados;
- estado del procesamiento.

**Prioridad:** Alta.

---

## RF-21 — Trazabilidad de datos

**Descripción:**  
El sistema deberá conservar información que permita identificar de qué conjunto de datos proviene cada carga o proceso de actualización.

**Prioridad:** Alta.

---

## RF-22 — Información de fuente y actualización

**Descripción:**  
La interfaz deberá informar al usuario:

- fuente de los datos;
- fecha de actualización;
- periodo cubierto;
- fecha de consulta, cuando sea necesario;
- notas metodológicas relevantes.

**Prioridad:** Alta.

---

## RF-23 — Manejo de datos faltantes

**Descripción:**  
El sistema deberá identificar y manejar explícitamente valores faltantes.

No deberá sustituir automáticamente valores faltantes por cero salvo que dicha transformación esté definida y justificada para la variable correspondiente.

**Prioridad:** Alta.

---

## RF-24 — Exportación de resultados

**Descripción:**  
Como funcionalidad complementaria, el sistema podrá permitir la exportación de resultados filtrados para análisis posterior.

Formatos posibles:

- CSV;
- XLSX;
- imagen de visualización.

**Prioridad:** Baja / segunda etapa.

---

# 7. Requisitos no funcionales

Los requisitos no funcionales se identifican mediante **RNF**.

## RNF-01 — Seguridad

El módulo administrativo deberá estar protegido mediante autenticación.

Los usuarios públicos no deberán tener acceso a operaciones administrativas.

**Prioridad:** Alta.

---

## RNF-02 — Integridad de datos

El sistema deberá preservar la integridad de los datos durante:

- importación;
- transformación;
- almacenamiento;
- actualización;
- consulta.

Los datos originales no deberán modificarse de manera irreversible durante el procesamiento.

**Prioridad:** Alta.

---

## RNF-03 — Trazabilidad

Toda actualización de información deberá poder relacionarse con una fuente y una operación de carga determinada.

**Prioridad:** Alta.

---

## RNF-04 — Transparencia metodológica

Los indicadores mostrados deberán contar con una definición documentada.

El usuario deberá poder consultar información suficiente para comprender:

- qué representa el indicador;
- qué datos utiliza;
- qué periodo considera;
- qué unidad territorial utiliza.

**Prioridad:** Alta.

---

## RNF-05 — Rendimiento

Las consultas habituales del dashboard deberán responder en un tiempo razonable bajo las condiciones de infraestructura establecidas para el proyecto.

Como criterio inicial de aceptación se propone que las consultas ordinarias respondan en un máximo de **3 segundos**, excluyendo procesos pesados de generación o actualización de datos.

Este valor podrá ajustarse después de realizar pruebas de carga.

---

## RNF-06 — Disponibilidad

El sistema deberá permanecer disponible para consulta pública durante el periodo establecido para su operación.

Las actividades administrativas de actualización deberán poder realizarse sin comprometer la integridad de la información histórica.

---

## RNF-07 — Usabilidad

La interfaz deberá ser comprensible para usuarios con diferentes niveles de experiencia técnica.

Deberá priorizar:

- navegación sencilla;
- filtros claros;
- visualizaciones comprensibles;
- etiquetas descriptivas;
- información contextual;
- mensajes de error comprensibles.

El proyecto contempla expresamente pruebas de funcionamiento y usabilidad.

---

## RNF-08 — Compatibilidad

El sistema deberá funcionar mediante navegadores web modernos de escritorio.

La interfaz deberá adaptarse, como mínimo, a diferentes resoluciones de pantalla.

---

## RNF-09 — Accesibilidad

Las principales funciones de consulta deberán ser accesibles mediante una interfaz clara y con suficiente contraste, jerarquía visual y textos descriptivos.

---

## RNF-10 — Mantenibilidad

El software deberá estar organizado modularmente para permitir modificar de manera independiente:

- procesamiento de datos;
- API;
- interfaz;
- visualizaciones;
- cálculo de indicadores;
- integración de fuentes ambientales.

---

## RNF-11 — Escalabilidad

La arquitectura deberá permitir incrementar posteriormente:

- número de registros;
- número de entidades;
- fuentes de información;
- variables ambientales;
- indicadores;
- usuarios concurrentes.

---

## RNF-12 — Reproducibilidad

Los procesos de limpieza y transformación de datos deberán poder ejecutarse nuevamente sobre una fuente equivalente obteniendo resultados consistentes.

---

## RNF-13 — Compatibilidad con cambios en las fuentes

El sistema deberá detectar modificaciones en la estructura de los archivos de entrada.

No deberá aceptar silenciosamente un archivo cuando hayan cambiado columnas, tipos de datos o estructuras fundamentales.

---

## RNF-14 — Protección de información

La aplicación deberá evitar exponer innecesariamente información que pueda permitir identificar directamente a personas.

Las visualizaciones públicas deberán trabajar preferentemente con información agregada.

---

# 8. Reglas de negocio

Las reglas de negocio se identifican mediante **RN**.

## RN-01 — Información pública

La información destinada a consulta pública no requerirá autenticación.

---

## RN-02 — Administración restringida

Solamente usuarios con permisos administrativos podrán importar, modificar o gestionar conjuntos de datos.

---

## RN-03 — Fuente oficial o documentada

Todo conjunto de datos incorporado deberá registrar su fuente de procedencia.

---

## RN-04 — Conservación histórica

La incorporación de nuevos datos no deberá eliminar automáticamente los datos históricos existentes.

---

## RN-05 — Identificación de duplicados

Un registro que ya haya sido incorporado no deberá duplicarse durante una nueva importación.

La estrategia exacta para identificar duplicados deberá definirse utilizando el identificador disponible y otros campos necesarios.

---

## RN-06 — Fechas válidas

Los registros utilizados para análisis temporal deberán contar con fechas válidas o deberán ser identificados como registros con información temporal incompleta.

---

## RN-07 — Clasificación de casos

Los conteos e indicadores deberán utilizar una definición explícita de qué registros son considerados casos.

El sistema no deberá asumir que todo registro presente en el CSV representa automáticamente un caso confirmado.

La clasificación deberá establecerse a partir de los campos y criterios definidos para el proyecto.

---

## RN-08 — Valores faltantes

Un valor faltante no deberá interpretarse automáticamente como ausencia del fenómeno.

Por ejemplo, un dato desconocido no deberá convertirse automáticamente en cero.

---

## RN-09 — Indicadores dependientes de población

La tasa de incidencia únicamente deberá calcularse cuando exista una población de referencia compatible con el territorio y periodo analizados.

---

## RN-10 — Comparabilidad temporal

Las comparaciones entre periodos deberán utilizar criterios equivalentes.

Cuando existan cambios metodológicos o diferencias relevantes en las fuentes, deberán indicarse al usuario.

---

## RN-11 — Datos ambientales posteriores

Los indicadores ambientales solamente podrán generarse cuando las fuentes correspondientes hayan sido integradas, validadas y asociadas correctamente con el periodo y territorio epidemiológico.

---

## RN-12 — Riesgo no equivale a diagnóstico

Los indicadores o niveles de riesgo generados por el sistema deberán interpretarse como resultados analíticos y no como diagnósticos médicos.

---

## RN-13 — Alertas metodológicamente justificadas

No se deberá activar una alerta únicamente porque un valor epidemiológico supere un umbral arbitrario.

Todo umbral o algoritmo deberá estar documentado y validado.

---

## RN-14 — Guerrero como territorio prioritario

La interfaz deberá facilitar el acceso y análisis de Guerrero, pero los datos nacionales deberán mantenerse disponibles para comparación.

---

## RN-15 — Integración progresiva

Las funcionalidades que dependan de fuentes ambientales o técnicas predictivas deberán poder incorporarse posteriormente sin requerir una reconstrucción completa del sistema.

Esta regla es consistente con el documento preliminar, que contempla las técnicas complejas como una posibilidad para etapas posteriores y propone concentrar inicialmente el sistema en integración, comparación y visualización.

---

# 9. Criterios de aceptación del sistema

## CA-01 — Carga de datos

**Dado:** un archivo epidemiológico con estructura válida.  
**Cuando:** el administrador realiza una importación.  
**Entonces:** el sistema deberá validar, procesar y almacenar los registros correctamente.

---

## CA-02 — Archivo inválido

**Dado:** un archivo con columnas obligatorias ausentes o tipos incompatibles.  
**Cuando:** el administrador intenta cargarlo.  
**Entonces:** el sistema deberá rechazarlo o enviarlo a revisión e informar el motivo.

---

## CA-03 — Consulta histórica

**Dado:** información correspondiente a diferentes años.  
**Cuando:** el usuario selecciona un intervalo temporal.  
**Entonces:** el sistema deberá mostrar exclusivamente la información correspondiente al intervalo seleccionado.

---

## CA-04 — Consulta por entidad

**Dado:** información de múltiples entidades.  
**Cuando:** el usuario selecciona una entidad.  
**Entonces:** las visualizaciones deberán actualizarse para mostrar el territorio seleccionado.

---

## CA-05 — Consulta municipal

**Dado:** información disponible por municipio.  
**Cuando:** el usuario selecciona un municipio.  
**Entonces:** deberá visualizar su información histórica disponible.

---

## CA-06 — Mapa

**Dado:** registros con información territorial válida.  
**Cuando:** el usuario abre el mapa.  
**Entonces:** deberá visualizarse la distribución territorial correspondiente a los filtros seleccionados.

---

## CA-07 — Dashboard

**Dado:** un conjunto de datos correctamente procesado.  
**Cuando:** el usuario accede al dashboard.  
**Entonces:** deberá visualizar indicadores y representaciones gráficas coherentes con los filtros seleccionados.

---

## CA-08 — Consistencia de indicadores

**Dado:** un conjunto de datos conocido.  
**Cuando:** el sistema calcula un indicador.  
**Entonces:** el resultado deberá coincidir con el cálculo de referencia definido en la especificación metodológica.

---

## CA-09 — Protección administrativa

**Dado:** un usuario no autenticado.  
**Cuando:** intenta acceder al módulo administrativo.  
**Entonces:** el sistema deberá impedir el acceso.

---

## CA-10 — Trazabilidad

**Dado:** una actualización de datos.  
**Cuando:** finaliza el proceso.  
**Entonces:** deberá existir un registro que permita identificar la fuente, fecha y resultado de la operación.

---

## CA-11 — Datos ambientales

**Dado:** que todavía no existen fuentes ambientales integradas.  
**Cuando:** el usuario consulta la plataforma inicial.  
**Entonces:** el sistema no deberá mostrar indicadores ambientales como si fueran datos disponibles.

---

## CA-12 — Integración ambiental futura

**Dado:** una fuente ambiental validada.  
**Cuando:** se incorpora al sistema.  
**Entonces:** sus datos deberán poder asociarse al territorio y periodo correspondiente antes de utilizarse en análisis.

---

## CA-13 — Alertas

**Dado:** un método de generación de riesgo validado.  
**Cuando:** se cumplen las condiciones definidas por dicho método.  
**Entonces:** el sistema podrá generar una alerta indicando el criterio utilizado.

---

# 10. Casos de uso principales

## CU-01 — Consultar dashboard

**Actor:** Usuario público.

**Flujo principal:**

1. El usuario accede al sistema.
2. El sistema muestra el dashboard.
3. El sistema presenta indicadores generales.
4. El usuario selecciona filtros.
5. El sistema procesa la consulta.
6. El sistema actualiza mapas y gráficas.
7. El usuario analiza los resultados.

---

## CU-02 — Consultar municipio

**Actor:** Usuario público.

**Flujo principal:**

1. El usuario selecciona una entidad.
2. El sistema presenta sus municipios disponibles.
3. El usuario selecciona un municipio.
4. El sistema consulta los registros correspondientes.
5. El sistema muestra indicadores.
6. El sistema muestra evolución temporal.
7. El sistema muestra representación cartográfica.

---

## CU-03 — Comparar territorios

**Actor:** Usuario público.

**Flujo principal:**

1. El usuario selecciona un periodo.
2. Selecciona dos o más territorios.
3. El sistema calcula los indicadores correspondientes.
4. El sistema presenta una comparación.
5. El usuario analiza las diferencias.

---

## CU-04 — Importar datos

**Actor:** Administrador.

**Flujo principal:**

1. El administrador inicia sesión.
2. Accede al módulo de datos.
3. Selecciona un archivo.
4. El sistema valida su estructura.
5. El sistema identifica errores o inconsistencias.
6. El administrador confirma la importación.
7. El sistema procesa los registros.
8. El sistema almacena los datos válidos.
9. El sistema registra la operación.

---

## CU-05 — Incorporar fuente ambiental

**Actor:** Administrador.

**Flujo principal:**

1. El administrador incorpora una fuente ambiental.
2. El sistema valida su estructura.
3. Se identifican variables temporales y territoriales.
4. Se valida la compatibilidad con los datos epidemiológicos.
5. Se realiza la asociación.
6. El sistema registra la fuente.
7. Los datos quedan disponibles para análisis ambiental.

---

## CU-06 — Consultar indicadores de riesgo

**Actor:** Usuario público.

**Precondición:** Existe un modelo o metodología de riesgo validada.

**Flujo principal:**

1. El usuario selecciona territorio y periodo.
2. El sistema procesa las variables requeridas.
3. El sistema calcula el indicador.
4. El sistema presenta el resultado.
5. El sistema muestra la metodología o referencia correspondiente.

---

# 11. Arquitectura funcional propuesta

La ERS no obliga todavía a utilizar una tecnología concreta, pero el sistema deberá separar sus responsabilidades principales.

## 11.1 Capa de presentación

Responsable de:

- dashboard;
- filtros;
- mapas;
- gráficas;
- navegación;
- vistas administrativas.

## 11.2 Capa de aplicación

Responsable de:

- autenticación;
- reglas de negocio;
- consultas;
- cálculo de indicadores;
- procesamiento de solicitudes;
- control de permisos.

## 11.3 Capa de datos

Responsable de:

- almacenamiento epidemiológico;
- almacenamiento territorial;
- fuentes;
- importaciones;
- indicadores calculados;
- registros de procesamiento.

## 11.4 Procesamiento de datos

Se deberá considerar un proceso independiente para:

1. recepción;
2. validación;
3. limpieza;
4. transformación;
5. normalización;
6. almacenamiento;
7. generación de indicadores.

La metodología del proyecto establece precisamente una secuencia de recopilación, limpieza, estructuración, procesamiento, visualización, generación de indicadores y validación.

---

# 12. Modelo conceptual de información

Como base inicial, se proponen las siguientes entidades.

## 12.1 Registro epidemiológico

Representa un registro proveniente de la fuente epidemiológica.

Atributos posibles:

- identificador;
- fecha de actualización;
- fecha de inicio de síntomas;
- sexo;
- edad;
- entidad;
- municipio;
- tipo de paciente;
- resultado;
- estatus;
- defunción;
- demás variables disponibles.

## 12.2 Entidad federativa

Representa una entidad de México.

Atributos:

- identificador;
- nombre;
- código;
- geometría territorial.

## 12.3 Municipio

Representa un municipio.

Atributos:

- identificador;
- nombre;
- entidad;
- código;
- geometría.

## 12.4 Fuente de datos

Representa el origen de un conjunto de datos.

Atributos:

- nombre;
- institución;
- fecha de obtención;
- periodo cubierto;
- descripción;
- versión.

## 12.5 Importación

Representa una operación de incorporación de datos.

Atributos:

- identificador;
- archivo;
- fecha;
- usuario administrador;
- registros recibidos;
- registros aceptados;
- registros rechazados;
- estado.

## 12.6 Variable ambiental

Entidad reservada para la segunda etapa.

Ejemplos:

- temperatura;
- precipitación;
- humedad.

## 12.7 Indicador

Representa un valor calculado por el sistema.

Atributos:

- nombre;
- definición;
- fórmula/metodología;
- periodo;
- territorio;
- valor;
- fuente.

---

# 13. Requisitos de calidad de los datos

La calidad de los datos deberá evaluarse al menos mediante:

| Dimensión | Validación |
|---|---|
| Completitud | Identificación de valores faltantes |
| Validez | Comprobación de formatos y dominios |
| Consistencia | Revisión de relaciones entre campos |
| Unicidad | Identificación de registros duplicados |
| Integridad territorial | Correspondencia entidad-municipio |
| Integridad temporal | Fechas válidas y coherentes |
| Trazabilidad | Identificación de fuente e importación |
| Reproducibilidad | Posibilidad de repetir el procesamiento |

---

# 14. Estrategia de pruebas

El proyecto preliminar contempla cinco grupos de pruebas.

## 14.1 Pruebas de extracción

Verificar que:

- los datos puedan ser obtenidos;
- el archivo sea leído correctamente;
- no se pierdan columnas;
- se detecten cambios en la estructura.

## 14.2 Pruebas de almacenamiento y procesamiento

Verificar:

- inserción;
- actualización;
- duplicados;
- valores faltantes;
- transformación;
- cálculo de indicadores.

## 14.3 Pruebas de visualización

Verificar:

- mapas;
- gráficas;
- filtros;
- indicadores;
- actualización dinámica.

## 14.4 Pruebas de análisis y predicción

Aplicarán cuando se implemente la etapa avanzada.

Deberán verificar:

- metodología;
- reproducibilidad;
- métricas;
- comportamiento ante datos insuficientes;
- interpretación de resultados.

## 14.5 Pruebas de funcionamiento y usabilidad

Deberán verificar:

- navegación;
- comprensión de filtros;
- claridad de resultados;
- compatibilidad con navegadores;
- errores de interfaz;
- experiencia de usuario.

---

# 15. Priorización de requisitos

## Prioridad P1 — Primera versión

La primera versión deberá concentrarse en:

- acceso público;
- autenticación administrativa;
- importación CSV;
- validación;
- almacenamiento histórico;
- filtros temporales;
- filtros territoriales;
- dashboard;
- gráficas;
- mapas;
- indicadores básicos;
- comparación temporal;
- comparación territorial;
- trazabilidad;
- información de fuentes.

Esto mantiene la primera versión alineada con el planteamiento del proyecto, que identifica la integración, comparación y visualización como núcleo inicial.

## Prioridad P2 — Segunda etapa

- integración de temperatura;
- integración de precipitación;
- integración de humedad;
- análisis ambiental;
- indicadores ambientales;
- análisis de correlaciones;
- indicadores de riesgo.

## Prioridad P3 — Etapa avanzada

- modelos predictivos;
- predicción de incrementos;
- alertas avanzadas;
- análisis espacial avanzado;
- nuevas fuentes de información.

---

# 16. Matriz de trazabilidad

La siguiente matriz relaciona los objetivos del proyecto con los requisitos que permiten cumplirlos.

| Objetivo | Requisitos relacionados | Evidencia / validación |
|---|---|---|
| Construir base histórica | RF-03, RF-04, RF-05 | Pruebas de extracción y almacenamiento |
| Integrar información territorial | RF-07, RF-08, RF-11, RF-15 | Pruebas cartográficas y territoriales |
| Crear dashboard | RF-09, RF-10, RF-12 | Pruebas de visualización |
| Consultar información histórica | RF-06, RF-13 | Pruebas de consulta temporal |
| Comparar municipios | RF-14, RF-15 | Pruebas de comparación |
| Identificar tendencias | RF-06, RF-10, RF-13 | Validación de indicadores |
| Incorporar variables ambientales | RF-16, RF-17 | Pruebas de integración |
| Generar indicadores de riesgo | RF-18 | Validación metodológica |
| Generar alertas | RF-19 | Pruebas de análisis |
| Garantizar administración protegida | RF-02, RF-20 | Pruebas de seguridad |
| Mantener trazabilidad | RF-21, RF-22 | Auditoría de importaciones |
| Validar funcionamiento | RF-04 + RNF-01 a RNF-14 | Plan integral de pruebas |

---

# 17. Matriz de requisitos contra fases de desarrollo

| Fase | Requisitos principales |
|---|---|
| Fase 1 — Análisis | Todos los RF y RNF |
| Fase 2 — Datos | RF-03, RF-04, RF-05, RF-20, RF-21 |
| Fase 3 — Arquitectura | RF-01, RF-02, RF-05, RF-06, RF-07 |
| Fase 4 — Interfaz | RF-06, RF-07, RF-08, RF-09, RF-10, RF-11, RF-15 |
| Fase 5 — Desarrollo MVP | RF-01 a RF-15 |
| Fase 6 — Integración ambiental | RF-16, RF-17 |
| Fase 7 — Riesgo y alertas | RF-18, RF-19 |
| Fase 8 — Pruebas | CA-01 a CA-13 |
| Fase 9 — Implementación | RNF-01 a RNF-14 |

---

# 18. Restricciones del proyecto

## RE-01 — Disponibilidad de fuentes

La disponibilidad, estructura y continuidad de las fuentes externas no está bajo control directo del sistema.

## RE-02 — Variables ambientales

La integración de variables ambientales queda fuera del conjunto inicial de datos y deberá desarrollarse posteriormente.

## RE-03 — Validación científica

Los modelos de riesgo y predicción deberán contar con una metodología documentada antes de utilizarse como funcionalidades de alerta.

## RE-04 — Interpretación

El sistema será una herramienta de consulta, visualización y análisis de información epidemiológica. Sus resultados deberán interpretarse dentro de las limitaciones de las fuentes y métodos utilizados.

## RE-05 — Evolución de las fuentes

El sistema deberá poder adaptarse a modificaciones en los formatos de los datos de origen.

---

# 19. Fuera del alcance de la primera versión

La primera versión no deberá considerar como requisitos obligatorios:

- predicción automática de brotes;
- diagnóstico individual de pacientes;
- recomendaciones médicas personalizadas;
- notificaciones médicas individuales;
- integración obligatoria de sensores IoT;
- incorporación obligatoria de todas las variables ambientales;
- modelos de inteligencia artificial;
- automatización de decisiones sanitarias.

Las técnicas de análisis complejas y predictivas se consideran en el documento preliminar como posibilidades para etapas posteriores, mientras que el núcleo inicial se concentra en integración, comparación y visualización.

---

# 20. Criterios generales para considerar terminado el MVP

El MVP podrá considerarse funcionalmente terminado cuando:

1. El usuario pueda acceder sin autenticación.
2. El administrador pueda autenticarse.
3. El administrador pueda importar el conjunto de datos.
4. El sistema pueda validar los datos.
5. Los datos válidos puedan almacenarse.
6. Los datos puedan consultarse por periodo.
7. Los datos puedan consultarse por entidad.
8. Los datos puedan consultarse por municipio.
9. Guerrero pueda analizarse de manera diferenciada.
10. El dashboard presente indicadores coherentes.
11. Existan gráficas temporales.
12. Exista visualización cartográfica.
13. Se puedan realizar comparaciones territoriales.
14. La información de fuente y actualización sea visible.
15. Las operaciones administrativas queden registradas.
16. Se hayan ejecutado las pruebas funcionales definidas.
17. Los resultados de las pruebas sean satisfactorios conforme a los criterios establecidos.

---

# 21. Consideraciones para la siguiente versión de la ERS

Antes de iniciar el diseño físico de la base de datos deberán definirse formalmente los siguientes puntos que todavía no están determinados en el documento preliminar:

1. **Definición exacta de caso:** qué valores del campo de estatus/dictamen serán contabilizados como casos para cada indicador.
2. **Unidad temporal principal:** fecha, mes, semana epidemiológica o combinación.
3. **Definición matemática de cada indicador.**
4. **Fuente de población:** necesaria para calcular incidencia.
5. **Fuente y geometría oficial de municipios y entidades.**
6. **Reglas exactas de deduplicación.**
7. **Tratamiento de registros con información territorial incompleta.**
8. **Fuente ambiental para temperatura, precipitación y humedad.**
9. **Periodicidad de actualización.**
10. **Metodología de generación de riesgo.**
11. **Método de validación de las alertas.**
12. **Tecnologías definitivas del frontend, backend, base de datos y cartografía.**

Estos puntos deberán resolverse antes de convertir los requisitos analíticos en especificaciones técnicas definitivas.

---

# 22. Conclusión

La presente ERS establece como núcleo del sistema una plataforma web pública orientada a la consulta, integración, procesamiento y visualización de información histórica del dengue para todo México, manteniendo a Guerrero como territorio de especial interés.

La primera versión deberá priorizar la confiabilidad de los datos, su trazabilidad, la consulta histórica, el análisis territorial y temporal y la representación mediante dashboards, gráficas y mapas.

La incorporación de variables ambientales, indicadores de riesgo y mecanismos de alerta se plantea como una evolución posterior. Esta separación permite que el sistema pueda comenzar utilizando el conjunto epidemiológico disponible y, posteriormente, incorporar nuevas fuentes sin modificar el propósito fundamental de la plataforma.

El enfoque resulta consistente con la metodología del proyecto, que contempla la recopilación y estructuración de datos, su procesamiento, la construcción de un tablero interactivo, la generación de indicadores y alertas y finalmente la validación mediante pruebas.