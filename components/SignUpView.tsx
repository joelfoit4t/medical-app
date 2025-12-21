import React, { useState } from 'react';
import { Plus, Mail, Lock, User, ArrowRight, ShieldCheck, Stethoscope, Building2 } from 'lucide-react';

interface Props {
  onSignUp: () => void;
  onSignInClick: () => void;
}

export const SignUpView: React.FC<Props> = ({ onSignUp, onSignInClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    role: 'Doctor', 
    password: '', 
    confirmPassword: '' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignUp();
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[520px] space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-[28px] shadow-2xl shadow-emerald-500/30 flex items-center justify-center text-white relative">
            <Plus size={44} strokeWidth={3} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center border-4 border-[#f8fafc]">
              <ShieldCheck size={14} className="text-emerald-400" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Siloe Med</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">New Professional Registration</p>
          </div>
        </div>

        <div className="bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-slate-100 p-10 lg:p-12 relative group">
          <div className="space-y-2 mb-8 text-center">
            <h2 className="text-2xl font-black text-slate-800">Create Account</h2>
            <p className="text-slate-400 text-sm font-medium">Join the medical network and manage your workflow.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <div className="relative group/input">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="text" required placeholder="Clara Redfield"
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all h-[64px]"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Role</label>
                <div className="relative group/input">
                  <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                  <select 
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all h-[64px] appearance-none"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option>Doctor</option>
                    <option>Nurse</option>
                    <option>Surgeon</option>
                    <option>Administrator</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="email" required placeholder="clara.redfield@medicare.com"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all h-[64px]"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="password" required placeholder="••••••••"
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all h-[64px]"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative group/input">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="password" required placeholder="••••••••"
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all h-[64px]"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button 
                type="submit" disabled={isLoading}
                className="w-full py-6 bg-[#10b981] text-white font-black rounded-3xl shadow-2xl shadow-emerald-500/40 hover:bg-[#059669] hover:translate-y-[-2px] active:translate-y-[0] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm disabled:opacity-70"
              >
                {isLoading ? <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Complete Registration <ArrowRight size={20} strokeWidth={3} /></>}
              </button>
              <div className="text-center pt-2">
                <p className="text-xs font-bold text-slate-400">
                  Already have an account?{' '}
                  <button type="button" onClick={onSignInClick} className="text-emerald-500 font-black hover:text-emerald-600 transition-colors uppercase tracking-widest text-[10px]">Log in</button>
                </p>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="flex items-center gap-2 text-slate-400">
             <Stethoscope size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">Medical Verification</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2025 Siloe Med Systems</span>
        </div>
      </div>
    </div>
  );
};