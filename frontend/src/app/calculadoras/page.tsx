// frontend/src/app/calculadoras/page.tsx

'use client';

import Link from 'next/link';
import { 
  Calculator, 
  Wallet, 
  Umbrella, 
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';

const calculadoras = [
  {
    id: 'aguinaldo',
    title: 'Aguinaldo',
    description: 'Cálculo proporcional de la décimo tercera remuneración según meses trabajados.',
    icon: Wallet,
    color: 'bg-indigo-50 text-indigo-600',
    href: '/calculadoras/aguinaldo',
    tag: 'Anual / Proporcional'
  },
  {
    id: 'ips',
    title: 'Aportes IPS',
    description: 'Cálculo de aportes patronal (16.5%) y obrero (9.0%) sobre el salario bruto.',
    icon: Calculator,
    color: 'bg-emerald-50 text-emerald-600',
    href: '/calculadoras/ips',
    tag: 'Mensual'
  },
  {
    id: 'vacaciones',
    title: 'Vacaciones',
    description: 'Determinación de días de usufructo y remuneración según antigüedad.',
    icon: Umbrella,
    color: 'bg-amber-50 text-amber-600',
    href: '/calculadoras/vacaciones',
    tag: 'Ley 213/93'
  },
];

export default function CalculadorasHub() {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Herramientas de Cálculo</h2>
        <p className="text-gray-500 font-medium mt-1">Calculadoras basadas en la normativa legal vigente de Paraguay.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {calculadoras.map((calc) => (
          <Link 
            key={calc.id} 
            href={calc.href}
            className="group block p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-indigo-100 transition-all hover:shadow-xl hover:shadow-gray-100/50 relative overflow-hidden"
          >
            <div className={`p-4 rounded-2xl w-fit mb-6 ${calc.color}`}>
              <calc.icon className="w-8 h-8" />
            </div>
            
            <span className="inline-block text-[10px] font-bold px-2 py-1 bg-gray-50 text-gray-400 uppercase tracking-widest rounded-md mb-4 border border-gray-100">
              {calc.tag}
            </span>
            
            <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
              {calc.title}
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {calc.description}
            </p>

            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
              Comenzar cálculo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Background shape */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform -z-10" />
          </Link>
        ))}
      </div>

      <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-2xl flex gap-4 max-w-4xl">
        <div className="p-2 bg-amber-200/50 rounded-xl h-fit">
          <Info className="w-6 h-6 text-amber-700" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Nota Legal Importante</h4>
          <p className="text-sm text-amber-800/80 leading-relaxed mt-1">
            Los resultados de estas calculadoras son de carácter informativo y referencial. 
            No sustituyen al asesoramiento profesional ni a los cálculos oficiales de las entidades estatales correspondientes (IPS / MTESS).
          </p>
        </div>
      </div>
    </div>
  );
}
