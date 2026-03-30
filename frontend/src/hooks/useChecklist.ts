// frontend/src/hooks/useChecklist.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { ChecklistMensual } from '@/lib/types';

export function useChecklist(anio?: number, mes?: number) {
  const [data, setData] = useState<ChecklistMensual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const checklist = anio && mes
        ? await api.getChecklistMensual(anio, mes)
        : await api.getChecklistActual();
      setData(checklist);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [anio, mes]);

  useEffect(() => { cargar(); }, [cargar]);

  const completarItem = async (itemId: string, observaciones?: string, comprobante?: File) => {
    const formData = new FormData();
    if (observaciones) formData.append('observaciones', observaciones);
    if (comprobante) formData.append('comprobante', comprobante);

    await api.completarItem(itemId, formData);
    await cargar();
  };

  const desmarcarItem = async (itemId: string) => {
    await api.desmarcarItem(itemId);
    await cargar();
  };

  return { data, loading, error, completarItem, desmarcarItem, refetch: cargar };
}
