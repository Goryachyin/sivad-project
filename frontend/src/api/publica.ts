import type { ColeccionMapa, Entidad, Resumen, Serie, Territorio } from "../tipos";

export type Periodo = { inicio: string; fin: string; etiqueta: string };
export type EstatusCaso = 1 | 2 | 3;
export type NivelTerritorial = "entidad" | "municipio";

type Filtros = {
  p_fecha_inicial: string;
  p_fecha_final: string;
  p_entidad: string | null;
  p_municipio: string | null;
  p_estatus: EstatusCaso[];
};

type RespuestaSerie = { serie_mensual: { periodo: string; total: number }[] };
type RespuestaDistribucion = { resultados: Record<string, unknown>[] };

const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === "object" && valor !== null;

const configuracionSupabase = () => {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error("Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para consultar Supabase.");
  }

  let base: URL;
  try {
    base = new URL(url);
  } catch {
    throw new Error("VITE_SUPABASE_URL debe ser una URL válida.");
  }
  if (base.protocol !== "https:" && base.hostname !== "localhost") {
    throw new Error("VITE_SUPABASE_URL debe usar HTTPS fuera de localhost.");
  }

  return { url: base.origin, anonKey };
};

const rpc = async <T>(
  funcion: string,
  parametros: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<T> => {
  const { url, anonKey } = configuracionSupabase();
  const respuesta = await fetch(`${url}/rest/v1/rpc/${funcion}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
    signal,
  });
  const cuerpo: unknown = await respuesta.json();

  if (!respuesta.ok) {
    const detalle = esObjeto(cuerpo) && typeof cuerpo.message === "string"
      ? cuerpo.message
      : JSON.stringify(cuerpo);
    throw new Error(`Supabase RPC ${funcion} respondió ${respuesta.status}: ${detalle}`);
  }

  return cuerpo as T;
};

const validarFiltros = (
  periodo: Periodo,
  entidad?: string,
  municipio?: string,
  estatus: EstatusCaso[] = [2],
): Filtros => {
  if (periodo.inicio > periodo.fin) {
    throw new Error("La fecha inicial no puede ser posterior a la fecha final.");
  }
  if (municipio && !entidad) {
    throw new Error("El filtro municipio requiere entidad.");
  }
  if (!estatus.every((valor) => [1, 2, 3].includes(valor))) {
    throw new Error("Estatus permitido: 1, 2 o 3.");
  }

  return {
    p_fecha_inicial: periodo.inicio,
    p_fecha_final: periodo.fin,
    p_entidad: entidad ? entidad.padStart(2, "0") : null,
    p_municipio: municipio ? municipio.padStart(3, "0") : null,
    p_estatus: estatus,
  };
};

export const obtenerCatalogos = async (signal?: AbortSignal) =>
  rpc<{ anios: number[]; entidades: Entidad[] }>("api_publica_catalogos", {}, signal);

export const obtenerResumen = (
  periodo: Periodo,
  entidad: string,
  municipio?: string,
  estatus: EstatusCaso[] = [2],
  signal?: AbortSignal,
) => rpc<Resumen>("api_publica_resumen", validarFiltros(periodo, entidad, municipio, estatus), signal);

export const obtenerSerieTemporal = (
  periodo: Periodo,
  entidad: string,
  municipio?: string,
  estatus: EstatusCaso[] = [2],
  signal?: AbortSignal,
) =>
  rpc<RespuestaSerie>("api_publica_serie_temporal", validarFiltros(periodo, entidad, municipio, estatus), signal);

export const obtenerDistribucionTerritorial = (
  periodo: Periodo,
  nivel: NivelTerritorial,
  entidad?: string,
  municipio?: string,
  estatus: EstatusCaso[] = [2],
  signal?: AbortSignal,
) => rpc<RespuestaDistribucion>(
  "api_publica_distribucion_territorial",
  { ...validarFiltros(periodo, entidad, municipio, estatus), p_nivel: nivel },
  signal,
);

export const obtenerMapaEntidades = (periodo: Periodo, estatus: EstatusCaso[] = [2], signal?: AbortSignal) =>
  rpc<ColeccionMapa>(
    "api_publica_mapa_entidades",
    validarFiltros(periodo, undefined, undefined, estatus),
    signal,
  );

export const obtenerMapaMunicipios = (
  periodo: Periodo,
  entidad: string,
  estatus: EstatusCaso[] = [2],
  signal?: AbortSignal,
) => rpc<ColeccionMapa>(
  "api_publica_mapa_municipios",
  validarFiltros(periodo, entidad, undefined, estatus),
  signal,
);

export const obtenerPanel = async (periodo: Periodo, entidad: string, signal?: AbortSignal) => {
  const filtros = validarFiltros(periodo, entidad);
  const [resumen, serie, distribucion, mapa] = await Promise.all([
    rpc<Resumen>("api_publica_resumen", filtros, signal),
    rpc<RespuestaSerie>("api_publica_serie_temporal", filtros, signal),
    rpc<RespuestaDistribucion>(
      "api_publica_distribucion_territorial",
      { ...filtros, p_nivel: "municipio" },
      signal,
    ),
    rpc<ColeccionMapa>("api_publica_mapa_municipios", filtros, signal),
  ]);

  const territorios: Territorio[] = (distribucion.resultados ?? [])
    .filter((dato) => dato.municipio_asignado__nombre)
    .slice(0, 8)
    .map((dato) => ({
      nombre: String(dato.municipio_asignado__nombre),
      total_casos: Number(dato.total),
    }));
  const serieNormalizada: Serie[] = (serie.serie_mensual ?? []).map((dato) => ({
    periodo: dato.periodo,
    total_casos: dato.total,
  }));

  return { resumen, serie: serieNormalizada, territorios, mapa };
};

export const obtenerComparativa = (
  actual: Periodo,
  referencia: Periodo,
  entidad: string,
  signal?: AbortSignal,
) => Promise.all([
  obtenerPanel(actual, entidad, signal),
  obtenerPanel(referencia, entidad, signal),
]);

export const obtenerDesgloseMunicipal = (
  periodo: Periodo,
  entidad: string,
  municipio: string,
  signal?: AbortSignal,
) => obtenerResumen(periodo, entidad, municipio, [1, 2, 3], signal);
