import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  RefreshCcw, 
  AlertCircle, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Upload, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Settings,
  Pencil,
  Trash2,
  X,
  Save,
  UserCircle,
  Calendar,
  Dna,
  Clock,
  User
} from 'lucide-react';
import { StatCard } from './StatCard';
import { PatientStatus, Patient } from '../types';

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  onViewProfile: (id: string) => void;
}

export const PatientListView: React.FC<Props> = ({ patients, setPatients, onViewProfile }) => {
  const [filter, setFilter] = useState<'All' | PatientStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Dropdown / Modal States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate counts for stats
  const stats = useMemo(() => ({
    total: patients.length,
    mild: patients.filter(p => p.status === PatientStatus.Mild).length,
    stable: patients.filter(p => p.status === PatientStatus.Stable).length,
    critical: patients.filter(p => p.status === PatientStatus.Critical).length,
  }), [patients]);

  // Filter logic
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesFilter = filter === 'All' || patient.status === filter;
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery, patients]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage, itemsPerPage]);

  // Reset to first page when filtering/searching
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const handleEditClick = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    setEditingPatient({ ...patient });
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleViewProfileClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onViewProfile(id);
    setActiveMenuId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    setPatients(prev => prev.map(p => p.id === editingPatient.id ? editingPatient : p));
    setIsEditModalOpen(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPatients(prev => prev.filter(p => p.id !== id));
    setActiveMenuId(null);
  };

  const handleStatClick = (newFilter: 'All' | PatientStatus) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const renderStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case PatientStatus.Stable:
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-500">Stable</span>;
      case PatientStatus.Critical:
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-500">Critical</span>;
      case PatientStatus.Mild:
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600">Mild</span>;
      default:
        return null;
    }
  };

  const renderActionMenu = (patient: Patient) => (
    <div 
      ref={menuRef}
      className="absolute right-0 top-12 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-left"
    >
      <div className="py-2">
        <button 
          onClick={(e) => handleEditClick(e, patient)} 
          className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Pencil size={20} className="text-[#10b981]" /> Edit Patient
        </button>
        <button 
          onClick={(e) => handleViewProfileClick(e, patient.id)} 
          className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Users size={20} className="text-[#10b981]" /> View Profile
        </button>
        <div className="h-px bg-slate-50 mx-6" />
        <div className="p-3">
          <button 
            onClick={(e) => handleDeletePatient(e, patient.id)} 
            className="w-full flex flex-col items-center justify-center gap-3 p-5 rounded-[1.5rem] border-[3px] border-[#fca5a5] bg-[#fff1f2] hover:bg-red-50 text-red-600 transition-all active:scale-[0.98] group"
          >
            <Trash2 size={32} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-center">Remove Record</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total patients" 
          value={stats.total} 
          icon={Users} 
          colorClass="bg-indigo-900" 
          isActive={filter === 'All'}
          onClick={() => handleStatClick('All')}
        />
        <StatCard 
          label="Mild patients" 
          value={stats.mild} 
          icon={ShieldCheck} 
          colorClass="bg-emerald-500" 
          isActive={filter === PatientStatus.Mild}
          onClick={() => handleStatClick(PatientStatus.Mild)}
        />
        <StatCard 
          label="Stable patients" 
          value={stats.stable} 
          icon={RefreshCcw} 
          colorClass="bg-sky-500" 
          isActive={filter === PatientStatus.Stable}
          onClick={() => handleStatClick(PatientStatus.Stable)}
        />
        <StatCard 
          label="Critical patients" 
          value={stats.critical} 
          icon={AlertCircle} 
          colorClass="bg-red-500" 
          isActive={filter === PatientStatus.Critical}
          onClick={() => handleStatClick(PatientStatus.Critical)}
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search patient or diagnosis.." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors">
              <SlidersHorizontal size={14} /> Filter
            </button>
            
            <div className="relative" ref={statusRef}>
                <button 
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 capitalize transition-colors"
                >
                {filter === 'All' ? 'All Status' : filter} <ChevronDown size={14} className={`transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {['All', ...Object.values(PatientStatus)].map((s) => (
                            <button
                                key={s}
                                onClick={() => {
                                    handleStatClick(s as any);
                                    setIsStatusDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${filter === s ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-600'}`}
                            >
                                {s === 'All' ? 'All Status' : s}
                            </button>
                        ))}
                    </div>
                )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 shadow-sm shadow-emerald-100 transition-all">
              <Upload size={14} /> Export
            </button>
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <LayoutGrid size={16} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <List size={16} />
                </button>
            </div>
             <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                <Settings size={18} />
             </button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="px-6 py-4 w-10">
                      <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Last appointment</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Age</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Date of birth</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Gender</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Diagnosis</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPatients.length > 0 ? paginatedPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={patient.avatar} alt={patient.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shadow-sm" />
                          <span className="text-sm font-bold text-slate-800">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{patient.lastAppointment}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{patient.age}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{patient.dob}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{patient.gender}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{patient.diagnosis}</td>
                      <td className="px-6 py-4 text-center">
                        {renderStatusBadge(patient.status)}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === patient.id ? null : patient.id)}
                          className={`text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg border-2 transition-all ${activeMenuId === patient.id ? 'border-emerald-500 text-emerald-600 bg-white shadow-md' : 'border-slate-200'}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {activeMenuId === patient.id && renderActionMenu(patient)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={9} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                             <Users size={40} className="opacity-20 mb-2" />
                             <p className="font-bold text-slate-600">No patients found</p>
                             <p className="text-sm">Try adjusting your filters or search query.</p>
                             <button onClick={() => {setFilter('All'); setSearchQuery('');}} className="mt-4 text-emerald-500 text-sm font-bold hover:underline">Clear all filters</button>
                          </div>
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {paginatedPatients.map((patient) => (
                    <div key={patient.id} className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-all hover:shadow-md group cursor-pointer relative" onClick={() => onViewProfile(patient.id)}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-sm" />
                                <div>
                                    <h4 className="font-bold text-slate-800">{patient.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {patient.id.padStart(4, '0')}</p>
                                </div>
                            </div>
                            <div className="relative">
                              <button 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(activeMenuId === patient.id ? null : patient.id);
                                  }}
                                  className={`p-2 rounded-xl border-2 transition-all ${
                                    activeMenuId === patient.id 
                                      ? 'border-emerald-500 bg-white text-emerald-500 shadow-md scale-105' 
                                      : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                  }`}
                              >
                                  <MoreHorizontal size={18} />
                              </button>
                              {activeMenuId === patient.id && renderActionMenu(patient)}
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Diagnosis</span>
                                <span className="text-slate-700 font-bold">{patient.diagnosis}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Age / Gender</span>
                                <span className="text-slate-700 font-bold">{patient.age} • {patient.gender}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-medium">Last Appt</span>
                                <span className="text-slate-700 font-bold">{patient.lastAppointment}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            {renderStatusBadge(patient.status)}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewProfile(patient.id);
                                }}
                                className="text-xs font-bold text-emerald-600 hover:underline"
                            >
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
          <div className="flex items-center gap-6">
             <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'
              }`}
             >
                <ChevronLeft size={16} /> Previous
             </button>
             
             <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button 
                      key={p} 
                      onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all border-2 ${
                        p === currentPage 
                          ? 'border-emerald-500 text-emerald-600 bg-white shadow-[0_2px_10px_rgba(16,185,129,0.2)]' 
                          : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      {p}
                    </button>
                ))}
             </div>
             
             <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'
              }`}
             >
                Next <ChevronRight size={16} />
             </button>
          </div>
          
          <div className="flex items-center gap-6">
             <span className="text-sm text-slate-400 font-bold">
               Showing <span className="text-slate-800">{(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)}</span> of <span className="text-slate-800">{filteredPatients.length}</span> entries
             </span>
          </div>
        </div>
      </div>

      {isEditModalOpen && editingPatient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-300 relative z-10">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-8 py-10 text-white relative">
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4"><UserCircle size={28} /></div>
              <h2 className="text-2xl font-bold">Edit Patient Details</h2>
              <p className="text-emerald-100 text-sm mt-1">Modify the medical record for <span className="font-bold underline">{editingPatient.name}</span></p>
            </div>
            <form onSubmit={handleSaveEdit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all" value={editingPatient.name} onChange={e => setEditingPatient({...editingPatient, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Status</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all cursor-pointer" value={editingPatient.status} onChange={e => setEditingPatient({...editingPatient, status: e.target.value as PatientStatus})}>
                    {Object.values(PatientStatus).map(s => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Age</label>
                  <input type="number" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all" value={editingPatient.age} onChange={e => setEditingPatient({...editingPatient, age: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Diagnosis</label>
                  <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all" value={editingPatient.diagnosis} onChange={e => setEditingPatient({...editingPatient, diagnosis: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Discard</button>
                <button type="submit" className="flex-[2] py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"><Save size={18} /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};