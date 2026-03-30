// frontend/src/components/alertas/NotificacionBell.tsx

'use client';

import { Bell } from 'lucide-react';

export function NotificacionBell({ count }: { count: number }) {
  return (
    <button className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group">
      <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
      {count > 0 && (
        <span className="absolute top-2 right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[10px] items-center justify-center text-white font-bold border-2 border-white">
            {count > 9 ? '9+' : count}
          </span>
        </span>
      )}
    </button>
  );
}
