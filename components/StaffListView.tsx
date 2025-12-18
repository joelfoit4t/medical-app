import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  UserRound, 
  Activity, 
  Calendar, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  UserPlus, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Mail,
  Clock,
  LayoutGrid,
  List,
  X,
  Plus,
  Check,
  UserCircle
} from 'lucide-react';
import { MOCK_STAFF } from '../constants';
import { StatCard } from './StatCard';
import { StaffStatus, StaffRole, Staff } from '../types';

export const StaffListView: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>(MOCK_STAFF);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | StaffStatus>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // New Staff Form State
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: StaffRole.Doctor,
    department: '',
    email: '',
    schedule: 'Mon-Fri, 09:00-17:00'
  });

  const ITEMS_PER_PAGE = viewMode === 'list' ? 10 : 6;

  // Selection handlers
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

  // Filter staff based on search query and status filter
  const filteredStaff = useMemo(() => {
    return staffList.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, staffList]);

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE) || 1;

  // Paginate filtered results
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStaff.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStaff, currentPage, viewMode]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staff: Staff = {
      id: `s${staffList.length + 1}`,
      name: newStaff.name,
      avatar: `https://i.pravatar.cc/150?u=${newStaff.name.replace(/\s+/g, '')}`,
      role: newStaff.role,
      department: newStaff.department,
      status: StaffStatus.Active,
      email: newStaff.email,
      schedule: newStaff.schedule
    };

    setStaffList([staff, ...staffList]);
    setShowAddModal(false);
    setNewStaff({
      name: '',
      role: StaffRole.Doctor,
      department: '',
      email: '',
      schedule: 'Mon-Fri, 09:00-17:00'
    });
  };

  const renderStatusBadge = (status: StaffStatus) => {
    let baseStyles = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all";
    switch (status) {
      case StaffStatus.Active:
        return <span className={`${baseStyles} bg-emerald-50 text-emerald-600`}><Check size={12} strokeWidth={3} /> Active</span>;
      case StaffStatus.OnBreak:
        return <span className={`${baseStyles} bg-amber-50 text-amber-600`}><Clock size={12} strokeWidth={3} /> On Break</span>;
      case StaffStatus.OffDuty:
        return <span className={`${baseStyles} bg-slate-50 text-slate-500`}><X size={12} strokeWidth={3} /> Off Duty</span>;
      default:
        return <span className={`${baseStyles} bg-slate-50 text-slate-500`}>{status}</span>;
    }
  };

  const activeStaffCount = staffList.filter(s => s.status === StaffStatus.Active).length;
  const leaveStaffCount = staffList.filter(s => s.status === StaffStatus.OnBreak).length;
  const offDutyCount = staffList.filter(s => s.status === StaffStatus.OffDuty).length;

  const handleFilterClick = (filter: 'All' | StaffStatus) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 relative bg-[#fcfcfc] min-h-full">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Staff" 
          value={staffList.length} 
          icon={Stethoscope} 
          colorClass="bg-slate-900" 
          isActive={statusFilter === 'All'}
          onClick={() => handleFilterClick('All')}
        />
        <StatCard 
          label="Active Now" 
          value={activeStaffCount} 
          icon={Activity} 
          colorClass="bg-emerald-500" 
          isActive={statusFilter === StaffStatus.Active}
          onClick={() => handleFilterClick(StaffStatus.Active)}
        />
        <StatCard 
          label="On Break" 
          value={leaveStaffCount} 
          icon={Calendar} 
          colorClass="bg-amber-500" 
          isActive={statusFilter === StaffStatus.OnBreak}
          onClick={() => handleFilterClick(StaffStatus.OnBreak)}
        />
        <StatCard 
          label="Off Duty" 
          value={offDutyCount} 
          icon={UserRound} 
          colorClass="bg-slate-400" 
          isActive={statusFilter === StaffStatus.OffDuty}
          onClick={() => handleFilterClick(StaffStatus.OffDuty)}
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Table Toolbar */}
        <div className="px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search staff name or role.." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 font-bold hover:bg-slate-50 transition-colors">
              <SlidersHorizontal size={14} /> Filter
            </button>
            
            {/* View Toggle Buttons */}
            <div className="flex bg-slate-100 p-1 rounded-xl ml-2">
                <button 
                  onClick={() => { setViewMode('list'); setCurrentPage(1); }}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <List size={18} />
                </button>
                <button 
                  onClick={() => { setViewMode('grid'); setCurrentPage(1); }}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <LayoutGrid size={18} />
                </button>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"
          >
            <Plus size={18} /> Add staff
          </button>
        </div>

        {/* List View Table */}
        <div className="flex-1 overflow-x-auto">
          {viewMode === 'list' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50/30">
                  <th className="px-8 py-4 w-10 border-r border-slate-200">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
                      checked={paginatedStaff.length > 0 && paginatedStaff.every(s => selectedIds.has(s.id))}
                      onChange={() => toggleAllOnPage(paginatedStaff.map(s => s.id))}
                    />
                  </th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">ID</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Staff Name</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Role</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Department</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Email Address</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Schedule</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Status</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedStaff.length > 0 ? paginatedStaff.map((member) => {
                  const isSelected = selectedIds.has(member.id);
                  return (
                    <tr 
                      key={member.id} 
                      onClick={() => toggleSelection(member.id)}
                      className={`transition-colors group cursor-pointer ${isSelected ? 'bg-emerald-50/40' : 'hover:bg-emerald-50/20'}`}
                    >
                      <td className="px-8 py-5 border-r border-slate-200" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
                          checked={isSelected}
                          onChange={() => toggleSelection(member.id)}
                        />
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500 border-r border-slate-200 text-center">
                        {member.id.toUpperCase()}
                      </td>
                      <td className="px-8 py-5 border-r border-slate-200">
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
                          <span className="text-sm font-bold text-slate-800">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-700 border-r border-slate-200">
                        {member.role}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500 border-r border-slate-200">
                        {member.department}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500 border-r border-slate-200">
                        {member.email}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500 border-r border-slate-200 text-center font-medium">
                        {member.schedule.split(',')[1]?.trim() || member.schedule}
                      </td>
                      <td className="px-8 py-5 text-center border-r border-slate-200">
                        {renderStatusBadge(member.status)}
                      </td>
                      <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button className="text-slate-400 hover:text-emerald-600 p-1 rounded-lg hover:bg-emerald-50 transition-all">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={9} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <UserRound size={48} strokeWidth={1} />
                        <p className="text-lg font-bold text-slate-600">No staff found</p>
                        <p className="text-sm">Try adjusting your search or category filters.</p>
                        {statusFilter !== 'All' && (
                          <button 
                            onClick={() => handleFilterClick('All')}
                            className="text-emerald-500 text-sm font-bold mt-2 hover:underline"
                          >
                            Reset Category Filter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
              {paginatedStaff.map((member) => (
                <div key={member.id} className="bg-slate-50/50 border border-slate-200 rounded-[24px] p-6 hover:border-emerald-300 transition-all hover:shadow-lg group relative overflow-hidden">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-[18px] object-cover ring-4 ring-white shadow-md" />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          member.status === StaffStatus.Active ? 'bg-emerald-500' :
                          member.status === StaffStatus.OnBreak ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{member.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {member.id.toUpperCase()}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-500 p-1.5 transition-colors">
                      <MoreHorizontal size={22} />
                    </button>
                  </div>
                  
                  <div className="space-y-3.5 mb-8">
                    <div className="flex justify-between items-center bg-white/50 px-3 py-2 rounded-xl">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Role</span>
                      <span className="text-sm text-slate-800 font-bold">{member.role}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/50 px-3 py-2 rounded-xl">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Department</span>
                      <span className="text-sm text-slate-800 font-bold">{member.department}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/50 px-3 py-2 rounded-xl">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Email</span>
                      <span className="text-xs text-slate-600 font-semibold truncate ml-4">{member.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                       {renderStatusBadge(member.status)}
                    </div>
                    <button className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 transition-all">
                      Schedule <Clock size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {paginatedStaff.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <UserRound size={48} strokeWidth={1} />
                    <p className="text-lg font-bold text-slate-600">No staff found</p>
                    {statusFilter !== 'All' && (
                      <button 
                        onClick={() => handleFilterClick('All')}
                        className="text-emerald-500 text-sm font-bold mt-2 hover:underline"
                      >
                        Reset Category Filter
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Updated Pagination Footer */}
        <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-12">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
              Showing {paginatedStaff.length} of {filteredStaff.length} professionals
            </span>
            <div className="flex items-center gap-3">
               {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 transition-all ${
                currentPage === 1 
                  ? 'text-slate-200 cursor-not-allowed' 
                  : 'text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-500'
              }`}
             >
                <ChevronLeft size={20} />
             </button>
             <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 transition-all ${
                currentPage === totalPages 
                  ? 'text-slate-200 cursor-not-allowed' 
                  : 'text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-500'
              }`}
             >
                <ChevronRight size={20} />
             </button>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowAddModal(false)}
          />
          <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 relative z-10">
            <div className="bg-[#10b981] px-8 py-10 text-white relative">
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus size={28} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Register Staff Member</h2>
              <p className="text-emerald-50 text-sm mt-1 font-medium">Onboard a new medical professional to the clinic.</p>
            </div>

            <form onSubmit={handleAddStaff} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dr. Jane Cooper"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Role</label>
                  <select 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer appearance-none"
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value as StaffRole})}
                  >
                    {Object.values(StaffRole).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Cardiology"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                    value={newStaff.department}
                    onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="jane.cooper@medicare.com"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                  value={newStaff.email}
                  onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-400 font-bold rounded-full hover:bg-slate-200 hover:text-slate-600 transition-all uppercase tracking-widest text-[11px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-[#10b981] text-white font-bold rounded-full hover:bg-[#059669] shadow-lg shadow-emerald-200/40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};