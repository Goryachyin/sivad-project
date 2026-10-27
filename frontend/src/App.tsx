import { useEffect, useMemo, useState, type ReactNode } from "react";
import { obtenerCatalogos, obtenerComparativa, obtenerDesgloseMunicipal, type Periodo } from "./api/publica";
import { GraficaComparativa } from "./componentes/GraficaComparativa";
import { Icono as IconoModular } from "./componentes/Icono";
import { LineaTiempo as LineaTiempoModular, type ModoTemporal } from "./componentes/LineaTiempo";
import { MapaMunicipal } from "./componentes/MapaMunicipal";
import type { Caracteristica, ColeccionMapa, Desglose, Entidad, EstadoConsulta, Resumen, Serie, Territorio } from "./tipos";
import { agruparMeses, guardarPreferencia, leerPreferencia, MESES_LARGOS, normalizar, numero, porcentaje, totalEstatus } from "./utilidades/formato";

const ENTIDAD_INICIAL = "12";
const NOMBRE_INICIAL = "Guerrero";
const periodoAnual = (anio: string): Periodo => ({ inicio: `${anio}-01-01`, fin: `${anio}-12-31`, etiqueta: anio });
const ultimoDia = (mes: string) => { const [anio, numeroMes] = mes.split("-").map(Number); return `${mes}-${String(new Date(anio, numeroMes, 0).getDate()).padStart(2, "0")}`; };
const periodoPersonalizado = (desde: string, hasta: string): Periodo => ({ inicio: `${desde}-01`, fin: ultimoDia(hasta), etiqueta: `${desde} — ${hasta}` });
const mismoRangoAnioAnterior = (periodo: Periodo): Periodo => ({ inicio: `${Number(periodo.inicio.slice(0, 4)) - 1}${periodo.inicio.slice(4)}`, fin: `${Number(periodo.fin.slice(0, 4)) - 1}${periodo.fin.slice(4)}`, etiqueta: `${Number(periodo.inicio.slice(0, 4)) - 1}${periodo.inicio.slice(4, 7)} — ${Number(periodo.fin.slice(0, 4)) - 1}${periodo.fin.slice(4, 7)}` });
const NAV = [
  { destino: "mapa", texto: "Mapa municipal", icono: "mapa" },
  { destino: "panorama", texto: "Indicadores clave", icono: "panorama" },
  { destino: "territorio", texto: "Distribución territorial", icono: "tabla" },
  { destino: "comparativa", texto: "Comparativa temporal", icono: "tiempo" },
  { destino: "tendencia", texto: "Tendencia de casos", icono: "grafica" },
];

export default function App() {
  const [tema, setTema] = useState<"light" | "dark">(() => {
    const guardado = leerPreferencia("sivad-tema");
    if (guardado === "light" || guardado === "dark") return guardado;
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });
  const [sidebarContraido, setSidebarContraido] = useState(
    () => leerPreferencia("sivad-sidebar") !== "expandido",
  );
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("mapa");

  const [entidad, setEntidad] = useState(ENTIDAD_INICIAL);
  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [anios, setAnios] = useState<number[]>([]);
  const [modoTemporal, setModoTemporal] = useState<ModoTemporal>("anual");
  const [anioActual, setAnioActual] = useState("");
  const [anioReferencia, setAnioReferencia] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [periodoActual, setPeriodoActual] = useState<Periodo | null>(null);
  const [periodoReferencia, setPeriodoReferencia] = useState<Periodo | null>(null);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [resumenReferencia, setResumenReferencia] = useState<Resumen | null>(null);
  const [serie, setSerie] = useState<Serie[]>([]);
  const [serieReferencia, setSerieReferencia] = useState<Serie[]>([]);
  const [territorios, setTerritorios] = useState<Territorio[]>([]);
  const [mapa, setMapa] = useState<ColeccionMapa | null>(null);
  const [estado, setEstado] = useState<EstadoConsulta>("cargando");
  const [seleccionId, setSeleccionId] = useState<string | null>(null);
  const [desglose, setDesglose] = useState<Desglose | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    guardarPreferencia("sivad-tema", tema);
  }, [tema]);
  useEffect(() => {
    guardarPreferencia("sivad-sidebar", sidebarContraido ? "contraido" : "expandido");
  }, [sidebarContraido]);
  useEffect(() => {
    if (!menuAbierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAbierto(false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [menuAbierto]);

  // Catálogos: años y entidades disponibles.
  useEffect(() => {
    const control = new AbortController();
    obtenerCatalogos(control.signal)
      .then(({ anios: datosAnios, entidades: datosEntidades }) => {
        const disponibles: number[] = (
          datosAnios.length ? datosAnios.map(Number) : [2020]
        ).sort((a: number, b: number) => b - a);
        setAnios(disponibles);
        setEntidades(datosEntidades ?? []);
        const actual = String(disponibles[0]);
        const referencia = String(disponibles[1] ?? disponibles[0]);
        setAnioActual(actual);
        setAnioReferencia(referencia);
        setDesde(`${actual}-01`);
        setHasta(`${actual}-12`);
        setPeriodoActual(periodoAnual(actual));
        setPeriodoReferencia(periodoAnual(referencia));
      })
      .catch(() => {
        if (!control.signal.aborted) setEstado("error");
      });
    return () => control.abort();
  }, [intento]);

  // Ambas consultas se ejecutan con exactamente el mismo tipo de filtro temporal.
  useEffect(() => {
    if (!periodoActual || !periodoReferencia) return;
    const control = new AbortController();
    const { signal } = control;
    (async () => {
      setEstado("cargando");
      try {
        const [actual, referencia] = await obtenerComparativa(periodoActual, periodoReferencia, entidad, signal);
        if (signal.aborted) return;
        setResumen(actual.resumen);
        setResumenReferencia(referencia.resumen);
        setSerie(actual.serie);
        setSerieReferencia(referencia.serie);
        setTerritorios(actual.territorios);
        setMapa(actual.mapa);
        setEstado(actual.resumen.total_registros ? "listo" : "vacio");
      } catch {
        if (signal.aborted) return;
        setResumen(null);
        setResumenReferencia(null);
        setSerie([]);
        setSerieReferencia([]);
        setTerritorios([]);
        setMapa(null);
        setEstado("error");
      }
    })();
    return () => control.abort();
  }, [entidad, periodoActual, periodoReferencia, intento]);

  // Desglose por clasificación del municipio seleccionado (bajo demanda).
  const codigoMunicipio =
    mapa?.features.find((f) => f.id === seleccionId)?.properties.codigo ?? "";
  useEffect(() => {
    if (!codigoMunicipio || !periodoActual) {
      setDesglose(null);
      return;
    }
    const control = new AbortController();
    setDesglose({ estado: "cargando" });
    obtenerDesgloseMunicipal(periodoActual, entidad, codigoMunicipio, control.signal)
      .then((datos) =>
        setDesglose({
          estado: "listo",
          confirmados: totalEstatus(datos, 2),
          probables: totalEstatus(datos, 1),
          descartados: totalEstatus(datos, 3),
        }),
      )
      .catch(() => {
        if (!control.signal.aborted) setDesglose({ estado: "error" });
      });
    return () => control.abort();
  }, [codigoMunicipio, periodoActual, entidad]);

  // Resalta en la navegación la sección visible.
  useEffect(() => {
    const elementos = NAV.map((n) => document.getElementById(n.destino)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!elementos.length) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setSeccionActiva(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [estado]);

  const nombreEntidad =
    entidades.find((item) => item.codigo === entidad)?.nombre ??
    (entidad === ENTIDAD_INICIAL ? NOMBRE_INICIAL : `Entidad ${entidad}`);
  const opcionesEntidad = entidades.length
    ? entidades
    : [{ codigo: ENTIDAD_INICIAL, nombre: NOMBRE_INICIAL }];
  const confirmados = resumen ? totalEstatus(resumen, 2) : 0;

  const mesesSerie = useMemo(() => agruparMeses(serie), [serie]);
  const pico = useMemo(() => {
    let indice = -1;
    mesesSerie.forEach((valor, i) => {
      if (valor !== null && (indice < 0 || valor > (mesesSerie[indice] ?? 0)))
        indice = i;
    });
    const total = indice >= 0 ? (mesesSerie[indice] as number) : 0;
    return total > 0 ? { mes: MESES_LARGOS[indice], total } : null;
  }, [mesesSerie]);

  const totalMunicipios = mapa?.features.length ?? 0;
  const municipiosConCasos =
    mapa?.features.filter((f) => f.properties.casos_confirmados > 0).length ??
    0;
  const idPorNombre = useMemo(
    () =>
      new Map<string, string>(
        (mapa?.features ?? []).map(
          (f) => [normalizar(f.properties.nombre), f.id] as [string, string],
        ),
      ),
    [mapa],
  );
  const maxTerritorio = Math.max(1, ...territorios.map((t) => t.total_casos));

  const confirmadosReferencia = resumenReferencia ? totalEstatus(resumenReferencia, 2) : null;
  const textoVariacion =
    confirmadosReferencia === null
      ? "Sin periodo de referencia disponible"
      : confirmadosReferencia === 0
        ? "Sin casos confirmados en el periodo de referencia"
        : `${confirmados >= confirmadosReferencia ? "▲" : "▼"} ${porcentaje(
            (Math.abs(confirmados - confirmadosReferencia) / confirmadosReferencia) * 100,
          )} % frente a ${periodoReferencia?.etiqueta} (${numero(confirmadosReferencia)} casos)`;

  const etiquetaEstado =
    estado === "error"
      ? "No se pudo conectar con la API pública"
      : estado === "cargando"
        ? "Actualizando consulta…"
        : "Fuente: API pública SIVAD";

  const elegirEntidad = (codigo: string) => {
    setEntidad(codigo);
    setSeleccionId(null);
  };
  const aplicarComparacion = () => {
    if (modoTemporal === "anual") {
      setPeriodoActual(periodoAnual(anioActual));
      setPeriodoReferencia(periodoAnual(anioReferencia));
    } else if (desde && hasta && desde <= hasta) {
      const actual = periodoPersonalizado(desde, hasta);
      setPeriodoActual(actual);
      setPeriodoReferencia(mismoRangoAnioAnterior(actual));
    }
    setSeleccionId(null);
  };
  const alternarSeleccion = (f: Caracteristica) =>
    setSeleccionId((actual) => (actual === f.id ? null : f.id));
  const seleccionarPorNombre = (nombre: string) => {
    const id = idPorNombre.get(normalizar(nombre));
    if (id) setSeleccionId((actual) => (actual === id ? null : id));
  };
  const reintentar = () => {
    setEstado("cargando");
    setIntento((n) => n + 1);
  };

  let contenido: ReactNode;
  if (estado === "error") {
    contenido = (
      <section className="vacio" role="alert">
        <h2>No se pudo cargar la información</h2>
        <p>
          La API pública no respondió. No se muestran cifras de respaldo para
          evitar confundirlas con datos reales de {nombreEntidad}.
        </p>
        <button type="button" onClick={reintentar}>
          Reintentar
        </button>
      </section>
    );
  } else if (!resumen && estado === "cargando") {
    contenido = (
      <section className="vacio" aria-busy="true">
        <h2>Consultando datos epidemiológicos</h2>
        <p>Estamos actualizando indicadores, mapa y tendencia.</p>
      </section>
    );
  } else if (estado === "vacio") {
    contenido = (
      <section className="vacio">
        <h2>Sin registros para esta consulta</h2>
        <p>
          No hay casos registrados en {nombreEntidad} durante {periodoActual?.etiqueta}. Prueba con
          otro periodo u otra entidad.
        </p>
      </section>
    );
  } else {
    contenido = (
      <>
        <div className="zona-principal">
          <MapaMunicipal
            key={entidad}
            coleccion={mapa}
            cobertura={nombreEntidad}
            anio={periodoActual?.etiqueta ?? ""}
            totalConfirmados={confirmados}
            seleccionId={seleccionId}
            alSeleccionar={alternarSeleccion}
            desglose={desglose}
          />
          <div className="lateral">
            <section
              id="panorama"
              className="indicadores"
              aria-label="Indicadores clave"
            >
              <article className="ind ind-principal">
                <p className="etiqueta-confirmada">
                  Casos confirmados · {periodoActual?.etiqueta}
                </p>
                <strong>{numero(confirmados)}</strong>
                <small>{textoVariacion}</small>
              </article>
              <article className="ind">
                <p>Mes con más casos</p>
                <strong className="texto">{pico ? pico.mes : "—"}</strong>
                <small>
                  {pico
                    ? `${numero(pico.total)} casos confirmados`
                    : "Sin serie disponible"}
                </small>
              </article>
              <article className="ind">
                <p>Municipios con casos</p>
                <strong>
                  {totalMunicipios ? numero(municipiosConCasos) : "—"}
                </strong>
                <small>
                  {totalMunicipios
                    ? `de ${numero(totalMunicipios)} municipios en el mapa`
                    : "Sin geometría municipal"}
                </small>
              </article>
            </section>
            <article id="territorio" className="bloque">
              <p className="sobrelinea">Distribución territorial</p>
              <h2>Municipios con más casos</h2>
              {territorios.length ? (
                <table>
                  <caption className="sr-only">
                    Municipios con más casos confirmados en {nombreEntidad},{" "}
                    {periodoActual?.etiqueta}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Municipio</th>
                      <th scope="col" className="num">
                        Casos
                      </th>
                      <th scope="col" className="num">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {territorios.map((t, i) => {
                      const id = idPorNombre.get(normalizar(t.nombre));
                      return (
                        <tr
                          key={t.nombre}
                          className={id && id === seleccionId ? "activa" : ""}
                        >
                          <td className="rango">{i + 1}</td>
                          <td>
                            <button
                              type="button"
                              className="fila-btn"
                              disabled={!id}
                              onClick={() => seleccionarPorNombre(t.nombre)}
                            >
                              {t.nombre}
                            </button>
                            <span className="barra" aria-hidden="true">
                              <i
                                style={{
                                  width: `${(t.total_casos / maxTerritorio) * 100}%`,
                                }}
                              />
                            </span>
                          </td>
                          <td className="num">{numero(t.total_casos)}</td>
                          <td className="num">
                            {confirmados > 0
                              ? porcentaje((t.total_casos / confirmados) * 100)
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="nota">No hay distribución municipal disponible.</p>
              )}
            </article>
          </div>
        </div>
        <LineaTiempoModular anios={anios} modo={modoTemporal} anioActual={anioActual} anioReferencia={anioReferencia} desde={desde} hasta={hasta} alCambiarModo={setModoTemporal} alCambiarActual={setAnioActual} alCambiarReferencia={setAnioReferencia} alCambiarDesde={setDesde} alCambiarHasta={setHasta} alAplicar={aplicarComparacion} />
        <section id="tendencia" className="bloque bloque-tendencia">
          <p className="sobrelinea">Evolución de casos</p>
          {serie.length ? (
            <GraficaComparativa actual={{ datos: serie, etiqueta: periodoActual?.etiqueta ?? "Periodo actual" }} referencia={{ datos: serieReferencia, etiqueta: periodoReferencia?.etiqueta ?? "Periodo de referencia" }} />
          ) : (
            <>
              <h2>Casos confirmados por mes</h2>
              <p className="nota">No hay serie disponible para esta consulta.</p>
            </>
          )}
        </section>
      </>
    );
  }

  return (
    <div className={`app-shell${sidebarContraido ? " sidebar-contraido" : ""}`}>
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      {menuAbierto && (
        <div
          className="cortina"
          aria-hidden="true"
          onClick={() => setMenuAbierto(false)}
        />
      )}
      <aside
        id="sidebar"
        className={`sidebar${menuAbierto ? " abierto" : ""}`}
        aria-label="Panel de navegación"
      >
        <a
          className="marca"
          href="#inicio"
          aria-label="SIVAD, inicio"
          title="SIVAD"
          onClick={() => setMenuAbierto(false)}
        >
          <span className="marca-icono" aria-hidden="true">
            S
          </span>
          <span className="marca-texto">
            SIVAD
            <small>Observatorio del dengue</small>
          </span>
        </a>
        <p className="nav-titulo">Explorar datos</p>
        <nav id="navegacion" aria-label="Navegación principal">
          {NAV.map((item) => (
            <a
              key={item.destino}
              href={`#${item.destino}`}
              aria-label={item.texto}
              title={item.texto}
              aria-current={seccionActiva === item.destino ? "location" : undefined}
              onClick={() => setMenuAbierto(false)}
            >
              <IconoModular nombre={item.icono} />
              <span className="nav-texto">{item.texto}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-pie">
          <a
            href="/api/docs/"
            target="_blank"
            rel="noreferrer"
            aria-label="Documentación API, abre otra pestaña"
            title="Documentación API"
          >
            <IconoModular nombre="api" />
            <span className="nav-texto">Documentación API ↗</span>
          </a>
          <p>Consulta pública · México</p>
        </div>
      </aside>
      <div className="area-principal">
        <header className="encabezado">
          <div className="barra-identidad">
            <button
              className="sidebar-toggle icon-button"
              type="button"
              aria-expanded={!sidebarContraido}
              aria-controls="sidebar"
              title={sidebarContraido ? "Expandir menú" : "Contraer menú"}
              aria-label={sidebarContraido ? "Expandir menú" : "Contraer menú"}
              onClick={() => setSidebarContraido(!sidebarContraido)}
            >
              <IconoModular nombre="menu" />
            </button>
            <button
              className="menu-toggle icon-button"
              type="button"
              aria-expanded={menuAbierto}
              aria-controls="sidebar"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <IconoModular nombre="menu" />
            </button>
            <span className="barra-titulo">
              SIVAD <span>/ Explorador epidemiológico</span>
            </span>
          </div>
          <button
            className="tema-toggle"
            type="button"
            aria-label={`Activar modo ${tema === "light" ? "oscuro" : "claro"}`}
            onClick={() => setTema(tema === "light" ? "dark" : "light")}
          >
            <IconoModular nombre={tema === "light" ? "luna" : "sol"} />
            <span>{tema === "light" ? "Modo oscuro" : "Modo claro"}</span>
          </button>
        </header>
        <main id="contenido" tabIndex={-1}>
          <section id="inicio" className="titulo">
            <p className="sobrelinea">
              Datos públicos / Vigilancia epidemiológica
            </p>
            <h1>
              Dengue en {nombreEntidad}
              {periodoActual && ` · ${periodoActual.etiqueta}`}
            </h1>
            <p className="subtitulo">
              Tablero exploratorio de casos confirmados. No sustituye la
              comunicación oficial de una alerta sanitaria.
            </p>
          </section>
          <form
            className="filtros"
            aria-label="Filtros de consulta"
            onSubmit={(e) => e.preventDefault()}
          >
            <label>
              Entidad federativa
              <select
                value={entidad}
                onChange={(e) => elegirEntidad(e.target.value)}
              >
                {opcionesEntidad.map((item) => (
                  <option key={item.codigo} value={item.codigo}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </label>
            <p className={`estado ${estado}`} role="status">
              {etiquetaEstado}
            </p>
          </form>
          <div
            className={`contenido${estado === "cargando" && resumen ? " actualizando" : ""}`}
            aria-busy={estado === "cargando"}
          >
            {contenido}
          </div>
          <footer>
            <p>
              SIVAD · Datos para consulta y análisis. Clasificación: confirmado
              = estatus 2.
            </p>
            <a href="/api/redoc/" target="_blank" rel="noreferrer">
              Referencia técnica ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
