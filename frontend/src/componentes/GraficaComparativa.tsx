import { useMemo, useState } from "react";
import { useAncho } from "../hooks/useAncho";
import type { Serie } from "../tipos";
import {
  agruparMeses,
  MESES,
  MESES_LARGOS,
  numero,
  pasoBonito,
} from "../utilidades/formato";

type SerieComparada = { datos: Serie[]; etiqueta: string };

export function GraficaComparativa({
  actual,
  referencia,
}: {
  actual: SerieComparada;
  referencia: SerieComparada;
}) {
  const [ref, ancho] = useAncho<HTMLDivElement>();
  const [mesActivo, setMesActivo] = useState<number | null>(null);
  const datosActuales = useMemo(
    () => agruparMeses(actual.datos),
    [actual.datos],
  );
  const datosReferencia = useMemo(
    () => agruparMeses(referencia.datos),
    [referencia.datos],
  );

  const compacto = ancho < 520;
  const alto = compacto ? 240 : 300;
  const margen = { i: compacto ? 44 : 56, d: 16, s: 28, b: 30 };
  const valores = [...datosActuales, ...datosReferencia].filter(
    (valor): valor is number => valor !== null,
  );
  const maxValor = Math.max(1, ...valores);
  const paso = pasoBonito(maxValor / 4);
  const limite = Math.ceil(maxValor / paso) * paso;
  const marcas = Array.from(
    { length: Math.round(limite / paso) + 1 },
    (_, indice) => indice * paso,
  );

  const x = (indice: number) =>
    margen.i + (indice / 11) * (ancho - margen.i - margen.d);
  const y = (valor: number) =>
    alto - margen.b - (valor / limite) * (alto - margen.b - margen.s);
  const anchoBanda = (ancho - margen.i - margen.d) / 11;

  const tramos = (datos: (number | null)[]) => {
    const resultado: number[][] = [];
    datos.forEach((valor, indice) => {
      if (valor === null) return;
      const ultimo = resultado[resultado.length - 1];
      if (ultimo && ultimo[ultimo.length - 1] === indice - 1) ultimo.push(indice);
      else resultado.push([indice]);
    });
    return resultado.filter((tramo) => tramo.length > 1);
  };
  const puntos = (datos: (number | null)[], tramo: number[]) =>
    tramo
      .map((indice) => `${x(indice)},${y(datos[indice] as number)}`)
      .join(" ");

  const valorTexto = (v: number | null) => (v === null ? "sin dato" : numero(v));
  const xActivo = mesActivo !== null ? x(mesActivo) : 0;

  return (
    <figure className="figura-grafica">
      <h2>Casos confirmados por mes</h2>
      <figcaption>
        <span className="leyenda-serie actual" />
        {actual.etiqueta}
        <span className="leyenda-serie referencia" />
        {referencia.etiqueta}
      </figcaption>
      <div
        ref={ref}
        className="contenedor-grafica"
        onMouseLeave={() => setMesActivo(null)}
      >
        <svg
          className="grafica"
          width={ancho}
          height={alto}
          viewBox={`0 0 ${ancho} ${alto}`}
          role="group"
          aria-label={`Comparación mensual de casos confirmados: ${actual.etiqueta} frente a ${referencia.etiqueta}`}
        >
          <text x="2" y="12">
            CASOS
          </text>
          {marcas.map((marca) => (
            <g key={marca}>
              <line
                x1={margen.i}
                x2={ancho - margen.d}
                y1={y(marca)}
                y2={y(marca)}
              />
              <text x={margen.i - 8} y={y(marca) + 4} textAnchor="end">
                {numero(marca)}
              </text>
            </g>
          ))}
          {MESES.map((mes, indice) => (
            <text
              key={mes}
              x={x(indice)}
              y={alto - 10}
              textAnchor="middle"
              className={mesActivo === indice ? "mes-eje-activo" : undefined}
            >
              {compacto && indice % 3 !== 0 && indice !== 11 ? "" : mes}
            </text>
          ))}
          {tramos(datosActuales).map((tramo) => (
            <polygon
              key={`area-${tramo[0]}`}
              className="grafica-area"
              points={`${x(tramo[0])},${y(0)} ${puntos(datosActuales, tramo)} ${x(tramo[tramo.length - 1])},${y(0)}`}
            />
          ))}
          {tramos(datosReferencia).map((tramo) => (
            <polyline
              key={`referencia-${tramo[0]}`}
              className="linea-referencia"
              points={puntos(datosReferencia, tramo)}
            />
          ))}
          {tramos(datosActuales).map((tramo) => (
            <polyline
              key={`actual-${tramo[0]}`}
              className="linea-datos"
              points={puntos(datosActuales, tramo)}
            />
          ))}
          {mesActivo !== null && (
            <line
              className="guia-mes"
              x1={xActivo}
              x2={xActivo}
              y1={margen.s}
              y2={alto - margen.b}
            />
          )}
          {datosReferencia.map((valor, indice) =>
            valor === null ? null : (
              <circle
                key={`referencia-${indice}`}
                className="marcador-referencia"
                cx={x(indice)}
                cy={y(valor)}
                r={mesActivo === indice ? 5 : 3}
              />
            ),
          )}
          {datosActuales.map((valor, indice) =>
            valor === null ? null : (
              <circle
                key={`actual-${indice}`}
                className="marcador"
                cx={x(indice)}
                cy={y(valor)}
                r={mesActivo === indice ? 5.5 : 3.5}
              />
            ),
          )}
          {MESES.map((mes, indice) => {
            const valAct = datosActuales[indice];
            const valRef = datosReferencia[indice];
            const bx = Math.max(margen.i - 8, x(indice) - anchoBanda / 2);
            const bw = Math.min(
              ancho - margen.d + 8 - bx,
              anchoBanda,
            );
            return (
              <g
                key={`inter-${mes}`}
                className="punto"
                tabIndex={0}
                role="button"
                aria-label={`${MESES_LARGOS[indice]}: ${actual.etiqueta} ${valorTexto(valAct)} casos, ${referencia.etiqueta} ${valorTexto(valRef)} casos`}
                onMouseEnter={() => setMesActivo(indice)}
                onFocus={() => setMesActivo(indice)}
                onBlur={() => setMesActivo(null)}
                onClick={() => setMesActivo(indice)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setMesActivo((prev) => (prev === indice ? null : indice));
                  }
                }}
              >
                <rect
                  className="zona-toque"
                  x={bx}
                  y={margen.s}
                  width={Math.max(18, bw)}
                  height={alto - margen.s - margen.b}
                />
              </g>
            );
          })}
        </svg>
        {mesActivo !== null && (
          <div
            className={`tooltip-grafica${mesActivo >= 7 ? " izq" : ""}`}
            style={{ left: xActivo, top: margen.s }}
            role="status"
          >
            <strong>{MESES_LARGOS[mesActivo]}</strong>
            <span>
              <i className="punto-leyenda actual" />
              {actual.etiqueta}: <b>{valorTexto(datosActuales[mesActivo])}</b>
            </span>
            <span>
              <i className="punto-leyenda referencia" />
              {referencia.etiqueta}:{" "}
              <b>{valorTexto(datosReferencia[mesActivo])}</b>
            </span>
          </div>
        )}
      </div>
      <details className="datos-grafica">
        <summary>Ver datos mensuales en tabla</summary>
        <table>
          <caption className="sr-only">
            Comparación mensual de casos confirmados
          </caption>
          <thead>
            <tr>
              <th scope="col">Mes</th>
              <th scope="col" className="num">
                {actual.etiqueta}
              </th>
              <th scope="col" className="num">
                {referencia.etiqueta}
              </th>
            </tr>
          </thead>
          <tbody>
            {MESES.map((mes, indice) => (
              <tr key={mes}>
                <th scope="row">{MESES_LARGOS[indice]}</th>
                <td className="num">{valorTexto(datosActuales[indice])}</td>
                <td className="num">{valorTexto(datosReferencia[indice])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
