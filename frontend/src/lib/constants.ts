// frontend/src/lib/constants.ts

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const ESTADO_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDIENTE: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  PROXIMO: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  CUMPLIDO: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  VENCIDO: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
};

export const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  PROXIMO: 'Próximo',
  CUMPLIDO: 'Cumplido',
  VENCIDO: 'Vencido',
};

export const CATEGORIA_LABELS: Record<string, string> = {
  SEGURIDAD_SOCIAL: 'Seguridad Social',
  TRIBUTARIA_LABORAL: 'Tributaria Laboral',
  REMUNERACION: 'Remuneración',
  CONTRACTUAL: 'Contractual',
  CAPACITACION: 'Capacitación',
};

export const CATEGORIA_ICONS: Record<string, string> = {
  SEGURIDAD_SOCIAL: '🏥',
  TRIBUTARIA_LABORAL: '📋',
  REMUNERACION: '💰',
  CONTRACTUAL: '📄',
  CAPACITACION: '🎓',
};

// Paraguay
export const SALARIO_MINIMO_2024 = 2680373;
export const IPS_PATRONAL_PORCENTAJE = 16.5;
export const IPS_TRABAJADOR_PORCENTAJE = 9.0;
