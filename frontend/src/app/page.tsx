// frontend/src/app/page.tsx

'use client';

import { useDashboard } from '@/hooks/useObligaciones';
import { StatCard } from '@/components/dashboard/StatCard';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar as CalendarIcon,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="animate-pulse space-y-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-3xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-50 rounded-3xl" />
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-500 bg-red-50 rounded-2xl border border-red-100">{error}</div>;

  const indicadores = data?.indicadores;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bienvenido, Daniel 👋</h2>
          <p className="text-gray-500 font-medium mt-1">Resumen de cumplimiento para {new Date().toLocaleDateString('es-PY', { month: 'long', year: 'numeric' })}</p>
        </div>
        <Link href="/checklist" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 group">
          Ver Checklist Mensual
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Cumplimiento" 
          value={`${indicadores?.porcentajeCumplimiento || 0}%`} 
          icon={TrendingUp} 
          color="indigo" 
          trend="En progreso"
        />
        <StatCard 
          label="Obligaciones" 
          value={indicadores?.total || 0} 
          icon={CheckCircle2} 
          color="green" 
          trend="Totales"
        />
        <StatCard 
          label="Pendientes" 
          value={indicadores?.pendientes || 0} 
          icon={Clock} 
          color="amber" 
          trend="Próximas"
        />
        <StatCard 
          label="Vencidas" 
          value={indicadores?.vencidas || 0} 
          icon={AlertCircle} 
          color="red" 
          trend="Crítico"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Próximos Vencimientos */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              Próximos Vencimientos
            </h3>
            <Link href="/calendario" className="text-xs font-bold text-indigo-600 hover:underline">Ver calendario completo</Link>
          </div>

          <div className="space-y-4">
            {data?.proximosVencimientos.length ? data.proximosVencimientos.map((ob: any) => (
              <div key={ob.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                    ${ob.estado === 'PROXIMO' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-50 text-indigo-700'}
                  `}>
                    {new Date(ob.fechaVencimiento).getDate()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 tracking-tight">{ob.tipoObligacion.nombre}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{ob.tipoObligacion.categoria}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border-2 transition-colors
                    ${ob.estado === 'PROXIMO' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}
                  `}>
                    {ob.estado}
                  </span>
                  <p className="text-[10px] font-bold text-gray-400 mt-2">Vence: {new Date(ob.fechaVencimiento).toLocaleDateString('es-PY')}</p>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center">
                <p className="text-gray-400 font-bold">No hay vencimientos pendientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Resumen Checklist */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Checklist Mensual</h3>
            <p className="text-indigo-100 text-sm font-medium opacity-80">Estado de las tareas operativas de {new Date().toLocaleDateString('es-PY', { month: 'long' })}</p>
          </div>

          <div className="my-10 text-center">
            <div className="relative inline-flex items-center justify-center translate-y-2">
               {/* Progress Circle Placeholder (Simple CSS circle) */}
               <div className="w-32 h-32 rounded-full border-8 border-indigo-400/30 flex items-center justify-center">
                  <span className="text-4xl font-black">{indicadores?.porcentajeCumplimiento || 0}%</span>
               </div>
            </div>
          </div>

          <Link href="/checklist" className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-center font-bold transition-all border border-white/20">
            Gestionar Tareas
          </Link>
        </div>
      </div>
    </div>
  );
}
