import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  User, 
  Settings, 
  LogOut,
  Globe
} from 'lucide-react';
import { NavItem, Language } from '../types';
import { useTranslation } from '../i18n/translations';

interface Props {
  activeNav: NavItem;
  onMenuClick: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
}

export const Header: React.FC<Props> = ({ activeNav, onMenuClick, language, onLanguageChange, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const t = useTranslation(language);

  const getTranslated = (label: string) => {
    const key = label.toLowerCase().replace(/ /g, '') as any;
    return t(key);
  };

  const subtitle = activeNav.includes('Patient')
    ? t('subtitlepatient') 
    : t('subtitlegeneral');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: t('myprofile'), description: 'View and edit profile' },
    { icon: Settings, label: t('accountsettings'), description: 'Preferences & Security' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-50 transition-all">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800">{getTranslated(activeNav)}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all group"
          >
            <Globe size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
            <span className="text-xs font-bold text-slate-700">{language}</span>
            <ChevronDown size={14} className={`text-slate-300 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[110]">
              <div className="p-1">
                {(['EN', 'FR'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLanguageChange(lang);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      language === lang 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {lang === 'EN' ? 'English' : 'Français'}
                    {language === lang && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t('searchplaceholder')}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 w-32 lg:w-48 transition-all"
          />
        </div>

        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 relative shrink-0 group">
          <Bell size={18} className="group-hover:text-emerald-500 transition-colors" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 sm:border-l border-slate-200 cursor-pointer group"
          >
            <img 
              src="https://picsum.photos/id/64/100/100" 
              alt="Dr. Clara" 
              className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-emerald-500 transition-all shrink-0"
            />
            <div className="hidden md:block text-right select-none">
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Dr. Clara Redfield</h4>
              <p className="text-[10px] text-slate-500 font-medium">clara.redfield@gmail.com</p>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-slate-400 group-hover:text-emerald-500 transition-all duration-300 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} 
            />
          </div>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
              <div className="px-6 py-5 bg-slate-50/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('signedinas')}</p>
                <p className="text-sm font-bold text-slate-900">Dr. Clara Redfield</p>
                <p className="text-xs text-emerald-500 font-bold mt-0.5">{t('adminaccess')}</p>
              </div>

              <div className="p-2 space-y-0.5">
                {menuItems.map((item, idx) => (
                  <button 
                    key={idx}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-emerald-50 transition-all group text-left"
                  >
                    <div className="w-10 h-10 bg-slate-100/50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-emerald-500 transition-colors shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 leading-tight">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{item.description}</p>
                    </div>
                  </button>
                ))}
                
                <div className="h-px bg-slate-100 mx-4 my-1" />
                
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-50 transition-all group text-left"
                >
                  <div className="w-10 h-10 bg-slate-100/50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-red-500 transition-colors shrink-0">
                    <LogOut size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-red-700 leading-tight">{t('logout')}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">End session safely</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};