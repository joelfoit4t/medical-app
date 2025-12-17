import React from 'react';
import { SIDEBAR_ITEMS, FAVORITES_ITEMS, BOTTOM_ITEMS } from '../constants';
import { Plus, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <aside 
      className={`
        w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo & Close Button */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            <Plus size={20} strokeWidth={4} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Medicare</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="px-4 py-2 space-y-1">
        {SIDEBAR_ITEMS.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? 'bg-white text-slate-900 shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border border-slate-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} className={item.active ? 'text-slate-900' : 'text-slate-400'} />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Favorites */}
      <div className="px-8 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Favorite
      </div>
      <nav className="px-4 space-y-1">
        {FAVORITES_ITEMS.map((item, index) => (
          <a
            key={index}
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <item.icon size={20} className="text-slate-400" />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto px-4 pb-4">
        {BOTTOM_ITEMS.map((item, index) => (
          <a
            key={index}
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <item.icon size={20} className="text-slate-400" />
            {item.label}
          </a>
        ))}

        {/* Premium CTA */}
        <div className="mt-6 bg-blue-50 rounded-2xl p-4 text-center relative overflow-hidden">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-200">
                <span className="text-lg">👑</span>
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">Unlock Premium</h3>
            <p className="text-xs text-slate-500 mb-4 px-1 leading-relaxed">
                Get advanced tools and exclusive access for a better experience.
            </p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 transition-all">
                Select Plan <span className="text-[10px]">›</span>
            </button>
        </div>
      </div>
    </aside>
  );
};