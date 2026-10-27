import type { ColeccionMapa, Entidad, Resumen, Serie, Territorio } from "../tipos";

export type Periodo = { inicio: string; fin: string; etiqueta: string };

const base = "/api/publica";
const obtener = async <T>(ruta: string, signal?: AbortSignal): Promise<T> => {
  const respuesta = await fetch(`${base}${ruta}`, { signal });
  if (!respuesta.ok) throw new Error(`La API respondió ${respuesta.status}`);
  return respuesta.json() as Promise<T>;
};
const consulta = (periodo: Periodo, entidad: string, municipio?: string) => {
  const parametros = new URLSearchParams({ fecha_inicial: periodo.inicio, fecha_final: periodo.fin, entidad });
  if (municipio) parametros.set("municipio", municipio);
  return parametros.toString();
};

export const obtenerCatalogos = async (signal?: AbortSignal) => {
  const [anios, entidades] = await Promise.all([
    obtener<{ anios: number[] }>("/anios-disponibles/", signal),
    obtener<{ entidades: Entidad[] }>("/entidades-disponibles/", signal),
  ]);
  return { anios: anios.anios, entidades: entidades.entidades };
};

export const obtenerPanel = async (periodo: Periodo, entidad: string, signal?: AbortSignal) => {
  const filtros = consulta(periodo, entidad);
  const [resumen, serie, distribucion, mapa] = await Promise.all([
    obtener<Resumen>(`/resumen/?${filtros}`, signal),
    obtener<{ serie_mensual: { periodo: string; total: number }[] }>(`/serie-temporal/?${filtros}`, signal),
    obtener<{ resultados: Record<string, unknown>[] }>(`/distribucion-territorial/?${filtros}&nivel=municipio`, signal),
    obtener<ColeccionMapa>(`/mapa-municipios/?${filtros}`, signal),
  ]);
  const territorios: Territorio[] = (distribucion.resultados ?? [])
    .filter((dato) => dato.municipio_asignado__nombre)
    .slice(0, 8)
    .map((dato) => ({ nombre: String(dato.municipio_asignado__nombre), total_casos: Number(dato.total) }));
  const serieNormalizada: Serie[] = (serie.serie_mensual ?? []).map((dato) => ({ periodo: dato.periodo, total_casos: dato.total }));
  return { resumen, serie: serieNormalizada, territorios, mapa };
};

export const obtenerComparativa = (actual: Periodo, referencia: Periodo, entidad: string, signal?: AbortSignal) => Promise.all([
  obtenerPanel(actual, entidad, signal),
  obtenerPanel(referencia, entidad, signal),
]);

export const obtenerDesgloseMunicipal = (periodo: Periodo, entidad: string, municipio: string, signal?: AbortSignal) => obtener<Resumen>(`/resumen/?${consulta(periodo, entidad, municipio)}&estatus=1,2,3`, signal);
