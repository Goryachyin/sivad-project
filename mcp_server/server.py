import json
import os
from typing import Literal
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from mcp.server.fastmcp import FastMCP


API_URL = os.environ.get(
    "SIVAD_API_URL",
    "http://localhost:8000/api/publica",
).rstrip("/")
TIMEOUT_SECONDS = 20

mcp = FastMCP("SIVAD Dengue")


def consultar_api(
    endpoint: str,
    parametros: dict[str, str | int | None] | None = None,
) -> dict[str, object]:
    query = urlencode({
        key: value
        for key, value in (parametros or {}).items()
        if value is not None
    })
    url = f"{API_URL}/{endpoint}/"
    if query:
        url = f"{url}?{query}"

    request = Request(url, headers={"Accept": "application/json"})
    try:
        with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            resultado = json.loads(response.read())
    except HTTPError as error:
        detalle = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"La API de SIVAD respondió HTTP {error.code}: {detalle}"
        ) from error
    except URLError as error:
        raise RuntimeError(
            f"No se pudo conectar con la API de SIVAD en {API_URL}: {error.reason}"
        ) from error

    if not isinstance(resultado, dict):
        raise RuntimeError(f"La API de SIVAD devolvió una respuesta inesperada en {url}.")
    return resultado


@mcp.tool()
def consultar_anios_disponibles() -> dict[str, object]:
    """Lista los años epidemiológicos con registros cargados en SIVAD."""
    return consultar_api("anios-disponibles")


@mcp.tool()
def consultar_entidades_disponibles() -> dict[str, object]:
    """Lista las entidades federativas disponibles, con sus códigos y nombres."""
    return consultar_api("entidades-disponibles")


@mcp.tool()
def consultar_resumen(
    anio_inicial: int | None = None,
    anio_final: int | None = None,
    entidad: str | None = None,
    municipio: str | None = None,
    estatus: str = "2",
) -> dict[str, object]:
    """Consulta total de registros y conteos por estatus.

    Estatus: 1 probable, 2 confirmado (predeterminado), 3 descartado.
    Para varios estatus, sepáralos con comas, por ejemplo "1,2".
    municipio requiere entidad. Los códigos de entidad y municipio se envían
    como texto para conservar ceros iniciales.
    """
    return consultar_api(
        "resumen",
        {
            "anio_inicial": anio_inicial,
            "anio_final": anio_final,
            "entidad": entidad,
            "municipio": municipio,
            "estatus": estatus,
        },
    )


@mcp.tool()
def consultar_serie_mensual(
    anio_inicial: int | None = None,
    anio_final: int | None = None,
    entidad: str | None = None,
    municipio: str | None = None,
    estatus: str = "2",
) -> dict[str, object]:
    """Consulta conteos mensuales de dengue con filtros epidemiológicos opcionales.

    Estatus: 1 probable, 2 confirmado (predeterminado), 3 descartado.
    Para varios estatus, sepáralos con comas, por ejemplo "1,2".
    municipio requiere entidad. Los códigos de entidad y municipio se envían
    como texto para conservar ceros iniciales.
    """
    return consultar_api(
        "serie-temporal",
        {
            "anio_inicial": anio_inicial,
            "anio_final": anio_final,
            "entidad": entidad,
            "municipio": municipio,
            "estatus": estatus,
        },
    )


@mcp.tool()
def consultar_distribucion_territorial(
    nivel: Literal["entidad", "municipio"] = "entidad",
    anio_inicial: int | None = None,
    anio_final: int | None = None,
    entidad: str | None = None,
    municipio: str | None = None,
    estatus: str = "2",
) -> dict[str, object]:
    """Consulta conteos de casos por entidad o municipio.

    Para nivel "municipio", indica también el código de entidad.
    Estatus: 1 probable, 2 confirmado (predeterminado), 3 descartado.
    Para varios estatus, sepáralos con comas, por ejemplo "1,2".
    Los códigos de entidad y municipio se envían como texto para conservar
    ceros iniciales.
    """
    return consultar_api(
        "distribucion-territorial",
        {
            "nivel": nivel,
            "anio_inicial": anio_inicial,
            "anio_final": anio_final,
            "entidad": entidad,
            "municipio": municipio,
            "estatus": estatus,
        },
    )


if __name__ == "__main__":
    mcp.run(transport="stdio")
