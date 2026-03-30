// frontend/src/lib/types.ts

export interface TipoObligacion {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: CategoriaObligacion;
  frecuencia: Frecuencia;
  diaVencimiento: number | null;
  mesVencimiento: number | null;
  esObligatoria: boolean;
  fundamentoLegal: string | null;
}

export interface Obligacion {
  id: string;
  tipoObligacionId: string;
  tipoObligacion: TipoObligacion;
  anio: number;
  mes: number | null;
  fechaVencimiento: string;
  fechaCumplimiento: string | null;
  estado: EstadoObligacion;
  observaciones: string | null;
  comprobante: string | null;
}

export type EstadoObligacion = 'PENDIENTE' | 'PROXIMO' | 'CUMPLIDO' | 'VENCIDO';
export type CategoriaObligacion = 
  'SEGURIDAD_SOCIAL' | 'TRIBUTARIA_LABORAL' | 'REMUNERACION' | 'CONTRACTUAL' | 'CAPACITACION';
export type Frecuencia = 'MENSUAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL' | 'UNICA';

export interface IndicadoresMes {
  anio: number;
  mes: number;
  total: number;
  cumplidas: number;
  pendientes: number;
  vencidas: number;
  porcentajeCumplimiento: number;
}

export interface Dashboard {
  proximosVencimientos: Obligacion[];
  indicadores: IndicadoresMes;
  fechaActual: string;
}

// Checklist
export interface ChecklistMensual {
  id: string;
  anio: number;
  mes: number;
  cerrado: boolean;
  items: ChecklistItem[];
  resumen: {
    total: number;
    completados: number;
    pendientes: number;
    porcentaje: number;
  };
}

export interface ChecklistItem {
  id: string;
  itemTemplate: ItemTemplate;
  completado: boolean;
  fechaCompletado: string | null;
  completadoPor: { id: string; nombre: string; email: string } | null;
  comprobanteUrl: string | null;
  comprobanteNombre: string | null;
  observaciones: string | null;
}

export interface ItemTemplate {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  requiereComprobante: boolean;
}

// Calculadoras
export interface ResultadoAguinaldo {
  input: { salarioMensual: number; mesesTrabajados: number; otrosIngresos: number };
  resultado: { baseCalculo: number; aguinaldo: number; formula: string };
  fundamentoLegal: string;
  nota: string;
}

export interface ResultadoIPS {
  input: { salarioBruto: number };
  resultado: {
    aportePatronal: { porcentaje: number; monto: number };
    aporteTrabajador: { porcentaje: number; monto: number };
    totalAporte: number;
    salarioNeto: number;
    costoTotalEmpleador: number;
  };
  fundamentoLegal: string;
}

export interface ResultadoVacaciones {
  input: { fechaIngreso: string; salarioMensual: number };
  resultado: {
    aniosAntiguedad: number;
    diasCorrespondientes: number;
    salarioDiario: number;
    montoVacaciones: number;
    tramo: string;
  };
  fundamentoLegal: string;
  tabla: { rango: string; dias: number }[];
}

// Alertas
export interface ConfiguracionAlerta {
  id: string;
  diasAntes7: boolean;
  diasAntes3: boolean;
  diasAntes1: boolean;
  diaVencimiento: boolean;
  porEmail: boolean;
  enSistema: boolean;
  categorias: CategoriaObligacion[];
  activo: boolean;
}

// Notificaciones
export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'ALERTA_VENCIMIENTO' | 'CHECKLIST_GENERADO' | 'OBLIGACION_VENCIDA' | 'INFO';
  leida: boolean;
  leidaEn: string | null;
  entidadTipo: string | null;
  entidadId: string | null;
  createdAt: string;
}

// Vista calendario
export type VistaCalendario = 'mensual' | 'semanal' | 'proximos30';
