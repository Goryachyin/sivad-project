# Importación de datos de dengue

1. Ejecutar las migraciones.
2. Crear un usuario administrador.
3. Cargar catálogos territoriales:

   `python manage.py cargar_catalogos data/diccionario_datos_dengue/catalogos_dengue.xlsx`

4. Importar el corte más reciente:

   `python manage.py importar_dengue data/2020/datos_abiertos_dengue_311220/Datos abiertos dengue_311220.csv --usuario NOMBRE_USUARIO`

El importador valida columnas obligatorias, fechas, estatus y correspondencia entidad-municipio. Actualiza registros por `ID_REGISTRO`, conserva la bitácora de la importación y no vuelve a incorporar archivos con el mismo hash SHA-256.
