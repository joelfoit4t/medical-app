
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Calendar as CalendarIcon, 
  SlidersHorizontal, 
  Clock, 
  X,
  MoreHorizontal,
  Check,
  User,
  CalendarDays,
  Pencil, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Plus
} from 'lucide-react';
import { TIME_SLOTS } from '../constants';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentStatus, Appointment, Language } from '../types';
import { useTranslation } from '../i18n/translations';

type ViewType = 'calendar' | 'list';

interface Props {
  appointments: Appointment[];
  onUpdateAppointment: (apt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onAddAppointment: () => void;
  language: Language;
}

/**
 * Material UI Inspired Date Picker Component
 */
const MaterialDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}> = ({ value, onChange, onClose }) => {
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const selectedDate = value ? new Date(value) : null;

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();

  const days = useMemo(() => {
    const dCount = daysInMonth(viewDate.getMonth(), viewDate.getFullYear());
    const startDay = startDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
    const prevMonthDays = daysInMonth(viewDate.getMonth() - 1, viewDate.getFullYear());
    
    const arr = [];
    // Previous month filler
    for (let i = startDay - 1; i >= 0; i--) {
      arr.push({ day: prevMonthDays - i, current: false, date: new Date(year, viewDate.getMonth() - 1, prevMonthDays - i) });
    }
    // Current month
    for (let i = 1; i <= dCount; i++) {
      arr.push({ day: i, current: true, date: new Date(year, viewDate.getMonth(), i) });
    }
    // Next month filler
    const total = 42;
    const remaining = total - arr.length;
    for (let i = 1; i <= remaining; i++) {
      arr.push({ day: i, current: false, date: new Date(year, viewDate.getMonth() + 1, i) });
    }
    return arr;
  }, [viewDate]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const handleDateClick = (date: Date) => {
    const formatted = date.toISOString().split('T')[0];
    onChange(formatted);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 z-[110] w-[280px] p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
      <div className="flex items-center justify-between mb-4 px-1">
        <button type="button" className="text-sm font-bold text-[#1e293b] flex items-center gap-1">
          {monthName} {year} <ChevronDown size={14} />
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-50 rounded-full transition-colors"><ChevronUp size={18} className="-rotate-90 text-slate-400" /></button>
          <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-50 rounded-full transition-colors"><ChevronUp size={18} className="rotate-90 text-slate-400" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <span key={d} className="text-[10px] font-bold text-slate-400 py-1">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map((item, idx) => {
          const isSelected = selectedDate && item.date.toDateString() === selectedDate.toDateString();
          const isToday = item.date.toDateString() === new Date().toDateString();
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDateClick(item.date)}
              className={`
                h-8 w-8 rounded-full text-[11px] font-bold transition-all mx-auto flex items-center justify-center
                ${!item.current ? 'text-slate-300' : isSelected ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}
                ${isToday && !isSelected ? 'border border-emerald-500 text-emerald-500' : ''}
              `}
            >
              {item.day}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-50">
        <button type="button" onClick={() => { onChange(''); onClose(); }} className="text-[11px] font-bold text-emerald-600 px-2 py-1 hover:bg-emerald-50 rounded transition-colors uppercase">Clear</button>
        <button type="button" onClick={() => handleDateClick(new Date())} className="text-[11px] font-bold text-emerald-600 px-2 py-1 hover:bg-emerald-50 rounded transition-colors uppercase">Today</button>
      </div>
    </div>
  );
};

/**
 * Custom Material UI Time Picker Component
 * Adjust position for modal use cases (open upwards)
 */
const MaterialTimePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
  openUpwards?: boolean;
}> = ({ value, onChange, onClose, openUpwards = false }) => {
  const parseValue = (val: string) => {
    if (!val) return { hh: '09', mm: '00', period: 'AM' };
    const [hStr, mStr] = val.split(':');
    let h = parseInt(hStr);
    const mm = mStr;
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return { hh: String(h).padStart(2, '0'), mm, period };
  };

  const { hh: selectedH, mm: selectedM, period: selectedP } = parseValue(value);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const handleSelect = (hh: string, mm: string, p: string) => {
    let h = parseInt(hh);
    if (p === 'PM' && h < 12) h += 12;
    if (p === 'AM' && h === 12) h = 0;
    const timeValue = `${String(h).padStart(2, '0')}:${mm}`;
    onChange(timeValue);
  };

  const positionClasses = openUpwards 
    ? "absolute bottom-full left-0 mb-2 origin-bottom-left" 
    : "absolute top-full left-0 mt-2 origin-top-left";

  return (
    <div className={`${positionClasses} bg-white rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-100 z-[160] w-[240px] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
      <div className="grid grid-cols-3 h-[280px]">
        {/* Hours */}
        <div className="overflow-y-auto custom-scrollbar border-r border-slate-50 py-2">
          {hours.map(h => (
            <button
              key={h}
              type="button"
              onClick={() => handleSelect(h, selectedM, selectedP)}
              className={`w-full py-2.5 text-xs font-bold transition-all ${h === selectedH ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {h}
            </button>
          ))}
        </div>
        {/* Minutes */}
        <div className="overflow-y-auto custom-scrollbar border-r border-slate-50 py-2">
          {minutes.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => handleSelect(selectedH, m, selectedP)}
              className={`w-full py-2.5 text-xs font-bold transition-all ${m === selectedM ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {m}
            </button>
          ))}
        </div>
        {/* Periods */}
        <div className="py-2">
          {periods.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => handleSelect(selectedH, selectedM, p)}
              className={`w-full py-2.5 text-xs font-bold transition-all ${p === selectedP ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="p-3 bg-slate-50 flex justify-end">
        <button 
          onClick={onClose}
          type="button"
          className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-800 transition-colors px-3 py-1"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export const CalendarView: React.FC<Props> = ({ appointments, onUpdateAppointment, onDeleteAppointment, onAddAppointment, language }) => {
  const [viewType, setViewType] = useState<ViewType>('calendar');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const t = useTranslation(language);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showModalDatePicker, setShowModalDatePicker] = useState(false);
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const modalDateRef = useRef<HTMLDivElement>(null);
  const editTimePickerRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 22));

  const START_HOUR = 9;
  const PIXELS_PER_HOUR = 160; 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
      if (modalDateRef.current && !modalDateRef.current.contains(event.target as Node)) {
        setShowModalDatePicker(false);
      }
      if (editTimePickerRef.current && !editTimePickerRef.current.contains(event.target as Node)) {
        setShowEditTimePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleAllOnPage = (ids: string[]) => {
    const newSelected = new Set(selectedIds);
    const allSelected = ids.every(id => newSelected.has(id));
    if (allSelected) ids.forEach(id => newSelected.delete(id));
    else ids.forEach(id => newSelected.add(id));
    setSelectedIds(newSelected);
  };

  const formatDateString = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y}`;
  };

  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return '--:-- --';
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr);
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, '0')}:${mStr} ${period}`;
  };

  const getWeekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: d.getDate(),
        fullDate: d.toISOString().split('T')[0],
        active: d.toDateString() === currentDate.toDateString()
      };
    });
  }, [currentDate]);

  const displayAppointments = useMemo(() => {
    let filtered = [...appointments];
    if (statusFilter !== 'All') filtered = filtered.filter(apt => apt.status === statusFilter);
    if (viewType === 'calendar') {
      const weekDates = getWeekDays.map(wd => wd.fullDate);
      return filtered.filter(apt => weekDates.includes(apt.date)).sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  }, [getWeekDays, appointments, viewType, statusFilter]);

  const totalPages = Math.ceil(displayAppointments.length / itemsPerPage) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayAppointments.slice(start, start + itemsPerPage);
  }, [displayAppointments, currentPage]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const handleEditClick = (e: React.MouseEvent | undefined, apt: Appointment) => {
    if (e) e.stopPropagation();
    setEditingAppointment({ ...apt });
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteAppointment(id);
    setActiveMenuId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAppointment) {
      onUpdateAppointment(editingAppointment);
      setIsEditModalOpen(false);
      setEditingAppointment(null);
    }
  };

  const renderStatusBadge = (status: AppointmentStatus) => {
    let baseStyles = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold transition-all";
    switch (status) {
      case AppointmentStatus.Completed: return <span className={`${baseStyles} bg-emerald-50 text-emerald-600`}><Check size={12} /> {t('confirm')}</span>;
      case AppointmentStatus.Canceled: return <span className={`${baseStyles} bg-red-50 text-red-600`}><X size={12} /> {t('delete')}</span>;
      case AppointmentStatus.Waiting: return <span className={`${baseStyles} bg-amber-50 text-amber-600`}><User size={12} /> Waiting</span>;
      default: return <span className={`${baseStyles} bg-emerald-50 text-emerald-600`}><Clock size={12} /> Scheduled</span>;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col relative bg-[#fcfcfc]">
      {/* Top Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewType('list')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewType === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><List size={18} /> List</button>
          <button onClick={() => setViewType('calendar')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewType === 'calendar' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><CalendarIcon size={18} /> Calendar</button>
        </div>

        {viewType === 'calendar' && (
          <div className="flex items-center gap-2 relative">
            <button onClick={() => navigateDate('prev')} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"><ChevronLeft size={20} /></button>
            <button onClick={() => setShowDatePicker(!showDatePicker)} className="px-5 py-2 hover:bg-slate-100 rounded-full text-sm text-slate-700 font-bold">{currentDate.toLocaleDateString(language === 'EN' ? 'en-US' : 'fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}</button>
            <button onClick={() => navigateDate('next')} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        {viewType === 'calendar' ? (
          <>
            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200">
              <div className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center bg-white sticky left-0 z-30">GMT +7</div>
              {getWeekDays.map((day) => (
                <div key={day.fullDate} className={`p-5 text-center transition-colors border-r border-slate-200 last:border-r-0 ${day.active ? 'bg-emerald-50/50' : 'bg-white'}`}>
                  <span className={`text-[12px] font-bold block tracking-wider ${day.active ? 'text-emerald-500' : 'text-slate-400'}`}>{day.name} {day.date}</span>
                </div>
              ))}
            </div>
            <div className="overflow-y-auto flex-1 relative custom-scrollbar">
              <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] min-h-[960px] w-full">
                <div className="border-r border-slate-200 bg-white sticky left-0 z-20">
                  {TIME_SLOTS.map((time) => (
                    <div key={time} className="text-[11px] text-slate-400 font-bold p-3 text-center h-[160px] relative border-b border-slate-200"><span className="-top-2 relative bg-white px-2">{time}</span></div>
                  ))}
                </div>
                {getWeekDays.map((day) => (
                  <div key={day.fullDate} className={`relative border-r border-slate-200 last:border-r-0 min-w-[140px] ${day.active ? 'bg-emerald-50/10' : ''}`}>
                     {TIME_SLOTS.map((_, tIdx) => (<div key={tIdx} className="border-b border-slate-200 h-[160px] w-full"></div>))}
                     {displayAppointments.filter(apt => apt.date === day.fullDate).map(apt => (
                       <div key={apt.id} className="absolute left-3 right-3 z-10 transition-all" style={{ top: `${(parseInt(apt.startTime.split(':')[0]) - START_HOUR + parseInt(apt.startTime.split(':')[1])/60) * PIXELS_PER_HOUR}px`, height: '148px' }}>
                         <AppointmentCard appointment={apt} onClick={() => handleEditClick(undefined, apt)} />
                       </div>
                     ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
             <div className="px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative" ref={filterMenuRef}>
                    <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 transition-all ${isFilterMenuOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 'text-slate-500 hover:bg-slate-50'}`}><SlidersHorizontal size={20} /></button>
                    {isFilterMenuOpen && (
                      <div className="absolute left-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-slate-200 mb-1"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('filter')}</p></div>
                        {[
                          { label: t('appointmentlist'), value: 'All', icon: CalendarDays, color: 'text-slate-400' },
                          { label: 'Scheduled', value: AppointmentStatus.Scheduled, icon: Clock, color: 'text-emerald-500' },
                          { label: 'Completed', value: AppointmentStatus.Completed, icon: Check, color: 'text-emerald-600' },
                          { label: 'Waiting', value: AppointmentStatus.Waiting, icon: User, color: 'text-amber-500' },
                          { label: 'Canceled', value: AppointmentStatus.Canceled, icon: X, color: 'text-red-500' },
                        ].map((option) => (
                          <button key={option.value} onClick={() => { setStatusFilter(option.value as any); setIsFilterMenuOpen(false); setCurrentPage(1); }} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><div className="flex items-center gap-3"><option.icon size={16} className={option.color} />{option.label}</div>{statusFilter === option.value && <Check size={14} className="text-emerald-500" />}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={onAddAppointment} className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"><Plus size={18} /> {t('addappointment')}</button>
             </div>
             <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-y border-slate-200 bg-slate-50/30">
                      <th className="px-8 py-4 w-10 border-r border-slate-200"><input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" checked={paginatedAppointments.length > 0 && paginatedAppointments.every(apt => selectedIds.has(apt.id))} onChange={() => toggleAllOnPage(paginatedAppointments.map(apt => apt.id))} /></th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">ID</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">{t('patientname')}</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Date</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">{t('starttime')}</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Doctor</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">{t('reasonforvisit')}</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">{t('status')}</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedAppointments.length > 0 ? paginatedAppointments.map((apt) => {
                      const isSelected = selectedIds.has(apt.id);
                      return (
                        <tr key={apt.id} onClick={() => toggleSelection(apt.id)} className={`transition-colors group cursor-pointer ${isSelected ? 'bg-emerald-50/40' : 'hover:bg-emerald-50/20'}`}>
                          <td className="px-8 py-5 border-r border-slate-200" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" checked={isSelected} onChange={() => toggleSelection(apt.id)} /></td>
                          <td className="px-8 py-5 text-sm font-medium text-slate-500 border-r border-slate-200 text-center">{apt.id.split('-').pop()?.substring(0, 4)}</td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-800 border-r border-slate-200">{apt.patientName}</td>
                          <td className="px-8 py-5 text-sm text-slate-500 border-r border-slate-200 text-center">{apt.date}</td>
                          <td className="px-8 py-5 text-sm text-slate-500 border-r border-slate-200 text-center">{apt.startTime}</td>
                          <td className="px-8 py-5 border-r border-slate-200"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400"><User size={12} /></div><span className="text-sm font-medium text-slate-700">Dr. Lily Cooper</span></div></td>
                          <td className="px-8 py-5 text-sm text-slate-600 font-medium border-r border-slate-200">{apt.reason}</td>
                          <td className="px-8 py-5 text-center border-r border-slate-200">{renderStatusBadge(apt.status)}</td>
                          <td className="px-8 py-5 text-right relative" onClick={(e) => e.stopPropagation()}>
                            <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === apt.id ? null : apt.id); }} className="p-1 text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={20} /></button>
                            {activeMenuId === apt.id && (
                              <div ref={menuRef} className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1">
                                <button onClick={(e) => handleEditClick(e, apt)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><Pencil size={14} /> {t('edit')}</button>
                                <button onClick={(e) => handleDeleteClick(e, apt.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /> {t('delete')}</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={9} className="px-8 py-20 text-center"><div className="flex flex-col items-center gap-3 text-slate-400"><CalendarDays size={48} strokeWidth={1} /><p className="text-lg font-bold text-slate-600">No appointments found</p><p className="text-sm">Try changing your status filter.</p><button onClick={() => setStatusFilter('All')} className="mt-2 text-emerald-600 font-bold text-sm hover:underline">Reset filter</button></div></td></tr>
                    )}
                  </tbody>
                </table>
             </div>
             <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-12"><span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">Showing {paginatedAppointments.length} of {displayAppointments.length} sessions</span><div className="flex items-center gap-3">{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (<button key={p} onClick={() => setCurrentPage(p)} className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${p === currentPage ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-700'}`}>{p}</button>))}</div></div>
                <div className="flex items-center gap-2"><button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 transition-all ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-500'}`}><ChevronLeft size={18} /></button><button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 transition-all ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-500'}`}><ChevronRight size={18} /></button></div>
             </div>
          </div>
        )}
      </div>

      {/* Edit Modal - Strictly following the screenshot design */}
      {isEditModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-in zoom-in slide-in-from-bottom-4 relative z-10 p-10">
            <h2 className="text-3xl font-bold text-[#1e293b] mb-10">{t('editappointment')}</h2>
            <form onSubmit={handleSaveEdit} className="space-y-6">
              <div className="space-y-5">
                {/* Patient Name */}
                <input 
                  type="text" 
                  className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[20px] text-base font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" 
                  value={editingAppointment.patientName} 
                  onChange={e => setEditingAppointment({...editingAppointment, patientName: e.target.value})} 
                  placeholder={t('patientname')} 
                />
                
                {/* Reason */}
                <input 
                  type="text" 
                  className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[20px] text-base font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" 
                  value={editingAppointment.reason} 
                  onChange={e => setEditingAppointment({...editingAppointment, reason: e.target.value})} 
                  placeholder={t('reasonforvisit')} 
                />
                
                {/* Date and Status Row */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="relative" ref={modalDateRef}>
                    <div 
                      onClick={() => setShowModalDatePicker(!showModalDatePicker)}
                      className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[20px] text-base font-semibold text-slate-800 flex items-center justify-between cursor-pointer hover:bg-white transition-all group"
                    >
                      <span>{formatDateString(editingAppointment.date)}</span>
                      <CalendarIcon size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    {showModalDatePicker && (
                      <MaterialDatePicker 
                        value={editingAppointment.date} 
                        onChange={(val) => setEditingAppointment({...editingAppointment, date: val})} 
                        onClose={() => setShowModalDatePicker(false)} 
                      />
                    )}
                  </div>
                  
                  <div className="relative">
                    <select 
                      className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[20px] text-base font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                      value={editingAppointment.status}
                      onChange={e => setEditingAppointment({...editingAppointment, status: e.target.value as AppointmentStatus})}
                    >
                      {Object.values(AppointmentStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Time Row with MaterialTimePicker opening Upwards */}
                <div className="relative" ref={editTimePickerRef}>
                  <div 
                    onClick={() => setShowEditTimePicker(!showEditTimePicker)}
                    className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[20px] text-base font-semibold text-slate-800 flex items-center justify-between cursor-pointer hover:bg-white transition-all group"
                  >
                    <span>{formatTimeDisplay(editingAppointment.startTime)}</span>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      <ChevronDown size={14} className={`text-slate-300 transition-transform ${showEditTimePicker ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {showEditTimePicker && (
                    <MaterialTimePicker 
                      value={editingAppointment.startTime} 
                      onChange={(val) => setEditingAppointment({...editingAppointment, startTime: val})} 
                      onClose={() => setShowEditTimePicker(false)}
                      openUpwards={true}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-10 pt-10">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="text-emerald-600 font-bold uppercase tracking-[0.15em] text-sm hover:text-emerald-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button 
                  type="submit" 
                  className="px-14 py-5 bg-[#10b981] text-white font-bold rounded-full shadow-[0_12px_24px_-66px_rgba(16,185,129,0.4)] hover:bg-[#059669] hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.5)] transition-all uppercase tracking-[0.15em] text-sm"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
