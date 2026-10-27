import type { Resumen, Serie } from "../tipos";

export const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
export const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const numero = (valor: number) => new Intl.NumberFormat("es-MX").format(valor);
export const porcentaje = (valor: number) => new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 }).format(valor);
export const limitar = (valor: number, minimo: number, maximo: number) => Math.min(maximo, Math.max(minimo, valor));
export const normalizar = (texto: string) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("es-MX").trim();
export const totalEstatus = (resumen: Resumen, estatus: number) => resumen.por_estatus?.find((item) => item.estatus_caso === estatus)?.total ?? 0;

/** Doce posiciones (ene–dic); null significa que la API no devolvió ese mes. */
export const agruparMeses = (datos: Serie[]): (number | null)[] => {
  const meses = Array.from({ length: 12 }, () => null as number | null);
  datos.forEach((punto) => {
    const mes = new Date(punto.periodo).getUTCMonth();
    if (mes >= 0 && mes < 12) meses[mes] = (meses[mes] ?? 0) + punto.total_casos;
  });
  return meses;
};

export const pasoBonito = (valor: number) => {
  const exponente = 10 ** Math.floor(Math.log10(valor));
  const fraccion = valor / exponente;
  const factor = fraccion <= 1 ? 1 : fraccion <= 2 ? 2 : fraccion <= 5 ? 5 : 10;
  return Math.max(1, factor * exponente);
};

export const leerPreferencia = (clave: string) => {
  try { return localStorage.getItem(clave); } catch { return null; }
};
export const guardarPreferencia = (clave: string, valor: string) => {
  try { localStorage.setItem(clave, valor); } catch { /* La interfaz funciona sin persistencia. */ }
};
