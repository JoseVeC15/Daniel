// frontend/src/app/checklist/page.tsx

'use client';

import { useChecklist } from '@/hooks/useChecklist';
import { 
  CheckSquare, 
  Square, 
  Upload, 
  FileText, 
  User,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { ESTADO_COLORS } from '@/lib/constants';

export default function ChecklistPage() {
  const { data, loading, completarItem, desmarcarItem } = useChecklist();

  if (loading) return <div className="animate-pulse h-96 bg-gray-100 rounded-3xl" />;

  const resumen = data?.resumen;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Checklist Operativo</h2>
          <p className="text-gray-500 font-medium mt-1">Control diario de tareas y obligaciones para {new Date().toLocaleDateString('es-PY', { month: 'long', year: 'numeric' })}</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-sm items-center gap-4 pr-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl">
            {resumen?.porcentaje}%
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progreso del mes</p>
            <p className="text-sm font-bold text-gray-900">{resumen?.completados} de {resumen?.total} tareas</p>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actividad</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Responsable / Fecha</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Comprobante</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.items.map((item) => (
              <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => item.completado ? desmarcarItem(item.id) : completarItem(item.id)}
                      className="mt-1 transition-transform active:scale-90"
                    >
                      {item.completado 
                        ? <CheckSquare className="w-6 h-6 text-indigo-600 fill-indigo-50" /> 
                        : <Square className="w-6 h-6 text-gray-300 group-hover:text-indigo-400" />
                      }
                    </button>
                    <div>
                      <p className={`font-bold transition-all ${item.completado ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {item.itemTemplate.nombre}
                      </p>
                      <p className="text-xs font-medium text-gray-400 mt-0.5">{item.itemTemplate.descripcion}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest border
                    ${item.completado 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                    }
                  `}>
                    {item.completado ? 'Completado' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {item.completado ? (
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-500" />
                       </div>
                       <div>
                         <p className="text-xs font-bold text-gray-700">{item.completadoPor?.nombre}</p>
                         <p className="text-[10px] text-gray-400">{new Date(item.fechaCompletado!).toLocaleDateString('es-PY')}</p>
                       </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300 italic">No asignado</span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  {item.itemTemplate.requiereComprobante ? (
                    item.comprobanteUrl ? (
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                        Ver Archivo
                      </button>
                    ) : (
                      <button 
                        onClick={() => {/* Trigger upload modal */}}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Subir
                      </button>
                    )
                  ) : (
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">No requerido</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data?.items.length === 0 && (
          <div className="py-20 text-center">
            <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No hay actividades para este mes</p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200">
          Cerrar Checklist del Mes
        </button>
      </div>
    </div>
  );
}
