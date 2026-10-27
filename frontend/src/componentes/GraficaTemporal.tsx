import { useMemo, useState } from "react";
import { useAncho } from "../hooks/useAncho";
import type { Serie } from "../tipos";
import { agruparMeses, MESES, MESES_LARGOS, numero, pasoBonito } from "../utilidades/formato";

export function GraficaTemporal({ datos, cobertura, anio }: { datos: Serie[]; cobertura: string; anio: string }) {
  const [ref, ancho] = useAncho<HTMLDivElement>();
  const [activo, setActivo] = useState<number | null>(null);
  const meses = useMemo(() => agruparMeses(datos), [datos]);
  const compacto = ancho < 520;
  const alto = compacto ? 240 : 300;
  const margen = { i: compacto ? 42 : 56, d: 16, s: 28, b: 30 };
  const valores = meses.filter((valor): valor is number => valor !== null);
  const maximo = Math.max(1, ...valores);
  const paso = pasoBonito(maximo / 4);
  const limite = Math.ceil(maximo / paso) * paso;
  const marcas = Array.from({ length: Math.round(limite / paso) + 1 }, (_, indice) => indice * paso);
  const x = (indice: number) => margen.i + (indice / 11) * (ancho - margen.i - margen.d);
  const y = (valor: number) => alto - margen.b - (valor / limite) * (alto - margen.b - margen.s);
  const pico = valores.length && Math.max(...valores) > 0 ? meses.indexOf(Math.max(...valores)) : -1;
  const hayHuecos = meses.some((valor) => valor === null);
  const mostrarMes = (indice: number) => ancho >= 420 || indice % 3 === 0 || indice === 11;
  const tramos: number[][] = [];
  meses.forEach((valor, indice) => {
    if (valor === null) return;
    const ultimo = tramos[tramos.length - 1];
    if (ultimo && ultimo[ultimo.length - 1] === indice - 1) ultimo.push(indice);
    else tramos.push([indice]);
  });
  const tramosLinea = tramos.filter((tramo) => tramo.length > 1);
  const puntos = (tramo: number[]) => tramo.map((indice) => `${x(indice)},${y(meses[indice] as number)}`).join(" ");
  const rotulados = Array.from(new Set([pico, activo].filter((indice): indice is number => indice !== null && indice >= 0)));
  const rotulo = (indice: number) => {
    const valor = meses[indice];
    if (valor === null) return null;
    const texto = numero(valor); const anchoRotulo = texto.length * 7.2 + 12;
    const cx = Math.min(Math.max(x(indice), anchoRotulo / 2 + 2), ancho - anchoRotulo / 2 - 2);
    const cy = y(valor) < 40 ? y(valor) + 24 : y(valor) - 18;
    return <g key={`rotulo-${indice}`} className="rotulo" pointerEvents="none"><rect x={cx - anchoRotulo / 2} y={cy - 11} width={anchoRotulo} height={22} /><text x={cx} y={cy + 4} textAnchor="middle">{texto}</text></g>;
  };
  return <figure className="figura-grafica"><h2>Casos confirmados por mes</h2><figcaption>{cobertura} · {anio} · unidad: casos confirmados</figcaption><div ref={ref} className="contenedor-grafica"><svg className="grafica" width={ancho} height={alto} viewBox={`0 0 ${ancho} ${alto}`} role="group" aria-label={`Evolución mensual de casos confirmados en ${cobertura}, ${anio}. Cada mes con dato es un punto enfocable; los valores también están en la tabla inferior.`}><text x="2" y="12">CASOS</text>{marcas.map((marca) => <g key={marca}><line x1={margen.i} x2={ancho - margen.d} y1={y(marca)} y2={y(marca)} /><text x={margen.i - 8} y={y(marca) + 4} textAnchor="end">{numero(marca)}</text></g>)}{meses.map((valor, indice) => <g key={MESES[indice]}>{mostrarMes(indice) && <text x={x(indice)} y={alto - 10} textAnchor="middle" className={valor === null ? "sin-dato" : undefined}>{MESES[indice]}</text>}{valor === null && <text x={x(indice)} y={alto - margen.b - 8} textAnchor="middle" className="sin-dato"><title>{`${MESES_LARGOS[indice]}: sin dato`}</title>s/d</text>}</g>)}{tramosLinea.map((tramo) => <polygon key={`area-${tramo[0]}`} className="grafica-area" points={`${x(tramo[0])},${y(0)} ${puntos(tramo)} ${x(tramo[tramo.length - 1])},${y(0)}`} />)}{tramosLinea.map((tramo) => <polyline key={`tramo-${tramo[0]}`} className="linea-datos" points={puntos(tramo)} />)}{meses.map((valor, indice) => valor === null ? null : <g key={`punto-${indice}`} className="punto" tabIndex={0} role="img" aria-label={`${MESES_LARGOS[indice]}: ${numero(valor)} casos confirmados`} onMouseEnter={() => setActivo(indice)} onMouseLeave={() => setActivo(null)} onFocus={() => setActivo(indice)} onBlur={() => setActivo(null)}><circle className="zona-toque" cx={x(indice)} cy={y(valor)} r={14} /><circle className="marcador" cx={x(indice)} cy={y(valor)} r={activo === indice ? 6 : 4} /></g>)}{rotulados.map(rotulo)}</svg></div>{hayHuecos && <p className="nota">Los meses marcados «s/d» no tienen dato en la API y no se grafican como cero.</p>}<details className="datos-grafica"><summary>Ver datos mensuales en tabla</summary><table><caption className="sr-only">Serie mensual de casos confirmados en {cobertura}, {anio}</caption><thead><tr><th scope="col">Mes</th><th scope="col" className="num">Casos</th></tr></thead><tbody>{meses.map((valor, indice) => <tr key={MESES[indice]}><th scope="row">{MESES_LARGOS[indice]}</th><td className="num">{valor === null ? "sin dato" : numero(valor)}</td></tr>)}</tbody></table></details></figure>;
}
