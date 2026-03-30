// frontend/src/components/dashboard/StatCard.tsx

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'indigo' | 'green' | 'amber' | 'red';
  trend?: string;
}

const colors = {
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  red: 'bg-rose-50 text-rose-600 border-rose-100',
};

const iconColors = {
  indigo: 'bg-indigo-600 shadow-indigo-100',
  green: 'bg-emerald-600 shadow-emerald-100',
  amber: 'bg-amber-600 shadow-amber-100',
  red: 'bg-rose-600 shadow-rose-100',
};

export function StatCard({ label, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className={`p-6 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 bg-white ${colors[color].split(' ')[2]}`}>
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl text-white shadow-lg ${iconColors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 uppercase tracking-tight">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-6">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black text-gray-900 mt-1 tabular-nums tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}
