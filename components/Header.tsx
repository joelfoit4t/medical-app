import React from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { NavItem } from '../types';

interface Props {
  activeNav: NavItem;
  onMenuClick: () => void;
}

export const Header: React.FC<Props> = ({ activeNav, onMenuClick }) => {
  const subtitle = activeNav === 'Patient' ? 'All Patient Information in One Place' : 'Stay on Top of Your Schedule';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-10 transition-all">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800">{activeNav}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search.." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-48 lg:w-64 transition-all"
          />
        </div>

        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 relative shrink-0">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 sm:border-l border-slate-200">
          <img 
            src="https://picsum.photos/id/64/100/100" 
            alt="Dr. Clara" 
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div className="hidden md:block text-right">
            <h4 className="text-sm font-bold text-slate-800">Dr. Clara Redfield</h4>
            <p className="text-xs text-slate-500">clara.redfield@gmail.com</p>
          </div>
          <ChevronDown size={16} className="text-slate-400 cursor-pointer hidden sm:block" />
        </div>
      </div>
    </header>
  );
};