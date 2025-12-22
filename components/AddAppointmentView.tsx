
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
  X
} from 'lucide-react';
import { Appointment, AppointmentStatus, Language } from '../types';

interface Props {
  language: Language;
  onAddAppointment: (appointment: Appointment) => void;
  onClose: () => void;
}

/**
 * Enhanced Material UI Date Picker Component matching the provided design
 */
const MaterialDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}> = ({ value, onChange, onClose }) => {
  const initialDate = useMemo(() => {
    if (!value) return new Date();
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [value]);

  const [viewDate, setViewDate] = useState(initialDate);
  const selectedDate = value ? initialDate : null;
  
  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();

  const days = useMemo(() => {
    const dCount = daysInMonth(viewDate.getMonth(), viewDate.getFullYear());
    const startDay = startDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
    const prevMonthDays = daysInMonth(viewDate.getMonth() - 1, viewDate.getFullYear());
    
    const arr = [];
    for (let i = startDay - 1; i >= 0; i--) {
      arr.push({ day: prevMonthDays - i, current: false, date: new Date(year, viewDate.getMonth() - 1, prevMonthDays - i) });
    }
    for (let i = 1; i <= dCount; i++) {
      arr.push({ day: i, current: true, date: new Date(year, viewDate.getMonth(), i) });
    }
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
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-[200] w-[300px] p-6 animate-in fade-in zoom-in-95 duration-200 origin-top-left overflow-visible">
      <div className="flex items-center justify-between mb-6 px-1">
        <button type="button" className="text-base font-black text-[#1e293b] flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
          {monthName} {year} <ChevronDown size={16} strokeWidth={3} className="text-slate-400" />
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center mb-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <span key={d} className="text-[11px] font-black text-slate-300 py-1 uppercase">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2">
        {days.map((item, idx) => {
          const isToday = item.date.toDateString() === new Date().toDateString();
          const dateStr = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getDate()).padStart(2, '0')}`;
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

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
        <button 
          type="button" 
          onClick={() => { onChange(''); onClose(); }} 
          className="text-[11px] font-black text-emerald-500 hover:text-emerald-700 transition-colors uppercase tracking-widest"
        >
          Clear
        </button>
        <button 
          type="button" 
          onClick={() => handleDateClick(new Date())} 
          className="text-[11px] font-black text-emerald-500 hover:text-emerald-700 transition-colors uppercase tracking-widest"
        >
          Today
        </button>
      </div>
    </div>
  );
};

/**
 * Custom Material UI Time Picker Component
 */
const MaterialTimePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}> = ({ value, onChange, onClose }) => {
  const parseValue = (val: string) => {
    if (!val) return { hh: '09', mm: '00', period: 'AM' };
    const [hStr, mStr] = val.split(':');
    let h = parseInt(hStr);
    const mm = mStr;
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return { hh: String(h).padStart(2, '0'), mm, period };
  };

  const { hh: selectedH, mm: selectedM, period: selectedP } = parseValue(value);
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const handleSelect = (hh: string, mm: string, p: string) => {
    let h = parseInt(hh);
    if (p === 'PM' && h < 12) h += 12;
    if (p === 'AM' && h === 12) h = 0;
    onChange(`${String(h).padStart(2, '0')}:${mm}`);
  };

  return (
    <div className="absolute top-full right-0 mt-2 bg-white rounded-3xl shadow-xl border border-slate-100 z-[160] w-[180px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div className="grid grid-cols-3 h-[220px]">
        <div className="overflow-y-auto custom-scrollbar border-r border-slate-50 py-2">
          {hours.map(h => <button key={h} type="button" onClick={() => handleSelect(h, selectedM, selectedP)} className={`w-full py-2.5 text-[11px] font-bold ${h === selectedH ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{h}</button>)}
        </div>
        <div className="overflow-y-auto custom-scrollbar border-r border-slate-50 py-2">
          {minutes.map(m => <button key={m} type="button" onClick={() => handleSelect(selectedH, m, selectedP)} className={`w-full py-2.5 text-[11px] font-bold ${m === selectedM ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{m}</button>)}
        </div>
        <div className="py-2">
          {periods.map(p => <button key={p} type="button" onClick={() => handleSelect(selectedH, selectedM, p)} className={`w-full py-2.5 text-[11px] font-bold ${p === selectedP ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{p}</button>)}
        </div>
      </div>
      <div className="p-3 bg-slate-50 flex justify-end border-t border-slate-100">
        <button onClick={onClose} type="button" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-3 py-1">Done</button>
      </div>
    </div>
  );
};

export const AddAppointmentView: React.FC<Props> = ({ onAddAppointment, onClose }) => {
  const [formData, setFormData] = useState({ patientName: '', reason: '', date: '', startTime: '', endTime: '', notes: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const datePickerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) setShowDatePicker(false);
      if (startTimeRef.current && !startTimeRef.current.contains(event.target as Node)) setShowStartTimePicker(false);
      if (endTimeRef.current && !endTimeRef.current.contains(event.target as Node)) setShowEndTimePicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.date || !formData.startTime || !formData.endTime) return;
    const dateObj = new Date(formData.date);
    const day = dateObj.getDay();
    onAddAppointment({ 
      id: `apt-${Date.now()}`, 
      patientName: formData.patientName, 
      reason: formData.reason || 'General Check-up', 
      date: formData.date, 
      startTime: formData.startTime, 
      endTime: formData.endTime, 
      status: AppointmentStatus.Scheduled, 
      dayIndex: day === 0 ? 6 : day - 1 
    });
  };

  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return '--:-- --';
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr);
    const p = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${mStr} ${p}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto py-12">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in slide-in-from-bottom-4 duration-500">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-[40px] z-20">
          <div>
            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight">Schedule Appointment</h2>
            <p className="text-slate-400 mt-0.5 text-sm font-medium">Book a new session in the clinic schedule.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100"><Clock size={22} /></div>
             <div>
                <h3 className="font-bold text-[#1e293b] text-base">Timing & Patient Details</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Appointment parameters</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input type="text" required placeholder="Select patient..." className="w-full pl-12 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm h-[52px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input type="text" placeholder="General Check-up..." className="w-full pl-12 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm h-[52px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2 relative" ref={datePickerRef}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                <div onClick={() => setShowDatePicker(!showDatePicker)} className="w-full px-5 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm h-[52px] font-bold text-slate-700 flex items-center justify-between cursor-pointer hover:bg-white group transition-all">
                  <span className={formData.date ? 'text-slate-700' : 'text-slate-300'}>{formData.date || 'Select date'}</span>
                  <Calendar className="text-slate-300 group-hover:text-emerald-500" size={18} />
                </div>
                {showDatePicker && <MaterialDatePicker value={formData.date} onChange={(val) => setFormData({...formData, date: val})} onClose={() => setShowDatePicker(false)} />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative" ref={startTimeRef}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
                  <div onClick={() => setShowStartTimePicker(!showStartTimePicker)} className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-xs h-[52px] font-bold text-slate-700 flex items-center justify-between cursor-pointer group transition-all">
                    <span>{formatTimeDisplay(formData.startTime)}</span>
                    <ChevronDown className="text-slate-300" size={14} />
                  </div>
                  {showStartTimePicker && <MaterialTimePicker value={formData.startTime} onChange={(val) => setFormData({...formData, startTime: val})} onClose={() => setShowStartTimePicker(false)} />}
                </div>
                <div className="space-y-2 relative" ref={endTimeRef}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
                  <div onClick={() => setShowEndTimePicker(!showEndTimePicker)} className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-xs h-[52px] font-bold text-slate-700 flex items-center justify-between cursor-pointer group transition-all">
                    <span>{formatTimeDisplay(formData.endTime)}</span>
                    <ChevronDown className="text-slate-300" size={14} />
                  </div>
                  {showEndTimePicker && <MaterialTimePicker value={formData.endTime} onChange={(val) => setFormData({...formData, endTime: val})} onClose={() => setShowEndTimePicker(false)} />}
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes</label>
                <textarea rows={3} placeholder="Internal clinical instructions..." className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-[24px] text-sm font-bold text-slate-700 resize-none h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
            </div>

            <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100/50 flex items-start gap-4">
               <div className="text-emerald-500 mt-0.5"><Info size={16} /></div>
               <p className="text-[11px] text-emerald-700/80 font-bold leading-relaxed">System will automatically notify the patient via SMS/Email once confirmed.</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-5">
              <button type="button" onClick={() => onClose()} className="flex-1 py-4 bg-[#f8fafc] text-slate-400 font-black rounded-full hover:bg-slate-100 transition-all uppercase tracking-[0.2em] text-[10px]">Discard</button>
              <button type="submit" className="flex-[2] py-4 bg-[#10b981] text-white font-black rounded-full hover:bg-[#059669] shadow-xl shadow-emerald-200/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[11px]">
                <Check size={16} strokeWidth={4} /> Confirm Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
