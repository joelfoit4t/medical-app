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
  Stethoscope
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
  const [viewType, setViewType] = useState<ViewType>('list');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 22));

  const START_HOUR = 9;
  const PIXELS_PER_HOUR = 160; 

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

  // Logic fix: In 'list' view, we show all appointments. In 'calendar' view, we filter by week.
  const displayAppointments = useMemo(() => {
    if (viewType === 'calendar') {
      const weekDates = getWeekDays.map(wd => wd.fullDate);
      return appointments
        .filter(apt => weekDates.includes(apt.date))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    
    // For List view, show everything sorted by date (newest first)
    return [...appointments].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return a.startTime.localeCompare(b.startTime);
    });
  }, [getWeekDays, appointments, viewType]);

  const totalPages = Math.ceil(displayAppointments.length / itemsPerPage) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayAppointments.slice(start, start + itemsPerPage);
  }, [displayAppointments, currentPage]);

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
    <div className="p-6 h-full flex flex-col relative bg-[#fcfcfc]">
      {/* Toolbar - Material Style */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0">
          <button 
            onClick={() => { setViewType('list'); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewType === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List size={18} /> List
          </button>
          <button 
            onClick={() => { setViewType('calendar'); setCurrentPage(1); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              viewType === 'calendar' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarIcon size={18} /> Calendar
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
          {viewType === 'calendar' && (
            <div className="flex items-center gap-1 order-1 relative">
              <button onClick={() => navigateDate('prev')} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all">
                <ChevronLeft size={20} />
              </button>
              <div className="relative">
                <button onClick={() => setShowDatePicker(!showDatePicker)} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-full text-sm text-slate-700 font-bold transition-colors">
                  {formatDate(currentDate)}
                </button>
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-slate-100 rounded-[28px] shadow-2xl z-50 p-6 min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-3 gap-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                        <button key={m} onClick={() => selectMonth(i)} className={`py-3 text-sm font-bold rounded-2xl transition-all ${currentDate.getMonth() === i ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{m}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => navigateDate('next')} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 order-3 ml-auto xl:ml-0">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 rounded-full text-sm text-slate-700 font-bold hover:bg-slate-200 transition-all">
               <SlidersHorizontal size={18} /> Filter
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col min-h-0">
        {viewType === 'calendar' ? (
          <>
            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100">
              <div className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center bg-white sticky left-0 z-30">GMT +7</div>
              {getWeekDays.map((day) => (
                <div key={day.fullDate} className={`p-5 text-center transition-colors ${day.active ? 'bg-emerald-50/50' : 'bg-white'}`}>
                  <span className={`text-[12px] font-bold block tracking-wider ${day.active ? 'text-emerald-500' : 'text-slate-400'}`}>{day.name} {day.date}</span>
                </div>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 relative custom-scrollbar">
              <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] min-h-[960px] w-full">
                <div className="border-r border-slate-50 bg-white sticky left-0 z-20">
                  {TIME_SLOTS.map((time) => (
                    <div key={time} className="text-[11px] text-slate-400 font-bold p-3 text-center h-[160px] relative">
                      <span className="-top-2 relative bg-white px-2">{time}</span>
                    </div>
                  ))}
                </div>
                {getWeekDays.map((day, dayIdx) => (
                  <div key={day.fullDate} className={`relative border-r border-slate-100 last:border-r-0 min-w-[140px] ${day.active ? 'bg-emerald-50/10' : ''}`}>
                     {TIME_SLOTS.map((_, tIdx) => (<div key={tIdx} className="border-b border-slate-50 h-[160px] w-full"></div>))}
                     {displayAppointments.filter(apt => apt.date === day.fullDate).map(apt => (
                       <div key={apt.id} className="absolute left-3 right-3 z-10 transition-all hover:z-20 hover:scale-[1.02]" style={getPositionStyle(apt.startTime, apt.endTime)}>
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
                    <tr className="border-b border-slate-50 bg-slate-50/20 sticky top-0 bg-white z-10">
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Date</th>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Time</th>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reason</th>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedAppointments.length > 0 ? paginatedAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase border border-white shadow-sm">
                              {apt.patientName.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-800">{apt.patientName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <div className="inline-flex items-center gap-2 text-sm text-slate-500 font-semibold px-3 py-1 bg-slate-50 rounded-full">
                            <CalendarDays size={14} className="text-slate-400" /> {apt.date}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <div className="inline-flex items-center gap-2 text-sm text-slate-500 font-semibold px-3 py-1 bg-slate-50 rounded-full">
                            <Clock3 size={14} className="text-slate-400" /> {apt.startTime}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-600 font-medium">{apt.reason}</td>
                        <td className="px-8 py-5 text-center">{renderStatusBadge(apt.status)}</td>
                        <td className="px-8 py-5 text-right relative">
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === apt.id ? null : apt.id);
                            }}
                            className={`p-2 rounded-full transition-all ${
                              activeMenuId === apt.id 
                                ? 'bg-slate-100 text-emerald-600' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <MoreHorizontal size={20} />
                          </button>
                          
                          {activeMenuId === apt.id && (
                            <div 
                              ref={menuRef}
                              className="absolute right-10 top-14 w-64 bg-white rounded-[28px] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 text-left"
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
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                             <Clock size={40} className="opacity-20 mb-2" />
                             <p className="font-bold text-slate-600 text-lg">No appointments found</p>
                             <p className="text-sm">Newly added appointments appear here immediately.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
             
             <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
                   ><ChevronLeft size={20} /></button>
                   <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            currentPage === p ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                          }`}
                        >{p}</button>
                      ))}
                   </div>
                   <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
                   ><ChevronRight size={20} /></button>
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Showing {paginatedAppointments.length} of {displayAppointments.length} sessions
                </p>
             </div>
          </div>
        )}
      </div>

      {/* Material Design Modal Window */}
      {isEditModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300 relative z-10 text-left">
            <div className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Edit Appointment</h2>
                  <p className="text-sm text-slate-500 font-medium">For {editingAppointment.patientName}</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSaveEdit} className="px-8 py-4 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    required 
                    placeholder="Patient Name"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold text-slate-700" 
                    value={editingAppointment.patientName} 
                    onChange={e => setEditingAppointment({...editingAppointment, patientName: e.target.value})} 
                  />
                  <div className="absolute left-5 -top-2 px-2 bg-white text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Name</div>
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    required 
                    placeholder="Consultation Reason"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold text-slate-700" 
                    value={editingAppointment.reason} 
                    onChange={e => setEditingAppointment({...editingAppointment, reason: e.target.value})} 
                  />
                  <div className="absolute left-5 -top-2 px-2 bg-white text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Reason</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none font-semibold text-slate-700" 
                      value={editingAppointment.status} 
                      onChange={e => setEditingAppointment({...editingAppointment, status: e.target.value as AppointmentStatus})}
                    >
                      {Object.values(AppointmentStatus).map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                    <div className="absolute left-5 -top-2 px-2 bg-white text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Status</div>
                  </div>
                  <div className="relative">
                    <input 
                      type="date" 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold text-slate-700" 
                      value={editingAppointment.date} 
                      onChange={e => setEditingAppointment({...editingAppointment, date: e.target.value})} 
                    />
                    <div className="absolute left-5 -top-2 px-2 bg-white text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Date</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      type="time" 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold text-slate-700" 
                      value={editingAppointment.startTime} 
                      onChange={e => setEditingAppointment({...editingAppointment, startTime: e.target.value})} 
                    />
                    <div className="absolute left-5 -top-2 px-2 bg-white text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Start</div>
                  </div>
                  <div className="relative">
                    <input 
                      type="time" 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold text-slate-700" 
                      value={editingAppointment.endTime} 
                      onChange={e => setEditingAppointment({...editingAppointment, endTime: e.target.value})} 
                    />
                    <div className="absolute left-5 -top-2 px-2 bg-white text-[10px] font-bold text-emerald-600 uppercase tracking-widest">End</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 pb-8">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="flex-1 py-4 text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transition-all text-sm uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all text-sm uppercase tracking-widest active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};