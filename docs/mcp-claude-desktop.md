# MCP local de SIVAD para Claude Desktop

El servidor MCP permite que Claude consulte la API pública de SIVAD. No accede
directamente a PostgreSQL y no incluye herramientas para modificar datos.

## Requisitos

- Python 3.12 o superior.
- Docker Desktop y Docker Compose.
- Claude Desktop instalado en esta computadora.

## Preparar el proyecto

Desde PowerShell, en la carpeta raíz del proyecto:

```powershell
docker compose up --build -d
py -3.12 -m venv mcp_server\.venv
mcp_server\.venv\Scripts\python.exe -m pip install -r mcp_server\requirements.txt
```

Confirma que el backend responda antes de conectar Claude:

```powershell
Invoke-RestMethod http://localhost:8000/api/publica/anios-disponibles/
```

Si no hay datos cargados, inicia Claude igualmente, pero las consultas devolverán
resultados vacíos hasta que se importen los catálogos y registros indicados en
[importacion-dengue.md](importacion-dengue.md).

## Conectar con Claude Desktop

Abre el archivo de configuración de Claude Desktop:

```powershell
notepad $env:APPDATA\Claude\claude_desktop_config.json
```

Agrega esta entrada dentro de `mcpServers`. Sustituye `TU_USUARIO` por el
directorio real de Windows. Si ya existe el archivo o la propiedad `mcpServers`,
integra la entrada sin borrar las demás configuraciones:

```json
{
  "mcpServers": {
    "sivad": {
      "command": "C:\\Users\\TU_USUARIO\\OneDrive\\Escritorio\\Sistema web dengue\\mcp_server\\.venv\\Scripts\\python.exe",
      "args": [
        "C:\\Users\\TU_USUARIO\\OneDrive\\Escritorio\\Sistema web dengue\\mcp_server\\server.py"
      ],
      "env": {
        "SIVAD_API_URL": "http://localhost:8000/api/publica"
      }
    }
  }
}
```

Guarda el archivo y reinicia Claude Desktop. En una conversación nueva, revisa
que el servidor `sivad` aparezca entre las conexiones MCP disponibles. Puedes
pedir, por ejemplo: “Consulta los años disponibles en SIVAD” o “Dame el resumen
de casos confirmados en Guerrero durante 2020”.

El MCP ofrece herramientas para consultar años y entidades disponibles, resumen
epidemiológico, serie mensual y distribución territorial. Los filtros aceptan
año inicial/final, código de entidad, código de municipio y estatus. El estatus
predeterminado es `2` (confirmado); los valores permitidos son `1` (probable),
`2` (confirmado) y `3` (descartado). Para consultar por municipio también se
requiere el código de entidad.

## Solución de problemas

- Si Claude indica que el proceso MCP no inicia, comprueba que las rutas de
  `command` y `args` existan y que la dependencia se haya instalado.
- Si las herramientas MCP aparecen pero fallan al consultar, comprueba que
  `docker compose ps` muestre el backend activo y que la URL de la API responda.
- El servidor MCP se ejecuta en esta computadora y requiere que Claude Desktop
  pueda iniciar procesos locales. Para usarlo desde Claude web o un equipo
  distinto, habría que desplegar un servidor MCP remoto con HTTPS; esta
  configuración local no lo expone a Internet.
