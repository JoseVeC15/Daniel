// frontend/src/components/layout/Sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Calculator, 
  BarChart3, 
  BellRing,
  LogOut
} from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendario', label: 'Calendario', icon: Calendar },
  { href: '/checklist', label: 'Checklist', icon: CheckSquare },
  { href: '/calculadoras', label: 'Calculadoras', icon: Calculator },
  { href: '/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/alertas/configuracion', label: 'Alertas', icon: BellRing },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200/60 flex-col shadow-sm">
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <span className="text-xl font-bold">L</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Cumplimiento
            </h1>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-0.5">
              Laboral Paraguay
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold
                transition-all duration-200 group
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-6">
          v1.0.0 — PY 2024
        </p>
      </div>
    </aside>
  );
}
