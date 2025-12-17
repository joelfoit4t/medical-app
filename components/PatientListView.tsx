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
  Check
} from 'lucide-react';
import { StatCard } from './StatCard';
import { PatientStatus, Patient } from '../types';

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  onViewProfile: (id: string) => void;
  onAddPatient: () => void;
}

export const PatientListView: React.FC<Props> = ({ patients, setPatients, onViewProfile, onAddPatient }) => {
  const [filter, setFilter] = useState<'All' | PatientStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const menuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleDeletePatient = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPatients(prev => prev.filter(p => p.id !== id));
    setActiveMenuId(null);
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
        {/* Top bar like in screenshot */}
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
                  <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Age</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Contact Number</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Last Visit</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Next Appointment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Appointed doctor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Reason</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedPatients.length > 0 ? paginatedPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => onViewProfile(patient.id)}>
                  <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500 border-r border-slate-200">
                    {patient.id.padStart(3, '0')}-{patient.gender === 'Male' ? 'A' : 'B'}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-800 border-r border-slate-200">
                    {patient.name}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600 border-r border-slate-200 text-center">{patient.age}</td>
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
                  <td className="px-6 py-5 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === patient.id ? null : patient.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    {activeMenuId === patient.id && renderActionMenu(patient)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={10} className="px-6 py-20 text-center">
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

        {/* Pagination Footer */}
        <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-between bg-slate-50/20">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            Showing {paginatedPatients.length} of {filteredPatients.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${currentPage === 1 ? 'text-slate-200' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button 
                  key={p} 
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${p === currentPage ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${currentPage === totalPages ? 'text-slate-200' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};