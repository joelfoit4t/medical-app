import React, { useState, useEffect } from 'react';
import { SIDEBAR_ITEMS, FAVORITES_ITEMS, BOTTOM_ITEMS } from '../constants';
import { Plus, X, ChevronDown } from 'lucide-react';
import { NavItem } from '../types';

interface Props {
  isOpen: boolean;
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
  onClose: () => void;
}

export const Sidebar: React.FC<Props> = ({ isOpen, activeItem, onNavigate, onClose }) => {
  const isPatientModule = activeItem === 'Patient' || activeItem === 'Patient List' || activeItem === 'Patient Profile' || activeItem === 'Add Patient';
  const isAppointmentModule = activeItem === 'Appointment' || activeItem === 'Appointment List' || activeItem === 'Add Appointment';
  
  const [isPatientExpanded, setIsPatientExpanded] = useState(isPatientModule);
  const [isAppointmentExpanded, setIsAppointmentExpanded] = useState(isAppointmentModule);

  useEffect(() => {
    if (isPatientModule) setIsPatientExpanded(true);
    if (isAppointmentModule) setIsAppointmentExpanded(true);
  }, [activeItem]);

  const patientSubItems: { label: NavItem; active: boolean }[] = [
    { label: 'Patient List', active: activeItem === 'Patient List' || activeItem === 'Patient' },
    { label: 'Patient Profile', active: activeItem === 'Patient Profile' },
    { label: 'Add Patient', active: activeItem === 'Add Patient' },
  ];

  const appointmentSubItems: { label: NavItem; active: boolean }[] = [
    { label: 'Appointment List', active: activeItem === 'Appointment List' || activeItem === 'Appointment' },
    { label: 'Add Appointment', active: activeItem === 'Add Appointment' },
  ];

  const getLineStyles = (activeSubItem: NavItem, subItems: any[]) => {
    const activeIndex = subItems.findIndex(item => item.label === activeSubItem);
    if (activeIndex === -1) return { top: 'bg-emerald-500', bottom: 'bg-slate-100' };
    if (activeIndex === subItems.length - 1) return { top: 'bg-emerald-500', bottom: 'bg-emerald-500' };
    return { top: 'bg-emerald-500', bottom: 'bg-slate-100' };
  };

  return (
    <aside 
      className={`
        w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
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

      <nav className="px-4 py-2 space-y-1">
        {SIDEBAR_ITEMS.map((item, index) => {
          const isPatientItem = item.label === 'Patient';
          const isAppointmentItem = item.label === 'Appointment';
          
          let isActive = activeItem === item.label;
          if (isPatientItem) isActive = isPatientModule;
          if (isAppointmentItem) isActive = isAppointmentModule;

          const isExpanded = isPatientItem ? isPatientExpanded : (isAppointmentItem ? isAppointmentExpanded : false);

          return (
            <div key={index} className="space-y-1">
              <button
                onClick={() => {
                  if (isPatientItem) {
                    setIsPatientExpanded(!isPatientExpanded);
                    if (!isPatientExpanded && !isPatientModule) onNavigate('Patient List');
                  } else if (isAppointmentItem) {
                    setIsAppointmentExpanded(!isAppointmentExpanded);
                    if (!isAppointmentExpanded && !isAppointmentModule) onNavigate('Appointment List');
                  } else {
                    onNavigate(item.label as NavItem);
                  }
                }}
                className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border-2 border-blue-500'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-emerald-500' : 'text-slate-400'} />
                  <span className={isActive ? 'text-emerald-600' : ''}>{item.label}</span>
                </div>
                {(isPatientItem || isAppointmentItem) && (
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* Patient Sub-navigation */}
              {isPatientItem && isPatientExpanded && (
                <div className="ml-9 mt-1 mb-2 relative flex flex-col space-y-4">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] ml-[-1px]">
                    <div className={`h-1/2 w-full ${getLineStyles(activeItem, patientSubItems).top}`}></div>
                    <div className={`h-1/2 w-full ${getLineStyles(activeItem, patientSubItems).bottom}`}></div>
                  </div>
                  {patientSubItems.map((sub, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onNavigate(sub.label)}
                      className="relative flex items-center group cursor-pointer pl-6 h-6"
                    >
                      <div className={`absolute left-[-5px] w-2.5 h-2.5 rounded-full border-2 bg-white transition-all duration-300 z-10 ${
                        sub.active 
                          ? 'border-emerald-500 ring-4 ring-emerald-50 scale-125' 
                          : 'border-slate-200 group-hover:border-slate-300'
                      }`}>
                         {sub.active && <div className="w-1 h-1 bg-emerald-500 rounded-full absolute inset-0 m-auto"></div>}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        sub.active ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-700'
                      }`}>
                        {sub.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Appointment Sub-navigation */}
              {isAppointmentItem && isAppointmentExpanded && (
                <div className="ml-9 mt-1 mb-2 relative flex flex-col space-y-4">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] ml-[-1px]">
                    <div className={`h-1/2 w-full ${getLineStyles(activeItem, appointmentSubItems).top}`}></div>
                    <div className={`h-1/2 w-full ${getLineStyles(activeItem, appointmentSubItems).bottom}`}></div>
                  </div>
                  {appointmentSubItems.map((sub, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onNavigate(sub.label)}
                      className="relative flex items-center group cursor-pointer pl-6 h-6"
                    >
                      <div className={`absolute left-[-5px] w-2.5 h-2.5 rounded-full border-2 bg-white transition-all duration-300 z-10 ${
                        sub.active 
                          ? 'border-emerald-500 ring-4 ring-emerald-50 scale-125' 
                          : 'border-slate-200 group-hover:border-slate-300'
                      }`}>
                         {sub.active && <div className="w-1 h-1 bg-emerald-500 rounded-full absolute inset-0 m-auto"></div>}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        sub.active ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-700'
                      }`}>
                        {sub.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

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
      </div>
    </aside>
  );
};