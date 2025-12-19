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
import { PatientStatus, Patient } from '../types';

interface Props {
  onAddPatient: (patient: Patient) => void;
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
  // Use a default starting date (e.g., 1995) for DOB if no value provided
  const initialDate = useMemo(() => {
    if (!value) return new Date(1995, 0, 1);
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date(1995, 0, 1) : d;
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

  const changeYear = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear() + offset, viewDate.getMonth(), 1));
  };

  const handleDateClick = (date: Date) => {
    const formatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    onChange(formatted);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 z-[150] w-[300px] p-6 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
      <div className="flex items-center justify-between mb-2 px-1">
        <button type="button" className="text-sm font-black text-[#1e293b] uppercase tracking-wider">
          {monthName}
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

      <div className="flex items-center justify-between mb-6 px-1 border-b border-slate-50 pb-2">
        <button type="button" className="text-xs font-black text-emerald-500 uppercase tracking-widest">
          {year}
        </button>
        <div className="flex gap-1">
          <button type="button" onClick={() => changeYear(-1)} className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-300">
            <ChevronDown size={14} className="rotate-90" />
          </button>
          <button type="button" onClick={() => changeYear(1)} className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-300">
            <ChevronDown size={14} className="-rotate-90" />
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
          const isSelected = value === item.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
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

export const AddPatientView: React.FC<Props> = ({ onAddPatient, onSuccess }) => {
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
    const newPatient: Patient = {
      id: newId,
      name: formData.name,
      avatar: `https://i.pravatar.cc/150?u=${newId}`,
      lastAppointment: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      age: parseInt(formData.age) || 0,
      dob: formData.dob,
      gender: formData.gender,
      diagnosis: formData.diagnosis,
      status: formData.status
    };

    onAddPatient(newPatient);
    onSuccess();
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#fcfcfc] min-h-full">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e293b] tracking-tight">Register New Patient</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Onboard a new patient into the Siloe Med medical database.</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
          <UserPlus size={24} />
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="bg-slate-50/30 p-6 border-b border-slate-100 flex items-center gap-4">
           <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
              <UserCircle size={22} />
           </div>
           <div>
              <h3 className="font-bold text-[#1e293b] text-base">Basic Information</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Required details</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Jonathan Doe"
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all placeholder:text-slate-300 font-semibold text-slate-700"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            {/* Gender Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender Identification</label>
              <div className="flex p-1 bg-[#f8fafc] border border-slate-200 rounded-xl h-[46px]">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'Male'})}
                  className={`flex-1 rounded-lg text-sm font-bold transition-all ${formData.gender === 'Male' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-500'}`}
                >
                  Male
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'Female'})}
                  className={`flex-1 rounded-lg text-sm font-bold transition-all ${formData.gender === 'Female' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-500'}`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* DOB with Date Picker */}
            <div className="space-y-1.5 relative" ref={datePickerRef}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
              <div 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all font-semibold flex items-center justify-between cursor-pointer hover:bg-white group"
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

            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Age</label>
              <input 
                type="number" 
                required
                placeholder="Years"
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>

            {/* Diagnosis */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Diagnosis / Complaint</label>
              <textarea 
                required
                rows={3}
                placeholder="Describe the medical reason for this visit..."
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all resize-none font-semibold text-slate-700 placeholder:text-slate-300"
                value={formData.diagnosis}
                onChange={e => setFormData({...formData, diagnosis: e.target.value})}
              />
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Severity Status</label>
              <select 
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all cursor-pointer appearance-none font-semibold text-slate-700"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as PatientStatus})}
              >
                {Object.values(PatientStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/50 flex items-start gap-4">
             <div className="text-emerald-500 mt-0.5 shrink-0 bg-white p-1 rounded-full shadow-sm border border-emerald-100/30">
               <Info size={16} />
             </div>
             <p className="text-xs text-emerald-700/80 font-semibold leading-relaxed">
               By clicking register, you confirm that the patient has signed the HIPAA disclosure forms and agreed to have their medical data managed by Siloe Med Systems.
             </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button 
              type="button"
              onClick={() => setFormData({
                name: '',
                dob: '',
                age: '',
                gender: 'Male',
                diagnosis: '',
                status: PatientStatus.Mild
              })}
              className="flex-1 py-3.5 bg-[#f8fafc] text-slate-400 font-bold rounded-full hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-[0.98] uppercase tracking-widest text-[11px]"
            >
              Reset Form
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3.5 bg-[#10b981] text-white font-bold rounded-full hover:bg-[#059669] shadow-lg shadow-emerald-200/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
            >
              <Save size={18} /> Register & Open Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};