import React, { useState } from 'react';
import { CalendarPlus, Clock, User, FileText, CheckCircle2, Info, Calendar, X, Check } from 'lucide-react';
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
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#f8fafb] min-h-full">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold text-[#1e293b] tracking-tight">Schedule Appointment</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">Book a new consultation slot in the clinic schedule.</p>
        </div>
        <button className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100 hover:bg-emerald-100 transition-colors">
          <CalendarPlus size={28} />
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        {/* Section Title */}
        <div className="p-10 border-b border-slate-50 flex items-center gap-6">
           <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
              <Clock size={28} />
           </div>
           <div>
              <h3 className="font-bold text-[#1e293b] text-xl">Timing & Patient Details</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Appointment parameters</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 lg:p-14 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {/* Patient Name */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  placeholder="Select or enter patient name"
                  className="w-full pl-14 pr-6 py-5 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300 font-semibold text-slate-700 shadow-sm"
                  value={formData.patientName}
                  onChange={e => setFormData({...formData, patientName: e.target.value})}
                />
              </div>
            </div>
            
            {/* Reason */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Consultation Reason</label>
              <div className="relative group">
                <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="e.g. Annual Check-up"
                  className="w-full pl-14 pr-6 py-5 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300 font-semibold text-slate-700 shadow-sm"
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Appointment Date</label>
              <div className="relative group">
                <input 
                  type="date" 
                  required
                  className="w-full px-6 py-5 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-semibold text-slate-700 shadow-sm"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
                <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" size={20} />
              </div>
            </div>

            {/* Time Selectors */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                <div className="relative group">
                  <input 
                    type="time" 
                    required
                    className="w-full px-6 py-5 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-semibold text-slate-700 shadow-sm"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                  <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" size={20} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                <div className="relative group">
                  <input 
                    type="time" 
                    required
                    className="w-full px-6 py-5 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-semibold text-slate-700 shadow-sm"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                  <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" size={20} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Internal Notes</label>
              <textarea 
                rows={5}
                placeholder="Additional instructions for the doctor..."
                className="w-full px-8 py-6 bg-[#f8fafc] border border-slate-200 rounded-[28px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none placeholder:text-slate-300 font-semibold text-slate-700 shadow-sm"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-emerald-50/40 p-6 rounded-[24px] border border-emerald-100/50 flex items-start gap-4">
             <div className="text-emerald-500 mt-1 shrink-0 bg-white p-1 rounded-full shadow-sm border border-emerald-100/30">
               <Info size={18} />
             </div>
             <p className="text-sm text-emerald-700/80 font-semibold leading-relaxed">
               The system will automatically notify the patient via SMS and Email once the appointment is confirmed. Please ensure the patient's contact details are up to date.
             </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-6">
            <button 
              type="button"
              onClick={handleReset}
              className="flex-1 py-5 bg-[#f8fafc] text-slate-400 font-bold rounded-full hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-[2] py-5 bg-[#10b981] text-white font-bold rounded-full hover:bg-[#059669] shadow-xl shadow-emerald-200/50 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={16} strokeWidth={3} />
              </div>
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};