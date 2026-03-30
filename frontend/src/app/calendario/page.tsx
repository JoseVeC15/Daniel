// frontend/src/app/calendario/page.tsx

'use client';

import { useState } from 'react';
import { useCalendario } from '@/hooks/useObligaciones';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Filter,
  Plus
} from 'lucide-react';
import { MESES } from '@/lib/constants';

export default function CalendarioPage() {
  const [fecha, setFecha] = useState(new Date());
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;

  const { data, loading } = useCalendario('mensual', anio, mes);

  const prevMonth = () => setFecha(new Date(anio, mes - 2));
  const nextMonth = () => setFecha(new Date(anio, mes));

  // Generar días del mes
  const diasEnMes = new Date(anio, mes, 0).getDate();
  const primerDiaSemana = new Date(anio, mes - 1, 1).getDay(); // 0=Dom

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Calendario de Obligaciones</h2>
          <p className="text-gray-500 font-medium mt-1">Vencimientos críticos y recordatorios programados.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-100">
            <Plus className="w-5 h-5" />
            Nueva Obligación
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[32px] border-2 border-gray-100 shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-gray-900 capitalize tracking-tight">
              {MESES[mes - 1]} {anio}
            </h3>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button onClick={prevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500 hover:text-gray-900">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500 hover:text-gray-900">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            {['Mes', 'Semana', 'Lista'].map(view => (
              <button key={view} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all
                ${view === 'Mes' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}
              `}>
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 border-b border-gray-100 italic bg-gray-50/30">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
            <div key={dia} className="py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">
              {dia}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[140px] md:auto-rows-[180px]">
          {/* Espacios vacíos inicio */}
          {Array.from({ length: primerDiaSemana }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b border-gray-100 bg-gray-50/20" />
          ))}

          {/* Días del mes */}
          {Array.from({ length: diasEnMes }).map((_, i) => {
            const dia = i + 1;
            const obligacionesDia = data?.filter(o => new Date(o.fechaVencimiento).getDate() === dia) || [];
            
            return (
              <div key={dia} className="border-r border-b border-gray-100 p-3 md:p-4 hover:bg-indigo-50/20 transition-colors group relative">
                <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                  ${dia === new Date().getDate() && mes === new Date().getMonth()+1 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-gray-400 group-hover:text-gray-900'}
                `}>
                  {dia}
                </span>

                <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] md:max-h-[120px] pr-1">
                  {obligacionesDia.map(ob => (
                    <div key={ob.id} className={`p-1.5 rounded-lg border text-[9px] font-bold truncate transition-all cursor-pointer hover:scale-[1.02]
                      ${ob.estado === 'CUMPLIDO' 
                        ? 'bg-green-50 border-green-100 text-green-700' 
                        : ob.estado === 'VENCIDO'
                        ? 'bg-red-50 border-red-100 text-red-700'
                        : 'bg-amber-50 border-amber-100 text-amber-700 shadow-sm shadow-amber-100/50'}
                    `}>
                      {ob.tipoObligacion.nombre}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Espacios vacíos final */}
          {Array.from({ length: (7 - ((primerDiaSemana + diasEnMes) % 7)) % 7 }).map((_, i) => (
            <div key={`empty-end-${i}`} className="border-r border-b border-gray-100 bg-gray-50/20" />
          ))}
        </div>
      </div>
    </div>
  );
}
