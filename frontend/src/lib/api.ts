// frontend/src/lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error ${res.status}`);
  }

  return res.json();
}

// Dashboard
export const api = {
  // Dashboard
  getDashboard: () => fetchAPI<any>('/obligaciones/dashboard'),
  getProximosVencimientos: (limite = 10) => 
    fetchAPI<any>(`/obligaciones/proximos-vencimientos?limite=${limite}`),
  getIndicadoresMes: (anio: number, mes: number) => 
    fetchAPI<any>(`/obligaciones/indicadores-mes?anio=${anio}&mes=${mes}`),

  // Obligaciones
  getObligaciones: (filtros?: Record<string, string>) => {
    const params = new URLSearchParams(filtros);
    return fetchAPI<any>(`/obligaciones?${params}`);
  },
  marcarCumplida: (id: string, observaciones?: string) =>
    fetchAPI<any>(`/obligaciones/${id}/cumplir`, {
      method: 'PUT',
      body: JSON.stringify({ observaciones }),
    }),

  // Calendario
  getCalendarioMensual: (anio: number, mes: number) =>
    fetchAPI<any>(`/obligaciones/calendario/mensual?anio=${anio}&mes=${mes}`),
  getCalendarioSemanal: (fecha: string) =>
    fetchAPI<any>(`/obligaciones/calendario/semanal?fecha=${fecha}`),
  getProximos30Dias: () =>
    fetchAPI<any>('/obligaciones/calendario/proximos-30'),

  // Checklist
  getChecklistActual: () => fetchAPI<any>('/checklist/mensual/actual'),
  getChecklistMensual: (anio: number, mes: number) =>
    fetchAPI<any>(`/checklist/mensual/${anio}/${mes}`),
  completarItem: (id: string, data: FormData) =>
    fetch(`${API_BASE}/checklist/item/${id}/completar`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: data,
    }).then(r => r.json()),
  desmarcarItem: (id: string) =>
    fetchAPI<any>(`/checklist/item/${id}/desmarcar`, { method: 'PUT' }),

  // Calculadoras
  calcularAguinaldo: (data: any) =>
    fetchAPI<any>('/calculadoras/aguinaldo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  calcularIPS: (salarioBruto: number) =>
    fetchAPI<any>('/calculadoras/ips', {
      method: 'POST',
      body: JSON.stringify({ salarioBruto }),
    }),
  calcularVacaciones: (data: any) =>
    fetchAPI<any>('/calculadoras/vacaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getParametros: () => fetchAPI<any>('/calculadoras/parametros'),

  // Alertas
  getConfigAlertas: () => fetchAPI<any>('/alertas/configuracion'),
  actualizarConfigAlertas: (data: any) =>
    fetchAPI<any>('/alertas/configuracion', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Notificaciones
  getNotificaciones: () => fetchAPI<any>('/notificaciones'),
  contarNoLeidas: () => fetchAPI<any>('/notificaciones/no-leidas/count'),
  marcarLeida: (id: string) =>
    fetchAPI<any>(`/notificaciones/${id}/leer`, { method: 'PUT' }),
  marcarTodasLeidas: () =>
    fetchAPI<any>('/notificaciones/leer-todas', { method: 'PUT' }),

  // Reportes
  getReporteCumplimiento: (anioDesde: number, anioHasta: number) =>
    fetchAPI<any>(`/reportes/cumplimiento?anioDesde=${anioDesde}&anioHasta=${anioHasta}`),
  getReporteMensual: (anio: number, mes: number) =>
    fetchAPI<any>(`/reportes/mensual/${anio}/${mes}`),
  exportarPDF: (params: Record<string, string>) => {
    const query = new URLSearchParams(params);
    return fetch(`${API_BASE}/reportes/exportar/pdf?${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.blob());
  },
  exportarExcel: (params: Record<string, string>) => {
    const query = new URLSearchParams(params);
    return fetch(`${API_BASE}/reportes/exportar/excel?${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.blob());
  },

  // Auth
  login: (email: string, password: string) =>
    fetchAPI<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
