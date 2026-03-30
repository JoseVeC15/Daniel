// frontend/src/hooks/useNotificaciones.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Notificacion } from '@/lib/types';

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    try {
      const [notifs, count] = await Promise.all([
        api.getNotificaciones(),
        api.contarNoLeidas(),
      ]);
      setNotificaciones(notifs);
      setNoLeidas(count.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // Polling cada 60 segundos
  useEffect(() => {
    const interval = setInterval(cargar, 60000);
    return () => clearInterval(interval);
  }, [cargar]);

  const marcarLeida = async (id: string) => {
    await api.marcarLeida(id);
    await cargar();
  };

  const marcarTodasLeidas = async () => {
    await api.marcarTodasLeidas();
    await cargar();
  };

  return { notificaciones, noLeidas, loading, marcarLeida, marcarTodasLeidas };
}
