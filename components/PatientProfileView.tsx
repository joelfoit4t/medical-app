import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  FileText, 
  Copy, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ArrowRight,
  Plus,
  Pill,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Check,
  Activity,
  Archive,
  Menu
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

export const PatientProfileView: React.FC<Props> = ({ patients, selectedId, onBack }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [expandedItems, setExpandedItems] = useState<string[]>(['up-1']);
  
  // Medication filtering
  const [medFilter, setMedFilter] = useState<'All' | 'Active' | 'Inactive'>('Active');
  const [isMedFilterMenuOpen, setIsMedFilterMenuOpen] = useState(false);
  const medFilterRef = useRef<HTMLDivElement>(null);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedId) || patients[0];
  }, [selectedId, patients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (medFilterRef.current && !medFilterRef.current.contains(event.target as Node)) {
        setIsMedFilterMenuOpen(false);
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

  const medications: Medication[] = [
    { id: 'm1', name: 'Amoxicillin', strength: '500mg', dosage: '2 capsules', instructions: 'Mornings only without meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
    { id: 'm2', name: 'Amoxicillin', strength: '500mg', dosage: '1 tablet', instructions: 'Three (3) times a day after meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
    { id: 'm3', name: 'Amoxicillin', strength: '500mg', dosage: '3 tablets', instructions: 'Mornings only after meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
    { id: 'm4', name: 'Amoxicillin', strength: '500mg', dosage: '2 capsules', instructions: 'Evenings only', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
    { id: 'm5', name: 'Amoxicillin', strength: '500mg', dosage: '2 tea spoons', instructions: 'Mornings/evenings after meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
    { id: 'm6', name: 'Amoxicillin', strength: '500mg', dosage: '6 capsules', instructions: '3 times a day after meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
    { id: 'm7', name: 'Ibuprofen', strength: '200mg', dosage: '1 tablet', instructions: 'As needed for pain', prescribedBy: 'Dr. Jane Sully', prescrDate: '15 June, 2023', isActive: false },
  ];

  const filteredMedications = useMemo(() => {
    if (medFilter === 'Active') return medications.filter(m => m.isActive);
    if (medFilter === 'Inactive') return medications.filter(m => !m.isActive);
    return medications;
  }, [medFilter]);

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
              <SlidersHorizontal size={20} />
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
        
        <button className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100">
          <Plus size={18} /> Update medication
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/30">
                <th className="px-6 py-4 w-10 border-r border-slate-200">
                  <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Medication Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Dosage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Instructions</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200">Prescribed by</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 text-center">Prescr. date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMedications.map((med, idx) => (
                <tr key={med.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 border-r border-slate-200">
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
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
                  <td className="px-6 py-5 border-r border-slate-200 text-center">
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
                  <td className="px-6 py-5 text-sm font-bold text-slate-700 border-r border-slate-200 text-center">
                    {med.prescrDate}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
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

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg">Care plans</h3>
            <button className="text-emerald-500 text-sm font-bold flex items-center gap-1 hover:underline transition-all">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Plan name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Due date</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { name: 'Dissguss the benefits of regular exercise & developed a personalized exercise plan', priority: 'Medium', date: '24 April, 2023', status: 'Not yet started' },
                  { name: "Assess the patient's current activity level and any limitations or concerns.", priority: 'Medium', date: '24 April, 2023', status: 'Started', active: true },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 group">
                    <td className="px-6 py-5 text-sm font-semibold text-slate-700 max-w-md">{row.name}</td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{row.priority}</td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{row.date}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1.5 rounded-md text-[11px] font-bold border transition-all ${row.active ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
};