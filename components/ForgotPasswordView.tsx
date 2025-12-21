import React, { useState } from 'react';
import { Plus, Mail, ArrowLeft, ShieldCheck, Stethoscope, RefreshCcw, CheckCircle2 } from 'lucide-react';

interface Props {
  onBackClick: () => void;
}

export const ForgotPasswordView: React.FC<Props> = ({ onBackClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[480px] space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-[28px] shadow-2xl shadow-emerald-500/30 flex items-center justify-center text-white relative">
            <Plus size={44} strokeWidth={3} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center border-4 border-[#f8fafc]">
              <ShieldCheck size={14} className="text-emerald-400" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Siloe Med</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Account Recovery</p>
          </div>
        </div>

        <div className="bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-slate-100 p-12 relative group min-h-[440px] flex flex-col justify-center">
          {!isSent ? (
            <>
              <div className="space-y-3 mb-10 text-center">
                <h2 className="text-2xl font-black text-slate-800">Reset Password</h2>
                <p className="text-slate-400 text-sm font-medium px-4">Enter your work email address and we'll send you recovery instructions.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email Address</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors" size={20} />
                    <input 
                      type="email" required placeholder="clara.redfield@medicare.com"
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all h-[64px]"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <button 
                    type="submit" disabled={isLoading || !email}
                    className="w-full py-6 bg-[#10b981] text-white font-black rounded-3xl shadow-2xl shadow-emerald-500/40 hover:bg-[#059669] hover:translate-y-[-2px] active:translate-y-[0] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm disabled:opacity-70"
                  >
                    {isLoading ? <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Reset Instructions <RefreshCcw size={18} strokeWidth={3} /></>}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={onBackClick}
                    className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 transition-colors py-2 group"
                  >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Login</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
              <div className="space-y-3 px-2">
                <h2 className="text-2xl font-black text-slate-800">Instructions Sent</h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  We have sent a secure password reset link to <span className="text-slate-700 font-bold">{email}</span>. Please check your inbox and follow the steps provided.
                </p>
              </div>
              <button 
                type="button" 
                onClick={onBackClick}
                className="px-10 py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-[0.2em] text-[10px]"
              >
                Return to Login
              </button>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-4">Didn't receive email? Check spam folder.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="flex items-center gap-2 text-slate-400">
             <Stethoscope size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">Recovery Support</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2025 Siloe Med Systems</span>
        </div>
      </div>
    </div>
  );
};