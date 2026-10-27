import { useEffect, useRef, useState } from "react";

export function useAncho<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [ancho, setAncho] = useState(720);
  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    const medir = () => setAncho(Math.max(280, Math.round(elemento.clientWidth)));
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);
  return [ref, ancho] as const;
}
