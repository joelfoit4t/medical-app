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
  Calendar as CalendarDropdown,
  Pencil,
  Trash2,
  FileText,
  UserCircle,
  Clock3,
  Stethoscope,
  Plus,
  Search
} from 'lucide-react';
import { TIME_SLOTS } from '../constants';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentStatus, Appointment } from '../types';

type ViewType = 'calendar' | 'list';

interface Props {
  appointments: Appointment[];
  onUpdateAppointment: (apt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onAddAppointment: () => void;
}

export const CalendarView: React.FC<Props> = ({ appointments, onUpdateAppointment, onDeleteAppointment, onAddAppointment }) => {
  const [viewType, setViewType] = useState<ViewType>('list');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
  // Filtering states
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
    if (statusFilter !== 'All') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (viewType === 'calendar') {
      const weekDates = getWeekDays.map(wd => wd.fullDate);
      return filtered
        .filter(apt => weekDates.includes(apt.date))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
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

  const handleEditClick = (e: React.MouseEvent, apt: Appointment) => {
    e.stopPropagation();
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
      case AppointmentStatus.Completed:
        return <span className={`${baseStyles} bg-emerald-50 text-emerald-600`}><Check size={12} /> Completed</span>;
      case AppointmentStatus.Canceled:
        return <span className={`${baseStyles} bg-red-50 text-red-600`}><X size={12} /> Canceled</span>;
      case AppointmentStatus.Waiting:
        return <span className={`${baseStyles} bg-amber-50 text-amber-600`}><User size={12} /> Waiting</span>;
      default:
        return <span className={`${baseStyles} bg-emerald-50 text-emerald-600`}><Clock size={12} /> Scheduled</span>;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col relative bg-[#fcfcfc]">
      {/* Top Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewType('list')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewType === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <List size={18} /> List
          </button>
          <button 
            onClick={() => setViewType('calendar')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewType === 'calendar' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <CalendarIcon size={18} /> Calendar
          </button>
        </div>

        {viewType === 'calendar' && (
          <div className="flex items-center gap-2 relative">
            <button onClick={() => navigateDate('prev')} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"><ChevronLeft size={20} /></button>
            <button onClick={() => setShowDatePicker(!showDatePicker)} className="px-5 py-2 hover:bg-slate-100 rounded-full text-sm text-slate-700 font-bold">{formatDate(currentDate)}</button>
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
                    <div key={time} className="text-[11px] text-slate-400 font-bold p-3 text-center h-[160px] relative border-b border-slate-200">
                      <span className="-top-2 relative bg-white px-2">{time}</span>
                    </div>
                  ))}
                </div>
                {getWeekDays.map((day) => (
                  <div key={day.fullDate} className={`relative border-r border-slate-200 last:border-r-0 min-w-[140px] ${day.active ? 'bg-emerald-50/10' : ''}`}>
                     {TIME_SLOTS.map((_, tIdx) => (<div key={tIdx} className="border-b border-slate-200 h-[160px] w-full"></div>))}
                     {displayAppointments.filter(apt => apt.date === day.fullDate).map(apt => (
                       <div key={apt.id} className="absolute left-3 right-3 z-10 transition-all" style={{ top: `${(parseInt(apt.startTime.split(':')[0]) - START_HOUR + parseInt(apt.startTime.split(':')[1])/60) * PIXELS_PER_HOUR}px`, height: '148px' }}>
                         <AppointmentCard appointment={apt} />
                       </div>
                     ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
             {/* List Top Bar */}
             <div className="px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative" ref={filterMenuRef}>
                    <button 
                      onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 transition-all ${isFilterMenuOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      <SlidersHorizontal size={20} />
                    </button>
                    {isFilterMenuOpen && (
                      <div className="absolute left-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-slate-200 mb-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter status</p>
                        </div>
                        {[
                          { label: 'All Appointments', value: 'All', icon: CalendarDays, color: 'text-slate-400' },
                          { label: 'Scheduled', value: AppointmentStatus.Scheduled, icon: Clock, color: 'text-emerald-500' },
                          { label: 'Completed', value: AppointmentStatus.Completed, icon: Check, color: 'text-emerald-600' },
                          { label: 'Waiting', value: AppointmentStatus.Waiting, icon: User, color: 'text-amber-500' },
                          { label: 'Canceled', value: AppointmentStatus.Canceled, icon: X, color: 'text-red-500' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setStatusFilter(option.value as any);
                              setIsFilterMenuOpen(false);
                              setCurrentPage(1);
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <option.icon size={16} className={option.color} />
                              {option.label}
                            </div>
                            {statusFilter === option.value && <Check size={14} className="text-emerald-500" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={onAddAppointment}
                  className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"
                >
                  <Plus size={18} /> Add appointment
                </button>
             </div>

             <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-y border-slate-200 bg-slate-50/30">
                      <th className="px-8 py-4 w-10 border-r border-slate-200"><input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" /></th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">ID</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Patient Name</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Date</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Time</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Appointed doctor</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Reason</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Status</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedAppointments.length > 0 ? paginatedAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-5 border-r border-slate-200"><input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" /></td>
                        <td className="px-8 py-5 text-sm font-medium text-slate-500 border-r border-slate-200 text-center">{apt.id.split('-').pop()?.substring(0, 4)}</td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-800 border-r border-slate-200">{apt.patientName}</td>
                        <td className="px-8 py-5 text-sm text-slate-500 border-r border-slate-200 text-center">{apt.date}</td>
                        <td className="px-8 py-5 text-sm text-slate-500 border-r border-slate-200 text-center">{apt.startTime}</td>
                        <td className="px-8 py-5 border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <img src={`https://i.pravatar.cc/150?u=dr-${apt.id}`} className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" />
                            <span className="text-sm font-medium text-slate-700">Dr. Lily Cooper</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-600 font-medium border-r border-slate-200">{apt.reason}</td>
                        <td className="px-8 py-5 text-center border-r border-slate-200">{renderStatusBadge(apt.status)}</td>
                        <td className="px-8 py-5 text-right relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === apt.id ? null : apt.id); }}
                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <MoreHorizontal size={20} />
                          </button>
                          {activeMenuId === apt.id && (
                            <div ref={menuRef} className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1">
                               <button onClick={(e) => handleEditClick(e, apt)} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><Pencil size={14} /> Edit</button>
                               <button onClick={(e) => handleDeleteClick(e, apt.id)} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /> Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={9} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-3 text-slate-400">
                            <CalendarDays size={48} strokeWidth={1} />
                            <p className="text-lg font-bold text-slate-600">No appointments found</p>
                            <p className="text-sm">Try changing your status filter.</p>
                            <button 
                              onClick={() => { setStatusFilter('All'); }}
                              className="mt-2 text-emerald-600 font-bold text-sm hover:underline"
                            >
                              Reset filter
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>

             <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-12">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
                    Showing {paginatedAppointments.length} of {displayAppointments.length} sessions
                  </span>
                  <div className="flex items-center gap-3">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button 
                        key={p} 
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                          p === currentPage 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1} 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 transition-all ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-500'}`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages} 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 transition-all ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-500'}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Edit Modal (Material Design 3 style) */}
      {isEditModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in slide-in-from-bottom-4 relative z-10 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Edit Appointment</h2>
            <form onSubmit={handleSaveEdit} className="space-y-6">
              <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" value={editingAppointment.patientName} onChange={e => setEditingAppointment({...editingAppointment, patientName: e.target.value})} placeholder="Patient Name" />
              <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold" value={editingAppointment.reason} onChange={e => setEditingAppointment({...editingAppointment, reason: e.target.value})} placeholder="Reason" />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-emerald-600 font-bold uppercase tracking-widest text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-full shadow-lg shadow-emerald-200 uppercase tracking-widest text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};