// backend/prisma/seed.ts

import { PrismaClient, CategoriaObligacion, Frecuencia } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ============================================
  // TIPOS DE OBLIGACIÓN
  // ============================================
  const tiposObligacion = [
    {
      codigo: 'IPS_APORTE',
      nombre: 'Aportes IPS',
      descripcion: 'Pago mensual de aportes al Instituto de Previsión Social',
      categoria: CategoriaObligacion.SEGURIDAD_SOCIAL,
      frecuencia: Frecuencia.MENSUAL,
      diaVencimiento: 15,
      esObligatoria: true,
      fundamentoLegal: 'Decreto-Ley N° 1860/50 - Ley Orgánica del IPS',
    },
    {
      codigo: 'PLANILLA_MTESS',
      nombre: 'Planilla Laboral Anual MTESS',
      descripcion: 'Presentación de planilla laboral ante el Ministerio de Trabajo',
      categoria: CategoriaObligacion.TRIBUTARIA_LABORAL,
      frecuencia: Frecuencia.ANUAL,
      diaVencimiento: 31,
      mesVencimiento: 3, // Marzo
      esObligatoria: true,
      fundamentoLegal: 'Código Laboral - Ley 213/93',
    },
    {
      codigo: 'AGUINALDO_1',
      nombre: 'Aguinaldo - Primera Cuota',
      descripcion: 'Pago del primer aguinaldo (enero-junio)',
      categoria: CategoriaObligacion.REMUNERACION,
      frecuencia: Frecuencia.ANUAL,
      diaVencimiento: 30,
      mesVencimiento: 6,
      esObligatoria: true,
      fundamentoLegal: 'Código Laboral Art. 243-246',
    },
    {
      codigo: 'AGUINALDO_2',
      nombre: 'Aguinaldo - Segunda Cuota',
      descripcion: 'Pago del segundo aguinaldo (julio-diciembre)',
      categoria: CategoriaObligacion.REMUNERACION,
      frecuencia: Frecuencia.ANUAL,
      diaVencimiento: 31,
      mesVencimiento: 12,
      esObligatoria: true,
      fundamentoLegal: 'Código Laboral Art. 243-246',
    },
    {
      codigo: 'SALARIO_MINIMO_CHECK',
      nombre: 'Verificación Salario Mínimo',
      descripcion: 'Verificar actualización del salario mínimo vigente',
      categoria: CategoriaObligacion.REMUNERACION,
      frecuencia: Frecuencia.ANUAL,
      diaVencimiento: 1,
      mesVencimiento: 7, // Generalmente se actualiza mediados de año
      esObligatoria: true,
      fundamentoLegal: 'Código Laboral Art. 249-257',
    },
    {
      codigo: 'RENOVACION_CONTRATOS',
      nombre: 'Renovación de Contratos',
      descripcion: 'Revisión y renovación de contratos laborales próximos a vencer',
      categoria: CategoriaObligacion.CONTRACTUAL,
      frecuencia: Frecuencia.MENSUAL,
      diaVencimiento: 1,
      esObligatoria: true,
      fundamentoLegal: 'Código Laboral Art. 17-48',
    },
    {
      codigo: 'CAPACITACION_SSO',
      nombre: 'Capacitaciones Obligatorias SSO',
      descripcion: 'Capacitaciones de Seguridad y Salud Ocupacional',
      categoria: CategoriaObligacion.CAPACITACION,
      frecuencia: Frecuencia.SEMESTRAL,
      diaVencimiento: 15,
      mesVencimiento: 6,
      esObligatoria: true,
      fundamentoLegal: 'Ley 5804/17 - Seguridad y Salud Ocupacional',
    },
  ];

  for (const tipo of tiposObligacion) {
    await prisma.tipoObligacion.upsert({
      where: { codigo: tipo.codigo },
      update: tipo,
      create: tipo,
    });
  }

  // ============================================
  // ITEMS DE CHECKLIST TEMPLATE
  // ============================================
  const ipsType = await prisma.tipoObligacion.findUnique({ where: { codigo: 'IPS_APORTE' } });

  const itemsChecklist = [
    {
      nombre: 'Pago IPS realizado',
      descripcion: 'Aporte patronal y del trabajador depositado',
      orden: 1,
      requiereComprobante: true,
      tipoObligacionId: ipsType?.id,
    },
    {
      nombre: 'Salarios pagados',
      descripcion: 'Todos los salarios del mes abonados',
      orden: 2,
      requiereComprobante: false,
      tipoObligacionId: null,
    },
    {
      nombre: 'Horas extras registradas',
      descripcion: 'Registro completo de horas extras del período',
      orden: 3,
      requiereComprobante: false,
      tipoObligacionId: null,
    },
    {
      nombre: 'Altas/bajas comunicadas',
      descripcion: 'Comunicación de altas y bajas al IPS y MTESS',
      orden: 4,
      requiereComprobante: true,
      tipoObligacionId: ipsType?.id,
    },
    {
      nombre: 'Registro de asistencia actualizado',
      descripcion: 'Control de asistencia del mes completo',
      orden: 5,
      requiereComprobante: false,
      tipoObligacionId: null,
    },
  ];

  for (const item of itemsChecklist) {
    await prisma.itemChecklistTemplate.create({ data: item });
  }

  // ============================================
  // PARÁMETROS LABORALES PARAGUAY 2024
  // ============================================
  const parametros = [
    {
      codigo: 'SALARIO_MINIMO',
      nombre: 'Salario Mínimo Legal Vigente',
      valor: 2680373,
      vigenciaDesde: new Date('2024-07-01'),
    },
    {
      codigo: 'IPS_APORTE_PATRONAL',
      nombre: 'Aporte Patronal IPS (%)',
      valor: 16.5,
      vigenciaDesde: new Date('2024-01-01'),
    },
    {
      codigo: 'IPS_APORTE_TRABAJADOR',
      nombre: 'Aporte Trabajador IPS (%)',
      valor: 9.0,
      vigenciaDesde: new Date('2024-01-01'),
    },
    {
      codigo: 'BONIFICACION_FAMILIAR',
      nombre: 'Bonificación Familiar por Hijo',
      valor: 134019, // 5% del salario mínimo
      vigenciaDesde: new Date('2024-07-01'),
    },
    {
      codigo: 'HORA_EXTRA_DIURNA',
      nombre: 'Recargo Hora Extra Diurna (%)',
      valor: 50,
      vigenciaDesde: new Date('2024-01-01'),
    },
    {
      codigo: 'HORA_EXTRA_NOCTURNA',
      nombre: 'Recargo Hora Extra Nocturna/Feriado (%)',
      valor: 100,
      vigenciaDesde: new Date('2024-01-01'),
    },
  ];

  for (const param of parametros) {
    await prisma.parametroLaboral.upsert({
      where: { codigo: param.codigo },
      update: param,
      create: param,
    });
  }

  console.log('Seed completado exitosamente');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
