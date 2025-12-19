import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  FileText, 
  Copy, 
  ChevronLeft,
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Plus,
  Pill,
  MoreHorizontal,
  Check,
  Activity,
  Archive,
  Menu,
  Pencil,
  Trash2,
  Calendar,
  User as UserIcon,
  X
} from 'lucide-react';
import { Patient } from '../types';

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  problems?: string;
  doctor?: string;
  priority?: string;
  caseNo?: string;
  type: 'upcoming' | 'past';
}

interface Medication {
  id: string;
  name: string;
  strength: string;
  dosage: string;
  instructions: string;
  prescribedBy: string;
  prescrDate: string;
  isActive: boolean;
}

interface Props {
  patients: Patient[];
  selectedId: string | null;
  onBack: () => void;
}

/**
 * Material UI Inspired Date Picker Component
 */
const MaterialDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}> = ({ value, onChange, onClose }) => {
  // Use current date as default view if no value provided
  const initialDate = useMemo(() => {
    if (!value || value === 'Prescription date' || value === 'Select Date') return new Date();
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
    // Previous month filler
    for (let i = startDay - 1; i >= 0; i--) {
      arr.push({ day: prevMonthDays - i, current: false, date: new Date(year, viewDate.getMonth() - 1, prevMonthDays - i) });
    }
    // Current month
    for (let i = 1; i <= dCount; i++) {
      arr.push({ day: i, current: true, date: new Date(year, viewDate.getMonth(), i) });
    }
    // Next month filler
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
    <div className="absolute bottom-full right-0 mb-4 bg-white rounded-3xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 z-[150] w-[300px] p-6 animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
      <div className="flex items-center justify-between mb-6 px-1">
        <button type="button" className="text-sm font-black text-[#1e293b] uppercase tracking-wider">
          {monthName} {year}
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <ChevronRight size={18} />
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

      <div className="flex items-center justify-end mt-5 pt-4 border-t border-slate-50">
        <button 
          type="button" 
          onClick={() => { handleDateClick(new Date()); }} 
          className="text-[11px] font-black text-emerald-500 px-4 py-2 hover:bg-emerald-50 rounded-full transition-colors uppercase tracking-widest"
        >
          Today
        </button>
      </div>
    </div>
  );
};

const INITIAL_MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'Amoxicillin', strength: '500mg', dosage: '2 capsules', instructions: 'Mornings only without meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
  { id: 'm2', name: 'Amoxicillin', strength: '500mg', dosage: '1 tablet', instructions: 'Three (3) times a day after meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
  { id: 'm3', name: 'Amoxicillin', strength: '500mg', dosage: '3 tablets', instructions: 'Mornings only after meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
  { id: 'm4', name: 'Amoxicillin', strength: '500mg', dosage: '2 capsules', instructions: 'Evenings only', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
  { id: 'm5', name: 'Amoxicillin', strength: '500mg', dosage: '2 tea spoons', instructions: 'Mornings/evenings after meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
  { id: 'm6', name: 'Amoxicillin', strength: '500mg', dosage: '6 capsules', instructions: '3 times a day after meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
];

export const PatientProfileView: React.FC<Props> = ({ patients, selectedId, onBack }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [expandedItems, setExpandedItems] = useState<string[]>(['up-1']);
  
  // Medication state
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [medFilter, setMedFilter] = useState<'All' | 'Active' | 'Inactive'>('Active');
  const [isMedFilterMenuOpen, setIsMedFilterMenuOpen] = useState(false);
  const [activeActionMedId, setActiveActionMedId] = useState<string | null>(null);
  
  // Modal states
  const [isEditMedModalOpen, setIsEditMedModalOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id' | 'isActive'>>({
    name: '',
    strength: '',
    dosage: '',
    instructions: '',
    prescribedBy: '',
    prescrDate: ''
  });

  const medFilterRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedId) || patients[0];
  }, [selectedId, patients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (medFilterRef.current && !medFilterRef.current.contains(event.target as Node)) {
        setIsMedFilterMenuOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveActionMedId(null);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timelineData: TimelineItem[] = [
    {
      id: 'up-1',
      title: 'Monthly Review',
      date: '23 May, 2023',
      problems: 'The patient has a history of high blood pressure and is currently taking medication to manage it. During the most recent visit, the patient complained of occasional headaches and dizziness.',
      doctor: 'Dr M. Wagner',
      priority: 'High',
      caseNo: 'C-2198',
      type: 'upcoming'
    },
    {
      id: 'pa-1',
      title: 'General Check-up',
      date: '21 April, 2023',
      problems: 'Routine checkup. All vitals stable.',
      doctor: 'Dr R. Green',
      priority: 'Normal',
      caseNo: 'C-2044',
      type: 'past'
    }
  ];

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredMedications = useMemo(() => {
    if (medFilter === 'Active') return medications.filter(m => m.isActive);
    if (medFilter === 'Inactive') return medications.filter(m => !m.isActive);
    return medications;
  }, [medFilter, medications]);

  const handleEditMedication = (med: Medication) => {
    setEditingMedication({ ...med });
    setIsEditMedModalOpen(true);
    setActiveActionMedId(null);
  };

  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMedication) {
      setMedications(prev => prev.map(m => m.id === editingMedication.id ? editingMedication : m));
      setIsEditMedModalOpen(false);
      setEditingMedication(null);
      setShowDatePicker(false);
    }
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const medication: Medication = {
      ...newMedication,
      id: `m${Date.now()}`,
      isActive: true,
      prescrDate: newMedication.prescrDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setMedications(prev => [medication, ...prev]);
    setIsAddMedModalOpen(false);
    setNewMedication({
      name: '',
      strength: '',
      dosage: '',
      instructions: '',
      prescribedBy: '',
      prescrDate: ''
    });
    setShowDatePicker(false);
  };

  const tabs = [
    'Overview', 'Clinical data', 'Medications', 'Care plans', 
    'Patient profile', 'Benefits', 'Relationships', 'Unified health score', 'Schedule'
  ];

  const renderMedicationsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="relative" ref={medFilterRef}>
            <button 
              onClick={() => setIsMedFilterMenuOpen(!isMedFilterMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 transition-all ${isMedFilterMenuOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Activity size={20} />
            </button>
            {isMedFilterMenuOpen && (
              <div className="absolute left-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-slate-200 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medication Status</p>
                </div>
                {[
                  { label: 'All Medications', value: 'All', icon: Menu, color: 'text-slate-400' },
                  { label: 'Active Only', value: 'Active', icon: Activity, color: 'text-emerald-500' },
                  { label: 'Inactive Only', value: 'Inactive', icon: Archive, color: 'text-slate-500' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setMedFilter(option.value as any);
                      setIsMedFilterMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <option.icon size={16} className={option.color} />
                      {option.label}
                    </div>
                    {medFilter === option.value && <Check size={14} className="text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Filtering: {medFilter}</span>
        </div>
        
        <button 
          onClick={() => setIsAddMedModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"
        >
          <Plus size={18} /> Add medication
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/30">
                <th className="px-6 py-4 w-10 border-r border-slate-200 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Medication Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Dosage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Instructions</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Prescribed by</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Prescr. date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMedications.map((med, idx) => (
                <tr key={med.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 border-r border-slate-200 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500 border-r border-slate-200">
                    {idx + 100}-M
                  </td>
                  <td className="px-6 py-5 border-r border-slate-200">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-slate-800">{med.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{med.strength}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 border-r border-slate-200">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-sm font-bold text-slate-700">
                      <Pill size={12} className="text-emerald-500 rotate-45" />
                      {med.dosage}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600 border-r border-slate-200">
                    {med.instructions}
                  </td>
                  <td className="px-6 py-5 border-r border-slate-200">
                    <div className="flex items-center gap-2">
                      <img src={`https://i.pravatar.cc/150?u=${med.prescribedBy.replace(/\s+/g, '')}`} className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" />
                      <span className="text-sm font-bold text-slate-700 hover:text-emerald-600 cursor-pointer hover:underline underline-offset-4">{med.prescribedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700 border-r border-slate-200">
                    {med.prescrDate}
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    <button 
                      onClick={() => setActiveActionMedId(activeActionMedId === med.id ? null : med.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    {activeActionMedId === med.id && (
                      <div 
                        ref={actionMenuRef}
                        className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <button 
                          onClick={() => handleEditMedication(med)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Pencil size={16} className="text-slate-400" /> Edit Medication
                        </button>
                        <button 
                          onClick={() => setMedications(meds => meds.filter(m => m.id !== med.id))}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} className="text-red-400" /> Discontinue
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTimelineItem = (item: TimelineItem, isLast: boolean) => {
    const isExpanded = expandedItems.includes(item.id);

    return (
      <div key={item.id} className="relative pl-8 mb-6 last:mb-0">
        {!isLast && (
          <div className="absolute left-[8px] top-6 bottom-[-24px] w-[1px] bg-slate-200 border-l border-dashed border-slate-300"></div>
        )}
        <div className={`absolute left-[3px] top-1.5 w-3 h-3 rounded-full border-2 bg-white shadow-sm z-10 transition-colors duration-300 ${isExpanded ? 'border-emerald-500' : 'border-slate-300'}`}></div>
        <div className="flex items-center justify-between mb-1">
          <button onClick={() => toggleItem(item.id)} className="flex flex-col items-start text-left group">
            <p className={`text-sm font-bold transition-colors ${isExpanded ? 'text-slate-900' : 'text-slate-700 group-hover:text-emerald-500'}`}>
              {item.title}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">{item.date}</p>
          </button>
          <button onClick={() => toggleItem(item.id)} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isExpanded ? 'bg-emerald-50 border-emerald-300 text-emerald-500' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 shadow-sm'}`}>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        {isExpanded && (
          <div className="mt-4 bg-[#fcfdfe] border border-emerald-100 rounded-2xl p-5 space-y-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Problems</p>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">{item.problems || 'No specific problems noted for this visit.'}</p>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assign. doctor</p>
                <p className="text-xs font-bold text-slate-800">{item.doctor || 'TBA'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                <p className={`text-xs font-bold ${item.priority === 'High' || item.priority === 'Urgent' ? 'text-red-500' : 'text-slate-800'}`}>{item.priority || 'Normal'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Case no</p>
                <p className="text-xs font-bold text-slate-800">{item.caseNo || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Left Column (Main Content) */}
      <div className="xl:col-span-8 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100">
                <span className="text-2xl">{selectedPatient.gender === 'Male' ? '♂' : '♀'}</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-800">{selectedPatient.name}</h2>
                  <span className="text-slate-400 text-sm font-medium">#ID : 2178{selectedPatient.id.padStart(4, '0')}</span>
                  <button className="text-slate-300 hover:text-emerald-500 transition-colors">
                    <Copy size={14} />
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  {selectedPatient.age} years old • {selectedPatient.gender} • Teacher
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all">
                <Phone size={18} />
              </button>
              <button className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all">
                <MessageSquare size={18} />
              </button>
              <button className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all">
                <FileText size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 border-t border-slate-200 pt-8">
            {[
              { label: 'Last visits', value: selectedPatient.lastAppointment },
              { label: 'Issue', value: 'Emergency', isBadge: true },
              { label: 'Assigned doctor', value: 'Dr M. Wagner' },
              { label: 'Referring doctor', value: 'Dr R. Green' },
              { label: 'Next Appt.', value: '23 May, 2023' },
              { label: 'Family doctor', value: 'Dr G. Mclar' }
            ].map((item, idx) => (
              <div key={idx} className={`${idx !== 5 ? 'border-r border-slate-200' : ''} pr-4 last:border-0`}>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
                <p className={`text-sm font-bold truncate ${item.isBadge ? 'text-slate-900 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100' : 'text-slate-800'}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Sidebar) */}
      <div className="xl:col-span-4 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Timeline</h3>
            <button className="text-emerald-500 text-sm font-bold flex items-center gap-1 hover:underline transition-all">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4 relative">
            <div className="space-y-6">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Upcoming</p>
              <div className="pl-4">
                 {renderTimelineItem(timelineData[0], true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!selectedPatient) return <div className="p-8">No patient selected.</div>;

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc] pb-10">
      {/* Top Header / Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-emerald-50 rounded-lg text-slate-400 border border-slate-200 transition-all active:scale-95 group"
        >
          <ArrowLeft size={18} className="group-hover:text-emerald-500 transition-colors" />
        </button>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-slate-400">Patient data</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-800 font-bold">{selectedPatient.name}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 overflow-x-auto sticky top-16 z-20 shadow-sm">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {activeTab === 'Overview' && renderOverviewTab()}
        {activeTab === 'Medications' && renderMedicationsTab()}
        {!['Overview', 'Medications'].includes(activeTab) && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
               <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{activeTab}</h3>
            <p className="text-sm text-slate-500 mt-1">This module is currently being developed for {selectedPatient.name}.</p>
          </div>
        )}
      </div>

      {/* Add Medication Modal */}
      {isAddMedModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsAddMedModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in slide-in-from-bottom-4 relative z-10 p-12">
            <h2 className="text-4xl font-black text-[#1e293b] mb-12">Add Medication</h2>
            <form onSubmit={handleAddMedication} className="space-y-6">
              <div className="space-y-5">
                <input 
                  type="text" 
                  required
                  className="w-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm" 
                  value={newMedication.name} 
                  onChange={e => setNewMedication({...newMedication, name: e.target.value})} 
                  placeholder="Medication name" 
                />
                
                <div className="grid grid-cols-2 gap-5">
                  <input 
                    type="text" 
                    required
                    className="w-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm" 
                    value={newMedication.strength} 
                    onChange={e => setNewMedication({...newMedication, strength: e.target.value})} 
                    placeholder="Strength" 
                  />
                  <input 
                    type="text" 
                    required
                    className="w-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm" 
                    value={newMedication.dosage} 
                    onChange={e => setNewMedication({...newMedication, dosage: e.target.value})} 
                    placeholder="Dosage" 
                  />
                </div>

                <textarea 
                  required
                  className="w-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all resize-none shadow-sm" 
                  rows={3}
                  value={newMedication.instructions} 
                  onChange={e => setNewMedication({...newMedication, instructions: e.target.value})} 
                  placeholder="Instructions" 
                />

                <div className="grid grid-cols-2 gap-5">
                  <div className="relative group h-[68px]">
                    <input 
                      type="text" 
                      required
                      className="w-full h-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm pr-14" 
                      value={newMedication.prescribedBy} 
                      onChange={e => setNewMedication({...newMedication, prescribedBy: e.target.value})} 
                      placeholder="Prescribed by" 
                    />
                    <UserIcon size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  </div>
                  
                  <div className="relative h-[68px]" ref={datePickerRef}>
                    <div 
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full h-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm cursor-pointer group flex items-center pr-14"
                    >
                      <span className={newMedication.prescrDate ? 'text-slate-800' : 'text-slate-300'}>
                        {newMedication.prescrDate || 'Prescription date'}
                      </span>
                      <Calendar size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors pointer-events-none" />
                    </div>
                    {showDatePicker && (
                      <MaterialDatePicker 
                        value={newMedication.prescrDate} 
                        onChange={(val) => setNewMedication({...newMedication, prescrDate: val})} 
                        onClose={() => setShowDatePicker(false)} 
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-12 pt-12">
                <button 
                  type="button" 
                  onClick={() => setIsAddMedModalOpen(false)} 
                  className="text-emerald-500 font-black uppercase tracking-[0.2em] text-xs hover:text-emerald-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-16 py-6 bg-[#10b981] text-white font-black rounded-full shadow-[0_15px_30px_-5px_rgba(16,185,129,0.3)] hover:bg-[#059669] hover:shadow-[0_15px_35px_-5px_rgba(16,185,129,0.4)] transition-all uppercase tracking-[0.2em] text-sm"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Medication Modal */}
      {isEditMedModalOpen && editingMedication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsEditMedModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in slide-in-from-bottom-4 relative z-10 p-12">
            <h2 className="text-4xl font-black text-[#1e293b] mb-12">Edit Medication</h2>
            <form onSubmit={handleSaveMedication} className="space-y-6">
              <div className="space-y-5">
                <input 
                  type="text" 
                  className="w-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm" 
                  value={editingMedication.name} 
                  onChange={e => setEditingMedication({...editingMedication, name: e.target.value})} 
                  placeholder="Medication name" 
                />
                
                <div className="grid grid-cols-2 gap-5">
                  <input 
                    type="text" 
                    className="w-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm" 
                    value={editingMedication.strength} 
                    onChange={e => setEditingMedication({...editingMedication, strength: e.target.value})} 
                    placeholder="Strength" 
                  />
                  <input 
                    type="text" 
                    className="w-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm" 
                    value={editingMedication.dosage} 
                    onChange={e => setEditingMedication({...editingMedication, dosage: e.target.value})} 
                    placeholder="Dosage" 
                  />
                </div>

                <textarea 
                  className="w-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all resize-none shadow-sm" 
                  rows={3}
                  value={editingMedication.instructions} 
                  onChange={e => setEditingMedication({...editingMedication, instructions: e.target.value})} 
                  placeholder="Instructions" 
                />

                <div className="grid grid-cols-2 gap-5">
                  <div className="relative group h-[68px]">
                    <input 
                      type="text" 
                      className="w-full h-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm pr-14" 
                      value={editingMedication.prescribedBy} 
                      onChange={e => setEditingMedication({...editingMedication, prescribedBy: e.target.value})} 
                      placeholder="Prescribed by" 
                    />
                    <UserIcon size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  </div>
                  
                  <div className="relative h-[68px]" ref={datePickerRef}>
                    <div 
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full h-full px-8 py-5 bg-[#fcfdfe] border border-slate-100 rounded-[24px] text-lg font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all shadow-sm cursor-pointer group flex items-center pr-14"
                    >
                      <span className={editingMedication.prescrDate ? 'text-slate-800' : 'text-slate-300'}>
                        {editingMedication.prescrDate || 'Prescription date'}
                      </span>
                      <Calendar size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors pointer-events-none" />
                    </div>
                    {showDatePicker && (
                      <MaterialDatePicker 
                        value={editingMedication.prescrDate} 
                        onChange={(val) => setEditingMedication({...editingMedication, prescrDate: val})} 
                        onClose={() => setShowDatePicker(false)} 
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Medication is currently active</span>
                  <button 
                    type="button"
                    onClick={() => setEditingMedication({...editingMedication, isActive: !editingMedication.isActive})}
                    className={`w-16 h-8 rounded-full transition-all relative shadow-inner ${editingMedication.isActive ? 'bg-[#10b981]' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${editingMedication.isActive ? 'left-9' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-12 pt-12">
                <button 
                  type="button" 
                  onClick={() => setIsEditMedModalOpen(false)} 
                  className="text-emerald-500 font-black uppercase tracking-[0.2em] text-xs hover:text-emerald-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-16 py-6 bg-[#10b981] text-white font-black rounded-full shadow-[0_15px_30px_-5px_rgba(16,185,129,0.3)] hover:bg-[#059669] hover:shadow-[0_15px_35px_-5px_rgba(16,185,129,0.4)] transition-all uppercase tracking-[0.2em] text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};