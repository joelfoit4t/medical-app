import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  CalendarPlus, 
  Clock, 
  User, 
  FileText, 
  Info, 
  Calendar, 
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types';

interface Props {
  onAddAppointment: (appointment: Appointment) => void;
  onSuccess: () => void;
}

/**
 * Material UI Inspired Date Picker Component
 */
const MaterialDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}> = ({ value, onChange, onClose }) => {
  // Use a default starting date (today) for appointment if no value provided
  const initialDate = useMemo(() => {
    if (!value) return new Date();
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [value]);

  const [viewDate, setViewDate] = useState(initialDate);
  
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
  }, [viewDate, year]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const handleDateClick = (date: Date) => {
    // We store date as YYYY-MM-DD for the form processing
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 z-[150] w-[300px] p-6 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
      <div className="flex items-center justify-between mb-4 px-1">
        <button type="button" className="text-sm font-black text-[#1e293b] uppercase tracking-wider">
          {monthName} {year}
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center mb-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <span key={d} className="text-[10px] font-black text-slate-300 py-1 uppercase tracking-tighter">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1.5">
        {days.map((item, idx) => {
          const isToday = item.date.toDateString() === new Date().toDateString();
          const y = item.date.getFullYear();
          const m = String(item.date.getMonth() + 1).padStart(2, '0');
          const d = String(item.date.getDate()).padStart(2, '0');
          const dateStr = `${y}-${m}-${d}`;
          const isSelected = value === dateStr;
          
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDateClick(item.date)}
              className={`
                h-9 w-9 rounded-full text-[12px] font-bold transition-all mx-auto flex items-center justify-center
                ${!item.current ? 'text-slate-200' : isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'}
                ${isToday && !isSelected ? 'text-emerald-500 border border-emerald-100' : ''}
              `}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const AddAppointmentView: React.FC<Props> = ({ onAddAppointment, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    reason: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.date || !formData.startTime || !formData.endTime) {
      return;
    }

    const dateObj = new Date(formData.date);
    const day = dateObj.getDay();
    const dayIndex = day === 0 ? 6 : day - 1;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      patientName: formData.patientName,
      reason: formData.reason || 'General Check-up',
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: AppointmentStatus.Scheduled,
      dayIndex: dayIndex
    };

    onAddAppointment(newAppointment);
    onSuccess();
  };

  const handleReset = () => {
    setFormData({
      patientName: '',
      reason: '',
      date: '',
      startTime: '',
      endTime: '',
      notes: ''
    });
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#fcfcfc] min-h-full">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e293b] tracking-tight">Schedule Appointment</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Book a new consultation slot in the clinic schedule.</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
          <CalendarPlus size={24} />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        {/* Section Title */}
        <div className="p-8 lg:p-10 border-b border-slate-100 flex items-center gap-5">
           <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
              <Clock size={28} />
           </div>
           <div>
              <h3 className="font-bold text-[#1e293b] text-xl">Timing & Patient Details</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Appointment parameters</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {/* Patient Name */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  placeholder="Select or enter patient name"
                  className="w-full pl-14 pr-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300 font-bold text-slate-700 h-[56px]"
                  value={formData.patientName}
                  onChange={e => setFormData({...formData, patientName: e.target.value})}
                />
              </div>
            </div>
            
            {/* Reason */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Consultation Reason</label>
              <div className="relative group">
                <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="e.g. Annual Check-up"
                  className="w-full pl-14 pr-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300 font-bold text-slate-700 h-[56px]"
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                />
              </div>
            </div>

            {/* Date Picker Trigger */}
            <div className="space-y-2.5 relative" ref={datePickerRef}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Appointment Date</label>
              <div 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none h-[56px] transition-all font-bold text-slate-700 flex items-center justify-between cursor-pointer hover:bg-white group"
              >
                <span className={formData.date ? 'text-slate-700' : 'text-slate-300'}>
                  {formData.date ? formatDateDisplay(formData.date) : 'Select appointment date'}
                </span>
                <Calendar className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
              </div>
              {showDatePicker && (
                <MaterialDatePicker 
                  value={formData.date} 
                  onChange={(val) => setFormData({...formData, date: val})} 
                  onClose={() => setShowDatePicker(false)} 
                />
              )}
            </div>

            {/* Time Selectors */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                <div className="relative group">
                  <input 
                    type="time" 
                    required
                    className="w-full pl-5 pr-12 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none font-bold text-slate-700 h-[56px]"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                  <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" size={20} />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                <div className="relative group">
                  <input 
                    type="time" 
                    required
                    className="w-full pl-5 pr-12 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none font-bold text-slate-700 h-[56px]"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                  <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" size={20} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Internal Notes</label>
              <textarea 
                rows={5}
                placeholder="Additional instructions for the doctor..."
                className="w-full px-6 py-5 bg-[#f8fafc] border border-slate-200 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none placeholder:text-slate-300 font-bold text-slate-700"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-emerald-50/40 p-5 rounded-3xl border border-emerald-100/50 flex items-start gap-4">
             <div className="text-emerald-500 mt-1 shrink-0 bg-white p-1 rounded-full shadow-sm border border-emerald-100/30">
               <Info size={18} />
             </div>
             <p className="text-[13px] text-emerald-700/80 font-bold leading-relaxed">
               The system will automatically notify the patient via SMS and Email once the appointment is confirmed. Please ensure the patient's contact details are up to date.
             </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-6">
            <button 
              type="button"
              onClick={handleReset}
              className="flex-1 py-5 bg-[#f8fafc] text-slate-400 font-black rounded-full hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-[11px]"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-[2] py-5 bg-[#10b981] text-white font-black rounded-full hover:bg-[#059669] shadow-xl shadow-emerald-200/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[12px]"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={16} strokeWidth={4} />
              </div>
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};