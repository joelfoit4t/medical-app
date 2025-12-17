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
  Settings,
  LayoutGrid,
  List,
  X,
  Plus
} from 'lucide-react';
import { MOCK_STAFF } from '../constants';
import { StatCard } from './StatCard';
import { StaffStatus, StaffRole, Staff } from '../types';

export const StaffListView: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>(MOCK_STAFF);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Staff Form State
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: StaffRole.Doctor,
    department: '',
    email: '',
    schedule: 'Mon-Fri, 09:00-17:00'
  });

  const ITEMS_PER_PAGE = 5;

  // Filter staff based on search query
  const filteredStaff = useMemo(() => {
    return staffList.filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, staffList]);

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);

  // Paginate filtered results
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStaff.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStaff, currentPage]);

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

  const activeStaffCount = staffList.filter(s => s.status === StaffStatus.Active).length;
  const leaveStaffCount = staffList.filter(s => s.status === StaffStatus.OnBreak).length;

  return (
    <div className="p-6 lg:p-8 space-y-6 relative">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Staff" value={staffList.length} icon={Stethoscope} colorClass="bg-slate-900" />
        <StatCard label="Active Now" value={activeStaffCount} icon={Activity} colorClass="bg-emerald-500" />
        <StatCard label="On Break" value={leaveStaffCount} icon={Calendar} colorClass="bg-emerald-400" />
        <StatCard label="Off Duty" value={staffList.length - activeStaffCount - leaveStaffCount} icon={UserRound} colorClass="bg-emerald-300" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
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
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors">
              <SlidersHorizontal size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors">
              All Departments <ChevronDown size={14} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 shadow-sm shadow-emerald-200 transition-all active:scale-95"
            >
              <UserPlus size={14} /> Add Staff
            </button>
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600">
                    <LayoutGrid size={16} />
                </button>
                <button className="p-1.5 rounded-md bg-white text-slate-800 shadow-sm">
                    <List size={16} />
                </button>
            </div>
             <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                <Settings size={18} />
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role & Dept</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStaff.length > 0 ? paginatedStaff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shadow-sm" />
                      <div>
                        <span className="text-sm font-semibold text-slate-800 block">{member.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {member.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <span className="text-sm font-medium text-slate-700 block">{member.role}</span>
                      <span className="text-xs text-slate-400">{member.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Mail size={14} className="text-slate-300" />
                      {member.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock size={14} className="text-slate-300" />
                      {member.schedule}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      member.status === StaffStatus.Active ? 'bg-emerald-50 text-emerald-600' :
                      member.status === StaffStatus.OnBreak ? 'bg-amber-50 text-amber-600' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        member.status === StaffStatus.Active ? 'bg-emerald-500' :
                        member.status === StaffStatus.OnBreak ? 'bg-amber-500' :
                        'bg-slate-400'
                      }`} />
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                    No staff members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with active pagination */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 text-sm font-medium px-2 py-1 transition-colors ${
                currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'
              }`}
             >
                <ChevronLeft size={16} /> Previous
             </button>
             <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button 
                      key={p} 
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                        p === currentPage 
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                ))}
             </div>
             <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 text-sm font-medium px-2 py-1 transition-colors ${
                currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-slate-800'
              }`}
             >
                Next <ChevronRight size={16} />
             </button>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500">
               Showing {Math.min(filteredStaff.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(filteredStaff.length, currentPage * ITEMS_PER_PAGE)} of {filteredStaff.length} members
             </span>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowAddModal(false)}
          />
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-300 relative z-10">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 py-10 text-white relative">
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus size={28} />
              </div>
              <h2 className="text-2xl font-bold">Add Staff Member</h2>
              <p className="text-emerald-100 text-sm mt-1">Fill in the details to register a new medical professional.</p>
            </div>

            <form onSubmit={handleAddStaff} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dr. Jane Cooper"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Role</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value as StaffRole})}
                  >
                    {Object.values(StaffRole).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Department</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Cardiology"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                    value={newStaff.department}
                    onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="jane.cooper@medicare.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                  value={newStaff.email}
                  onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                />
              </div>

              <div className="space-y-1.5 pb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Default Schedule</label>
                <input 
                  type="text" 
                  placeholder="Mon-Fri, 09:00-17:00"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                  value={newStaff.schedule}
                  onChange={e => setNewStaff({...newStaff, schedule: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};