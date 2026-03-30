// frontend/src/hooks/useObligaciones.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Dashboard, Obligacion, IndicadoresMes, VistaCalendario } from '@/lib/types';

export function useDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const dashboard = await api.getDashboard();
      setData(dashboard);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return { data, loading, error, refetch: cargar };
}

export function useCalendario(vista: VistaCalendario, anio: number, mes: number) {
  const [data, setData] = useState<Obligacion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      let resultado;
      switch (vista) {
        case 'mensual':
          resultado = await api.getCalendarioMensual(anio, mes);
          setData(resultado.obligaciones);
          break;
        case 'semanal':
          resultado = await api.getCalendarioSemanal(new Date(anio, mes - 1).toISOString());
          setData(resultado);
          break;
        case 'proximos30':
          resultado = await api.getProximos30Dias();
          setData(resultado);
          break;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [vista, anio, mes]);

  useEffect(() => { cargar(); }, [cargar]);

  return { data, loading, refetch: cargar };
}

export function useIndicadores(anio: number, mes: number) {
  const [data, setData] = useState<IndicadoresMes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getIndicadoresMes(anio, mes)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [anio, mes]);

  return { data, loading };
}
