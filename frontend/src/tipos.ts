export type Resumen = {
  total_registros: number;
  por_estatus: { estatus_caso: number; total: number }[];
};

export type Serie = { periodo: string; total_casos: number };
export type Territorio = { nombre: string; total_casos: number };
export type Entidad = { codigo: string; nombre: string };
export type Coordenada = [number, number];
export type Caracteristica = {
  id: string;
  properties: { codigo: string; nombre: string; casos_confirmados: number };
  geometry: { type: string; coordinates: Coordenada[][][] | Coordenada[][] };
};
export type ColeccionMapa = { features: Caracteristica[] };
export type EstadoConsulta = "cargando" | "listo" | "vacio" | "error";
export type Desglose =
  | { estado: "cargando" }
  | { estado: "error" }
  | { estado: "listo"; confirmados: number; probables: number; descartados: number };
