// backend/src/services/calculadoras.service.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AguinaldoInput {
  salarioMensual: number;
  mesesTrabajados: number;
  otrosIngresos: number;
}

interface VacacionesInput {
  fechaIngreso: Date;
  salarioMensual: number;
}

export class CalculadorasService {

  async calcularAguinaldo(input: AguinaldoInput) {
    const { salarioMensual, mesesTrabajados, otrosIngresos } = input;

    // Aguinaldo = (salario + otros ingresos) * meses trabajados / 12
    // En Paraguay: 1 salario por cada 12 meses trabajados
    const baseCalculo = salarioMensual + otrosIngresos;
    const aguinaldo = (baseCalculo * mesesTrabajados) / 12;

    return {
      input: {
        salarioMensual,
        mesesTrabajados,
        otrosIngresos,
      },
      resultado: {
        baseCalculo,
        aguinaldo: Math.round(aguinaldo),
        formula: `(${baseCalculo.toLocaleString()} × ${mesesTrabajados}) / 12`,
      },
      fundamentoLegal: 'Código Laboral Art. 243-246 - Ley 213/93',
      nota: 'El aguinaldo se calcula sobre la base del salario mensual más otros ingresos regulares, proporcional a los meses trabajados en el semestre.',
    };
  }

  async calcularIPS(salarioBruto: number) {
    const parametros = await this.getParametrosVigentes();
    
    const porcentajePatronal = parametros.find(p => p.codigo === 'IPS_APORTE_PATRONAL')?.valor || 16.5;
    const porcentajeTrabajador = parametros.find(p => p.codigo === 'IPS_APORTE_TRABAJADOR')?.valor || 9.0;

    const aportePatronal = salarioBruto * (Number(porcentajePatronal) / 100);
    const aporteTrabajador = salarioBruto * (Number(porcentajeTrabajador) / 100);
    const totalAporte = aportePatronal + aporteTrabajador;

    return {
      input: { salarioBruto },
      resultado: {
        aportePatronal: {
          porcentaje: Number(porcentajePatronal),
          monto: Math.round(aportePatronal),
        },
        aporteTrabajador: {
          porcentaje: Number(porcentajeTrabajador),
          monto: Math.round(aporteTrabajador),
        },
        totalAporte: Math.round(totalAporte),
        salarioNeto: Math.round(salarioBruto - aporteTrabajador),
        costoTotalEmpleador: Math.round(salarioBruto + aportePatronal),
      },
      fundamentoLegal: 'Decreto-Ley N° 1860/50 - Ley Orgánica del IPS',
    };
  }

  async calcularVacaciones(input: VacacionesInput) {
    const { fechaIngreso, salarioMensual } = input;
    const ahora = new Date();
    
    // Calcular antigüedad
    const diffTime = ahora.getTime() - fechaIngreso.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    const aniosAntiguedad = Math.floor(diffYears);

    // Días de vacaciones según antigüedad (Código Laboral Art. 218)
    let diasVacaciones: number;
    if (aniosAntiguedad < 1) {
      diasVacaciones = 0; // No corresponde
    } else if (aniosAntiguedad <= 5) {
      diasVacaciones = 12; // Hasta 5 años
    } else if (aniosAntiguedad <= 10) {
      diasVacaciones = 18; // De 5 a 10 años
    } else {
      diasVacaciones = 30; // Más de 10 años
    }

    // Salario vacacional
    const salarioDiario = salarioMensual / 30;
    const montoVacaciones = salarioDiario * diasVacaciones;

    return {
      input: {
        fechaIngreso: fechaIngreso.toISOString().split('T')[0],
        salarioMensual,
      },
      resultado: {
        aniosAntiguedad,
        diasCorrespondientes: diasVacaciones,
        salarioDiario: Math.round(salarioDiario),
        montoVacaciones: Math.round(montoVacaciones),
        tramo: aniosAntiguedad < 1 
          ? 'Sin derecho (menos de 1 año)'
          : aniosAntiguedad <= 5 
          ? '1-5 años: 12 días corridos'
          : aniosAntiguedad <= 10
          ? '5-10 años: 18 días corridos'
          : 'Más de 10 años: 30 días corridos',
      },
      fundamentoLegal: 'Código Laboral Art. 218-227 - Ley 213/93',
      tabla: [
        { rango: 'Hasta 5 años', dias: 12 },
        { rango: 'De 5 a 10 años', dias: 18 },
        { rango: 'Más de 10 años', dias: 30 },
      ],
    };
  }

  async getParametrosVigentes() {
    const ahora = new Date();
    return prisma.parametroLaboral.findMany({
      where: {
        vigenciaDesde: { lte: ahora },
        OR: [
          { vigenciaHasta: null },
          { vigenciaHasta: { gte: ahora } },
        ],
      },
      orderBy: { vigenciaDesde: 'desc' },
    });
  }
}
