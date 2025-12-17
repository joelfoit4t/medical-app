import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<Props> = ({ label, value, icon: Icon, colorClass, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white p-5 rounded-xl border transition-all cursor-pointer select-none
        ${isActive 
          ? 'border-blue-500 shadow-md ring-2 ring-blue-50' 
          : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'}
        flex items-center justify-between
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`w-1.5 h-10 rounded-full ${colorClass} transition-transform ${isActive ? 'scale-y-110' : ''}`} />
        <div>
          <h3 className={`text-2xl font-bold transition-colors ${isActive ? 'text-blue-600' : 'text-slate-800'}`}>{value}</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{label}</p>
        </div>
      </div>
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${isActive ? 'bg-blue-50 border-blue-100 text-blue-500' : 'border-slate-100 text-slate-400'}`}>
        <Icon size={20} />
      </div>
    </div>
  );
};