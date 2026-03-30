// frontend/src/components/layout/Header.tsx

'use client';

import { useNotificaciones } from '@/hooks/useNotificaciones';
import { NotificacionBell } from '@/components/alertas/NotificacionBell';
import { 
  Bell, 
  Settings, 
  User,
  Search
} from 'lucide-react';

export function Header() {
  const { noLeidas } = useNotificaciones();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30 shadow-sm shadow-gray-100/50">
      <div className="flex items-center gap-8 flex-1">
        <p className="text-sm font-medium text-gray-500 capitalize min-w-[140px]">
          {new Date().toLocaleDateString('es-PY', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100/50 w-full max-w-md focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all group">
          <Search className="w-4 h-4 text-gray-400 group-focus-within:text-gray-600" />
          <input 
            type="text" 
            placeholder="Buscar obligaciones, leyes..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-gray-700" 
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <NotificacionBell count={noLeidas} />
        
        <button className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all">
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-10 w-[1px] bg-gray-100 mx-2" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">Admin Daniel</p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">Especialista Laboral</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 ring-2 ring-white ring-offset-2 ring-offset-gray-50 cursor-pointer hover:scale-105 transition-transform">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
