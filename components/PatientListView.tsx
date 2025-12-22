
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  RefreshCcw, 
  AlertCircle, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  UserCircle,
  Check,
  Calendar,
  ChevronUp,
  Info
} from 'lucide-react';
import { StatCard } from './StatCard';
import { PatientStatus, Patient, Language } from '../types';

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  onViewProfile: (id: string) => void;
  onAddPatient: () => void;
  // Added language prop to fix the type error in App.tsx
  language: Language;
}

/**
 * Material UI Inspired Date Picker Component (Internal)
 */
const MaterialDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}> = ({ value, onChange, onClose }) => {
  const initialDate = useMemo(() => {
    if (!value || value === 'DD-MM-YYYY') return new Date();
    // Support both DD-MM-YYYY and textual formats
    const parts = value.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      return isNaN(d.getTime()) ? new Date() : d;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
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
    <div className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 z-[150] w-[300px] p-6 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
      <div className="flex items-center justify-between mb-4 px-1">
        <button type="button" className="text-sm font-black text-[#1e293b] uppercase tracking-wider">
          {monthName} {year}
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

export const PatientListView: React.FC<Props> = ({ patients, setPatients, onViewProfile, onAddPatient, language }) => {
  const [filter, setFilter] = useState<'All' | PatientStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Edit state
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const menuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const editDatePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
      if (editDatePickerRef.current && !editDatePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAllOnPage = (ids: string[]) => {
    const newSelected = new Set(selectedIds);
    const allSelected = ids.every(id => newSelected.has(id));
    if (allSelected) {
      ids.forEach(id => newSelected.delete(id));
    } else {
      ids.forEach(id => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  const stats = useMemo(() => ({
    total: patients.length,
    mild: patients.filter(p => p.status === PatientStatus.Mild).length,
    stable: patients.filter(p => p.status === PatientStatus.Stable).length,
    critical: patients.filter(p => p.status === PatientStatus.Critical).length,
  }), [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesFilter = filter === 'All' || patient.status === filter;
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery, patients]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage]);

  const handleEditClick = (patient: Patient) => {
    setEditingPatient({ ...patient });
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeletePatient = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPatients(prev => prev.filter(p => p.id !== id));
    setActiveMenuId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      setPatients(prev => prev.map(p => p.id === editingPatient.id ? editingPatient : p));
      setIsEditModalOpen(false);
      setEditingPatient(null);
    }
  };

  const renderActionMenu = (patient: Patient) => (
    <div 
      ref={menuRef}
      className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onViewProfile(patient.id); }} 
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <UserCircle size={16} className="text-slate-400" /> View Profile
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); handleEditClick(patient); }} 
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <Pencil size={16} className="text-slate-400" /> Edit Record
      </button>
      <div className="h-px bg-slate-200 mx-2" />
      <button 
        onClick={(e) => handleDeletePatient(e, patient.id)} 
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={16} className="text-red-400" /> Remove Record
      </button>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-[#fcfcfc] min-h-full">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total patients" value={stats.total} icon={Users} colorClass="bg-slate-900" isActive={filter === 'All'} onClick={() => setFilter('All')} />
        <StatCard label="Mild patients" value={stats.mild} icon={ShieldCheck} colorClass="bg-emerald-500" isActive={filter === PatientStatus.Mild} onClick={() => setFilter(PatientStatus.Mild)} />
        <StatCard label="Stable patients" value={stats.stable} icon={RefreshCcw} colorClass="bg-teal-500" isActive={filter === PatientStatus.Stable} onClick={() => setFilter(PatientStatus.Stable)} />
        <StatCard label="Critical patients" value={stats.critical} icon={AlertCircle} colorClass="bg-red-500" isActive={filter === PatientStatus.Critical} onClick={() => setFilter(PatientStatus.Critical)} />
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative" ref={filterMenuRef}>
              <button 
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 transition-all ${isFilterMenuOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <SlidersHorizontal size={20} />
              </button>
              
              {isFilterMenuOpen && (
                <div className="absolute left-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-200 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by status</p>
                  </div>
                  {[
                    { label: 'All Patients', value: 'All', icon: Users, color: 'text-slate-400' },
                    { label: 'Mild Status', value: PatientStatus.Mild, icon: ShieldCheck, color: 'text-emerald-500' },
                    { label: 'Stable Status', value: PatientStatus.Stable, icon: RefreshCcw, color: 'text-teal-500' },
                    { label: 'Critical Status', value: PatientStatus.Critical, icon: AlertCircle, color: 'text-red-500' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilter(option.value as any);
                        setIsFilterMenuOpen(false);
                        setCurrentPage(1);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <option.icon size={16} className={option.color} />
                        {option.label}
                      </div>
                      {filter === option.value && <Check size={14} className="text-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={onAddPatient}
            className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"
          >
            <Plus size={18} /> Add patient
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/30">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
                    checked={paginatedPatients.length > 0 && paginatedPatients.every(p => selectedIds.has(p.id))}
                    onChange={() => toggleAllOnPage(paginatedPatients.map(p => p.id))}
                  />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Age</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Gender</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Contact Number</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Last Visit</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Next Appointment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Appointed doctor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Reason</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedPatients.length > 0 ? paginatedPatients.map((patient) => {
                const isSelected = selectedIds.has(patient.id);
                return (
                  <tr 
                    key={patient.id} 
                    className={`transition-colors group cursor-pointer ${isSelected ? 'bg-emerald-50/40' : 'hover:bg-emerald-50/20'}`} 
                    onClick={() => toggleSelection(patient.id)}
                  >
                    <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
                        checked={isSelected}
                        onChange={() => toggleSelection(patient.id)}
                      />
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500 border-r border-slate-200">
                      {patient.id.padStart(3, '0')}-{patient.gender === 'Male' ? 'A' : 'B'}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-800 border-r border-slate-200">
                      {patient.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 border-r border-slate-200 text-center">{patient.age}</td>
                    <td className="px-6 py-5 text-sm text-slate-600 border-r border-slate-200 text-center">{patient.gender}</td>
                    <td className="px-6 py-5 text-sm text-slate-600 border-r border-slate-200">
                      (715) 794-{Math.floor(Math.random() * 8999 + 1000)}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 border-r border-slate-200 text-center">{patient.lastAppointment}</td>
                    <td className="px-6 py-5 text-sm text-slate-500 border-r border-slate-200 text-center">02/02/2025</td>
                    <td className="px-6 py-5 border-r border-slate-200">
                      <div className="flex items-center gap-2">
                        <img src={`https://i.pravatar.cc/150?u=dr-${patient.id}`} className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" />
                        <span className="text-sm font-medium text-slate-700">Dr. Derek Lowe</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 border-r border-slate-200">{patient.diagnosis}</td>
                    <td className="px-6 py-5 text-right relative" onClick={(e) => { e.stopPropagation(); }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === patient.id ? null : patient.id); }}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      {activeMenuId === patient.id && renderActionMenu(patient)}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={11} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Users size={48} strokeWidth={1} />
                      <p className="text-lg font-bold text-slate-600">No patients found</p>
                      <p className="text-sm">Try adjusting your filter settings.</p>
                      <button 
                        onClick={() => { setFilter('All'); setSearchQuery(''); }}
                        className="mt-2 text-emerald-600 font-bold text-sm hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Updated Pagination Footer */}
        <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-12">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
              Showing {paginatedPatients.length} of {filteredPatients.length} patients
            </span>
            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button 
                  key={p} 
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                    p === currentPage 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 transition-all ${
                currentPage === 1 
                  ? 'text-slate-200 cursor-not-allowed' 
                  : 'text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-500'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 transition-all ${
                currentPage === totalPages 
                  ? 'text-slate-200 cursor-not-allowed' 
                  : 'text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-500'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Patient Modal */}
      {isEditModalOpen && editingPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 relative z-10">
             {/* Header */}
             <div className="bg-[#10b981] p-10 text-white">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-3xl font-black tracking-tight">Edit Patient Record</h2>
                   <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                      <X size={24} />
                   </button>
                </div>
                <p className="text-emerald-50 font-medium">Update patient demographic and clinical information.</p>
             </div>

             <form onSubmit={handleSaveEdit} className="p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                   {/* Full Name */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all font-bold text-slate-700"
                        value={editingPatient.name}
                        onChange={e => setEditingPatient({...editingPatient, name: e.target.value})}
                      />
                   </div>

                   {/* Gender */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender Identity</label>
                      <div className="flex p-1 bg-[#f8fafc] border border-slate-200 rounded-2xl h-[52px]">
                        <button 
                          type="button"
                          onClick={() => setEditingPatient({...editingPatient, gender: 'Male'})}
                          className={`flex-1 rounded-xl text-sm font-bold transition-all ${editingPatient.gender === 'Male' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-500'}`}
                        >
                          Male
                        </button>
                        <button 
                          type="button"
                          onClick={() => setEditingPatient({...editingPatient, gender: 'Female'})}
                          className={`flex-1 rounded-xl text-sm font-bold transition-all ${editingPatient.gender === 'Female' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-500'}`}
                        >
                          Female
                        </button>
                      </div>
                   </div>

                   {/* DOB with Picker */}
                   <div className="space-y-1.5 relative" ref={editDatePickerRef}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                      <div 
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all font-bold text-slate-700 flex items-center justify-between cursor-pointer group"
                      >
                        <span className={editingPatient.dob ? 'text-slate-800' : 'text-slate-300'}>
                          {editingPatient.dob || 'DD-MM-YYYY'}
                        </span>
                        <Calendar size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      {showDatePicker && (
                        <MaterialDatePicker 
                          value={editingPatient.dob} 
                          onChange={(val) => setEditingPatient({...editingPatient, dob: val})} 
                          onClose={() => setShowDatePicker(false)} 
                        />
                      )}
                   </div>

                   {/* Age */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age</label>
                      <input 
                        type="number" 
                        required
                        className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all font-bold text-slate-700"
                        value={editingPatient.age}
                        onChange={e => setEditingPatient({...editingPatient, age: parseInt(e.target.value) || 0})}
                      />
                   </div>

                   {/* Diagnosis */}
                   <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Diagnosis</label>
                      <textarea 
                        required
                        rows={3}
                        className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all resize-none font-bold text-slate-700"
                        value={editingPatient.diagnosis}
                        onChange={e => setEditingPatient({...editingPatient, diagnosis: e.target.value})}
                      />
                   </div>

                   {/* Severity */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Severity Status</label>
                      <select 
                        className="w-full px-5 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all cursor-pointer appearance-none font-bold text-slate-700"
                        value={editingPatient.status}
                        onChange={e => setEditingPatient({...editingPatient, status: e.target.value as PatientStatus})}
                      >
                        {Object.values(PatientStatus).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                   </div>
                </div>

                <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/50 flex items-start gap-4">
                   <div className="text-emerald-500 mt-0.5 shrink-0 bg-white p-1 rounded-full shadow-sm">
                      <Info size={16} />
                   </div>
                   <p className="text-xs text-emerald-700/80 font-bold leading-relaxed">
                      Changes made to this patient record will be synchronized across the clinical network immediately.
                   </p>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                     type="button" 
                     onClick={() => setIsEditModalOpen(false)}
                     className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-full hover:bg-slate-200 hover:text-slate-600 transition-all uppercase tracking-widest text-xs"
                   >
                      Cancel
                   </button>
                   <button 
                     type="submit"
                     className="flex-[2] py-4 bg-[#10b981] text-white font-black rounded-full hover:bg-[#059669] shadow-xl shadow-emerald-200/30 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                   >
                      <Save size={18} /> Update Record
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
