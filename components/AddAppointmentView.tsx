import React, { useState } from 'react';
import { CalendarPlus, Clock, User, FileText, Info, Calendar, Check } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types';

interface Props {
  onAddAppointment: (appointment: Appointment) => void;
  onSuccess: () => void;
}

export const AddAppointmentView: React.FC<Props> = ({ onAddAppointment, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    reason: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

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

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#fcfcfc] min-h-full">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e293b] tracking-tight">Schedule Appointment</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Book a new consultation slot in the clinic schedule.</p>
        </div>
        <button className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100 hover:bg-emerald-100 transition-colors">
          <CalendarPlus size={24} />
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        {/* Section Title */}
        <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
              <Clock size={24} />
           </div>
           <div>
              <h3 className="font-bold text-[#1e293b] text-lg">Timing & Patient Details</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Appointment parameters</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Patient Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Select or enter patient name"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300 font-semibold text-slate-700"
                  value={formData.patientName}
                  onChange={e => setFormData({...formData, patientName: e.target.value})}
                />
              </div>
            </div>
            
            {/* Reason */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Consultation Reason</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. Annual Check-up"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300 font-semibold text-slate-700"
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Appointment Date</label>
              <div className="relative group">
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-semibold text-slate-700"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" size={18} />
              </div>
            </div>

            {/* Time Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                <div className="relative group">
                  <input 
                    type="time" 
                    required
                    className="w-full px-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-semibold text-slate-700"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                <div className="relative group">
                  <input 
                    type="time" 
                    required
                    className="w-full px-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-semibold text-slate-700"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" size={18} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Internal Notes</label>
              <textarea 
                rows={4}
                placeholder="Additional instructions for the doctor..."
                className="w-full px-6 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none placeholder:text-slate-300 font-semibold text-slate-700"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/50 flex items-start gap-4">
             <div className="text-emerald-500 mt-0.5 shrink-0 bg-white p-1 rounded-full shadow-sm border border-emerald-100/30">
               <Info size={16} />
             </div>
             <p className="text-xs text-emerald-700/80 font-semibold leading-relaxed">
               The system will automatically notify the patient via SMS and Email once the appointment is confirmed. Please ensure the patient's contact details are up to date.
             </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button 
              type="button"
              onClick={handleReset}
              className="flex-1 py-4 bg-[#f8fafc] text-slate-400 font-bold rounded-full hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-[0.98] uppercase tracking-widest text-[11px]"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-[#10b981] text-white font-bold rounded-full hover:bg-[#059669] shadow-lg shadow-emerald-200/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={14} strokeWidth={3} />
              </div>
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};