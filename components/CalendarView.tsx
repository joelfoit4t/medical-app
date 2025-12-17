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
  UserCircle
} from 'lucide-react';
import { TIME_SLOTS } from '../constants';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentStatus, Appointment } from '../types';

type ViewType = 'calendar' | 'list';

interface Props {
  appointments: Appointment[];
  onUpdateAppointment: (apt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}

export const CalendarView: React.FC<Props> = ({ appointments, onUpdateAppointment, onDeleteAppointment }) => {
  const [viewType, setViewType] = useState<ViewType>('list'); // Default to list view as requested
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Dropdown / Modal States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  
  // State for current viewing date (Defaults to April 22, 2025)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 22));

  const START_HOUR = 9;
  const PIXELS_PER_HOUR = 160; 

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
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

  const filteredAppointments = useMemo(() => {
    const weekDates = getWeekDays.map(wd => wd.fullDate);
    return appointments
      .filter(apt => weekDates.includes(apt.date))
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      });
  }, [getWeekDays, appointments]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
    setCurrentPage(1);
  };

  const selectMonth = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    if (monthIndex === 3) newDate.setDate(22);
    setCurrentDate(newDate);
    setShowDatePicker(false);
    setCurrentPage(1);
  };

  const getPositionStyle = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startOffset = (startH - START_HOUR) + (startM / 60);
    const duration = (endH - startH) + ((endM - startM) / 60);
    return {
      top: `${startOffset * PIXELS_PER_HOUR}px`,
      height: `${duration * PIXELS_PER_HOUR - 12}px`, 
    };
  };

  const handleEditClick = (e: React.MouseEvent, apt: Appointment) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingAppointment({ ...apt });
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
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
    let baseStyles = "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all";
    switch (status) {
      case AppointmentStatus.Completed:
        return <span className={`${baseStyles} bg-emerald-50 text-emerald-600`}><Check size={14} /> Completed</span>;
      case AppointmentStatus.Canceled:
        return <span className={`${baseStyles} bg-red-50 text-red-600`}><X size={14} /> Canceled</span>;
      case AppointmentStatus.Waiting:
        return <span className={`${baseStyles} bg-amber-50 text-amber-600`}><User size={14} /> Waiting</span>;
      default:
        return <span className={`${baseStyles} bg-emerald-50 text-emerald-600`}><Clock size={14} /> Scheduled</span>;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col relative bg-slate-50">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div className="flex bg-slate-200/50 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setViewType('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewType === 'list' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List size={16} /> List
          </button>
          <button 
            onClick={() => setViewType('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewType === 'calendar' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarIcon size={16} /> Calendar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
          <div className="flex items-center gap-2 order-1 relative">
            <button onClick={() => navigateDate('prev')} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 bg-white shadow-sm transition-all active:scale-95">
              <ChevronLeft size={18} />
            </button>
            <div className="relative">
              <button onClick={() => setShowDatePicker(!showDatePicker)} className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-700 font-bold whitespace-nowrap hover:border-emerald-300 transition-colors">
                {formatDate(currentDate)}
              </button>
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <CalendarDropdown size={14} /> Select Month
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                      <button key={m} onClick={() => selectMonth(i)} className={`py-2 text-xs font-bold rounded-lg transition-all ${currentDate.getMonth() === i ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{m}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => navigateDate('next')} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 bg-white shadow-sm transition-all active:scale-95">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 order-3 ml-auto xl:ml-0">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 font-bold hover:bg-slate-50 shadow-sm transition-all">
               <SlidersHorizontal size={16} /> Filter
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col min-h-0">
        {viewType === 'calendar' ? (
          <>
            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200">
              <div className="p-4 text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center border-r border-slate-100 shrink-0 bg-white sticky left-0 z-30">GMT +7</div>
              {getWeekDays.map((day) => (
                <div key={day.fullDate} className={`p-4 text-center border-r border-slate-100 last:border-r-0 min-w-[140px] transition-colors ${day.active ? 'bg-emerald-50' : 'bg-white'}`}>
                  <span className={`text-[11px] font-bold block ${day.active ? 'text-emerald-500' : 'text-slate-400'}`}>{day.name} {day.date}</span>
                </div>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 relative custom-scrollbar">
              <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] min-h-[960px] w-full">
                <div className="border-r border-slate-100 bg-white sticky left-0 z-20">
                  {TIME_SLOTS.map((time) => (
                    <div key={time} className="text-[11px] text-slate-400 font-bold p-3 text-center h-[160px] relative">
                      <span className="-top-2 relative bg-white px-2">{time}</span>
                    </div>
                  ))}
                </div>
                {getWeekDays.map((day, dayIdx) => (
                  <div key={day.fullDate} className={`relative border-r border-slate-100 last:border-r-0 min-w-[140px] ${day.active ? 'bg-emerald-50/10' : ''}`}>
                     {TIME_SLOTS.map((_, tIdx) => (<div key={tIdx} className="border-b border-slate-50 h-[160px] w-full"></div>))}
                     {filteredAppointments.filter(apt => apt.date === day.fullDate).map(apt => (
                       <div key={apt.id} className="absolute left-2 right-2 z-10 transition-all hover:z-20 hover:scale-[1.02]" style={getPositionStyle(apt.startTime, apt.endTime)}>
                         <AppointmentCard appointment={apt} />
                       </div>
                     ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
             <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30 sticky top-0 bg-white z-10">
                      <th className="px-6 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Date</th>
                      <th className="px-6 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Time</th>
                      <th className="px-6 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Reason</th>
                      <th className="px-6 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 font-bold text-xs border border-emerald-100 uppercase">
                              {apt.patientName.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-800">{apt.patientName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                            <CalendarDays size={14} className="text-slate-300" /> {apt.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                            <Clock size={14} className="text-slate-300" /> {apt.startTime} - {apt.endTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">{apt.reason}</td>
                        <td className="px-6 py-4 text-center">{renderStatusBadge(apt.status)}</td>
                        <td className="px-6 py-4 text-right relative">
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === apt.id ? null : apt.id);
                            }}
                            className={`p-2 rounded-xl border-2 transition-all ${
                              activeMenuId === apt.id 
                                ? 'border-emerald-500 bg-white text-emerald-500 shadow-md scale-105' 
                                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <MoreHorizontal size={20} />
                          </button>
                          
                          {activeMenuId === apt.id && (
                            <div 
                              ref={menuRef}
                              className="absolute right-10 top-14 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-left"
                            >
                              <div className="py-2">
                                <button 
                                  onClick={(e) => handleEditClick(e, apt)} 
                                  className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Pencil size={20} className="text-emerald-500" /> Edit Appointment
                                </button>
                                <div className="h-px bg-slate-50 mx-6" />
                                <button 
                                  onClick={(e) => handleDeleteClick(e, apt.id)} 
                                  className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={20} className="text-red-500" /> Remove APPT
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
             
             <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl border transition-all ${currentPage === 1 ? 'text-slate-200 border-transparent cursor-not-allowed' : 'text-slate-500 border-slate-200 hover:bg-white hover:shadow-sm'}`}
                   ><ChevronLeft size={20} /></button>
                   <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all border-2 ${
                            currentPage === p ? 'border-emerald-500 text-emerald-600 bg-white shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50'
                          }`}
                        >{p}</button>
                      ))}
                   </div>
                   <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl border transition-all ${currentPage === totalPages ? 'text-slate-200 border-transparent cursor-not-allowed' : 'text-slate-500 border-slate-200 hover:bg-white hover:shadow-sm'}`}
                   ><ChevronRight size={20} /></button>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Showing {Math.min(filteredAppointments.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filteredAppointments.length, currentPage * itemsPerPage)} of {filteredAppointments.length} sessions
                </p>
             </div>
          </div>
        )}
      </div>

      {isEditModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 relative z-10 text-left">
            <div className="bg-[#0b7a5a] px-10 py-12 text-white relative">
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X size={20} /></button>
              <div className="w-16 h-16 bg-white/20 rounded-[1.25rem] flex items-center justify-center mb-6 shadow-inner"><CalendarIcon size={32} /></div>
              <h2 className="text-3xl font-bold tracking-tight">Edit Appointment</h2>
              <p className="text-emerald-100/80 text-sm mt-2 font-medium">Update session details for <span className="font-bold underline decoration-emerald-300 decoration-2 underline-offset-4">{editingAppointment.patientName}</span></p>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-10 space-y-8 bg-white">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Patient Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter patient name"
                    className="w-full pl-14 pr-6 py-5 bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-semibold text-slate-700 placeholder:text-slate-300" 
                    value={editingAppointment.patientName} 
                    onChange={e => setEditingAppointment({...editingAppointment, patientName: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Consultation Reason</label>
                <div className="relative">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Annual Check-up"
                    className="w-full pl-14 pr-6 py-5 bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-semibold text-slate-700 placeholder:text-slate-300" 
                    value={editingAppointment.reason} 
                    onChange={e => setEditingAppointment({...editingAppointment, reason: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                  <div className="relative">
                    <select 
                      className="w-full px-6 py-5 bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all cursor-pointer appearance-none font-semibold text-slate-700" 
                      value={editingAppointment.status} 
                      onChange={e => setEditingAppointment({...editingAppointment, status: e.target.value as AppointmentStatus})}
                    >
                      {Object.values(AppointmentStatus).map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"><MoreHorizontal size={18} /></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required 
                      className="w-full px-6 py-5 bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-semibold text-slate-700 appearance-none" 
                      value={editingAppointment.date} 
                      onChange={e => {
                        const dateObj = new Date(e.target.value);
                        const day = dateObj.getDay();
                        const dayIndex = day === 0 ? 6 : day - 1;
                        setEditingAppointment({...editingAppointment, date: e.target.value, dayIndex});
                      }} 
                    />
                    <CalendarDropdown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300" size={18} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Time</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      required 
                      className="w-full px-6 py-5 bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-semibold text-slate-700" 
                      value={editingAppointment.startTime} 
                      onChange={e => setEditingAppointment({...editingAppointment, startTime: e.target.value})} 
                    />
                    <Clock className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300" size={18} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Time</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      required 
                      className="w-full px-6 py-5 bg-[#f8fafc] border border-slate-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-semibold text-slate-700" 
                      value={editingAppointment.endTime} 
                      onChange={e => setEditingAppointment({...editingAppointment, endTime: e.target.value})} 
                    />
                    <Clock className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="flex-1 py-5 bg-[#f1f5f9] text-[#64748b] font-bold rounded-[1.5rem] hover:bg-slate-200 transition-all text-sm uppercase tracking-widest shadow-sm active:scale-95"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-5 bg-[#10b981] text-white font-bold rounded-[1.5rem] hover:bg-[#059669] shadow-lg shadow-emerald-200/50 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest active:scale-95"
                >
                  <FileText size={20} strokeWidth={2.5} /> Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};