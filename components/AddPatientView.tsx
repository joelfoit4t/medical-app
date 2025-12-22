
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  UserPlus, 
  UserCircle, 
  Save, 
  X, 
  Info, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { PatientStatus, Patient, Language } from '../types';

interface Props {
  language: Language;
  onAddPatient: (patient: Patient) => void;
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
    if (!value || value === 'DD-MM-YYYY') return new Date();
    const parts = value.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      return isNaN(d.getTime()) ? new Date() : d;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [value]);

  const [viewDate, setViewDate] = useState(initialDate);
  const selectedDate = value && value !== 'DD-MM-YYYY' ? initialDate : null;
  
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
    const formatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    onChange(formatted);
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
          const isSelected = selectedDate && item.date.toDateString() === selectedDate.toDateString();
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

export const AddPatientView: React.FC<Props> = ({ onAddPatient, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    diagnosis: '',
    status: PatientStatus.Mild
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
    const newId = Math.floor(Math.random() * 10000).toString();
    onAddPatient({
      id: newId,
      name: formData.name,
      avatar: `https://i.pravatar.cc/150?u=${newId}`,
      lastAppointment: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      age: parseInt(formData.age) || 0,
      dob: formData.dob,
      gender: formData.gender,
      diagnosis: formData.diagnosis,
      status: formData.status
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto py-12">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in slide-in-from-bottom-4 duration-500">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-[40px] z-20">
          <div>
            <h2 className="text-2xl font-black text-[#1e293b] tracking-tight">Register New Patient</h2>
            <p className="text-slate-400 mt-0.5 text-sm font-medium">Onboard a patient into the Siloe Med database.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                <UserCircle size={22} />
             </div>
             <div>
                <h3 className="font-bold text-[#1e293b] text-base">Basic Information</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Required details</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <input 
                  type="text" required placeholder="e.g. Jonathan Doe"
                  className="w-full px-5 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700 h-[52px]"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender Identification</label>
                <div className="flex p-1 bg-[#f8fafc] border border-slate-200 rounded-2xl h-[52px]">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'Male'})}
                    className={`flex-1 rounded-xl text-xs font-bold transition-all ${formData.gender === 'Male' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    Male
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'Female'})}
                    className={`flex-1 rounded-xl text-xs font-bold transition-all ${formData.gender === 'Female' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="space-y-2 relative" ref={datePickerRef}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                <div 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full px-5 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm h-[52px] transition-all font-bold flex items-center justify-between cursor-pointer hover:bg-white group"
                >
                  <span className={formData.dob ? 'text-slate-700' : 'text-slate-300'}>
                    {formData.dob || 'DD-MM-YYYY'}
                  </span>
                  <Calendar size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                {showDatePicker && (
                  <MaterialDatePicker 
                    value={formData.dob} 
                    onChange={(val) => setFormData({...formData, dob: val})} 
                    onClose={() => setShowDatePicker(false)} 
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Age</label>
                <input 
                  type="number" required placeholder="Years"
                  className="w-full px-5 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700 h-[52px]"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Diagnosis</label>
                <textarea 
                  required rows={3} placeholder="Briefly describe the reason for visit..."
                  className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-[24px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none font-bold text-slate-700 placeholder:text-slate-300"
                  value={formData.diagnosis}
                  onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Severity Status</label>
                <div className="relative">
                  <select 
                    className="w-full px-5 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer appearance-none font-bold text-slate-700 h-[52px]"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as PatientStatus})}
                  >
                    {Object.values(PatientStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100/50 flex items-start gap-4">
               <div className="text-emerald-500 mt-0.5 shrink-0 bg-white p-1 rounded-full shadow-sm">
                 <Info size={16} />
               </div>
               <p className="text-[11px] text-emerald-700/80 font-bold leading-relaxed">
                 By clicking register, you confirm HIPAA compliance and clinical data management by Siloe Med.
               </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-5">
              <button 
                type="button"
                onClick={() => setFormData({ name: '', dob: '', age: '', gender: 'Male', diagnosis: '', status: PatientStatus.Mild })}
                className="flex-1 py-4 bg-[#f8fafc] text-slate-400 font-black rounded-full hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-[10px]"
              >
                Reset Form
              </button>
              <button 
                type="submit"
                className="flex-[2] py-4 bg-[#10b981] text-white font-black rounded-full hover:bg-[#059669] shadow-xl shadow-emerald-200/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[11px]"
              >
                <Save size={16} />
                Register & Open Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
