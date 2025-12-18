import React, { useState } from 'react';
import { UserPlus, UserCircle, Save, X, Info } from 'lucide-react';
import { PatientStatus, Patient } from '../types';

interface Props {
  onAddPatient: (patient: Patient) => void;
  onSuccess: () => void;
}

export const AddPatientView: React.FC<Props> = ({ onAddPatient, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    diagnosis: '',
    status: PatientStatus.Mild
  });

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
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300 font-semibold text-slate-700"
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

            {/* DOB */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
              <input 
                type="text" 
                required
                placeholder="DD-MM-YYYY"
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
              />
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Age</label>
              <input 
                type="number" 
                required
                placeholder="Years"
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-slate-700 placeholder:text-slate-300"
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
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none font-semibold text-slate-700 placeholder:text-slate-300"
                value={formData.diagnosis}
                onChange={e => setFormData({...formData, diagnosis: e.target.value})}
              />
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Severity Status</label>
              <select 
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer appearance-none font-semibold text-slate-700"
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