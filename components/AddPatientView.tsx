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
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Register New Patient</h2>
          <p className="text-slate-500 mt-1">Onboard a new patient into the Medicare medical database.</p>
        </div>
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center shadow-sm border border-emerald-100">
          <UserPlus size={32} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
              <UserCircle size={24} />
           </div>
           <div>
              <h3 className="font-bold text-slate-800">Basic Information</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Required details</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Jonathan Doe"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender Identification</label>
              <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-2xl h-14">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'Male'})}
                  className={`flex-1 rounded-xl text-sm font-bold transition-all ${formData.gender === 'Male' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Male
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, gender: 'Female'})}
                  className={`flex-1 rounded-xl text-sm font-bold transition-all ${formData.gender === 'Female' ? 'bg-white text-pink-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Female
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
              <input 
                type="text" 
                required
                placeholder="DD-MM-YYYY"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Age</label>
              <input 
                type="number" 
                required
                placeholder="Years"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Diagnosis / Complaint</label>
              <textarea 
                required
                rows={3}
                placeholder="Describe the medical reason for this visit..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all resize-none"
                value={formData.diagnosis}
                onChange={e => setFormData({...formData, diagnosis: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Severity Status</label>
              <select 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all cursor-pointer appearance-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as PatientStatus})}
              >
                {Object.values(PatientStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex items-start gap-4">
             <div className="text-emerald-500 mt-1"><Info size={18} /></div>
             <p className="text-xs text-emerald-600/80 font-medium leading-relaxed">
               By clicking register, you confirm that the patient has signed the HIPAA disclosure forms and agreed to have their medical data managed by Medicare Systems.
             </p>
          </div>

          <div className="pt-6 flex gap-4">
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
              className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
            >
              Reset Form
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <Save size={20} /> Register & Open Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};