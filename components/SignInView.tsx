import React, { useState } from 'react';
import { Plus, Mail, Lock, ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react';

interface Props {
  onSignIn: () => void;
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
}

export const SignInView: React.FC<Props> = ({ onSignIn, onSignUpClick, onForgotPasswordClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSignIn();
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[480px] space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-[28px] shadow-2xl shadow-emerald-500/30 flex items-center justify-center text-white relative">
            <Plus size={44} strokeWidth={3} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center border-4 border-[#f8fafc]">
              <ShieldCheck size={14} className="text-emerald-400" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Siloe Med</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Healthcare Management Suite</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-slate-100 p-12 lg:p-14 relative group">
          <div className="space-y-2 mb-10">
            <h2 className="text-2xl font-black text-slate-800">Welcome Back</h2>
            <p className="text-slate-400 text-sm font-medium">Please enter your credentials to access the clinic dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Address</label>
                <div className="relative group/input">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required 
                    placeholder="clara.redfield@medicare.com"
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all h-[64px]"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Password</label>
                  <button 
                    type="button" 
                    onClick={onForgotPasswordClick}
                    className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••••••"
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all h-[64px]"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between ml-1">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-slate-200 text-emerald-500 focus:ring-emerald-500 transition-all cursor-pointer" />
                <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer">Remember this session</label>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-6 bg-[#10b981] text-white font-black rounded-3xl shadow-2xl shadow-emerald-500/40 hover:bg-[#059669] hover:translate-y-[-2px] active:translate-y-[0] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm disabled:opacity-70 disabled:translate-y-0"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Enter Dashboard <ArrowRight size={20} strokeWidth={3} />
                  </>
                )}
              </button>
              
              <div className="text-center pt-2">
                <p className="text-xs font-bold text-slate-400">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={onSignUpClick}
                    className="text-emerald-500 font-black hover:text-emerald-600 transition-colors uppercase tracking-widest text-[10px]"
                  >
                    Register now
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="flex items-center gap-2 text-slate-400">
             <Stethoscope size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">On-call Support</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2025 Siloe Med Systems</span>
        </div>
      </div>
    </div>
  );
};