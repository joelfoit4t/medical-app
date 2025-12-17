import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  FileText, 
  Copy, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal,
  ExternalLink,
  ArrowRight,
  Plus
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

interface Props {
  patients: Patient[];
  selectedId: string | null;
  onBack: () => void;
}

export const PatientProfileView: React.FC<Props> = ({ patients, selectedId, onBack }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  // Initialize with the first upcoming item expanded
  const [expandedItems, setExpandedItems] = useState<string[]>(['up-1']);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedId) || patients[0];
  }, [selectedId, patients]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const timelineData: TimelineItem[] = [
    { 
      id: 'up-1', 
      title: 'Diabetic issue re-check', 
      date: '24 May, 2023', 
      problems: 'Urinate often and very hungry from last few days',
      doctor: 'Dr M. Wagner',
      priority: 'Medium',
      caseNo: 'Medex6775',
      type: 'upcoming'
    },
    { 
      id: 'past-1', 
      title: 'Radiotherapy', 
      date: '24 April, 2023',
      problems: 'Standard follow-up for localized treatment area.',
      doctor: 'Dr S. Ray',
      priority: 'High',
      caseNo: 'Rad9920',
      type: 'past' 
    },
    { 
      id: 'past-2', 
      title: 'Chronic disorder', 
      date: '12 March, 2023',
      problems: 'Management of ongoing metabolic concerns.',
      doctor: 'Dr L. Palmer',
      priority: 'Low',
      caseNo: 'Meta1023',
      type: 'past' 
    },
    { 
      id: 'past-3', 
      title: 'Emergency issue', 
      date: '24 May, 2023',
      problems: 'Acute abdominal pain, stabilized upon arrival.',
      doctor: 'Dr A. Reed',
      priority: 'Urgent',
      caseNo: 'ER-5521',
      type: 'past' 
    }
  ];

  const tabs = [
    'Overview', 'Clinical data', 'Medications', 'Care plans', 
    'Patient profile', 'Benefits', 'Relationships', 'Unified health score', 'Schedule'
  ];

  if (!selectedPatient) return <div className="p-8">No patient selected.</div>;

  const upcomingItems = timelineData.filter(item => item.type === 'upcoming');
  const pastItems = timelineData.filter(item => item.type === 'past');

  const renderTimelineItem = (item: TimelineItem, isLast: boolean) => {
    const isExpanded = expandedItems.includes(item.id);

    return (
      <div key={item.id} className="relative pl-8 mb-6 last:mb-0">
        {/* Connection Line */}
        {!isLast && (
          <div className="absolute left-[8px] top-6 bottom-[-24px] w-[1px] bg-slate-100 border-l border-dashed border-slate-300"></div>
        )}
        
        {/* Timeline Dot */}
        <div className={`absolute left-[3px] top-1.5 w-3 h-3 rounded-full border-2 bg-white shadow-sm z-10 transition-colors duration-300 ${isExpanded ? 'border-emerald-500' : 'border-slate-300'}`}></div>

        {/* Item Header */}
        <div className="flex items-center justify-between mb-1">
          <button 
            onClick={() => toggleItem(item.id)}
            className="flex flex-col items-start text-left group"
          >
            <p className={`text-sm font-bold transition-colors ${isExpanded ? 'text-slate-900' : 'text-slate-700 group-hover:text-emerald-500'}`}>
              {item.title}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">{item.date}</p>
          </button>
          <button 
            onClick={() => toggleItem(item.id)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              isExpanded 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-500' 
                : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-500 shadow-sm'
            }`}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="mt-4 bg-[#fcfdfe] border border-emerald-100/50 rounded-2xl p-5 space-y-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Problems</p>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                {item.problems || 'No specific problems noted for this visit.'}
              </p>
            </div>
            <div className="flex justify-between border-t border-slate-50 pt-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assign. doctor</p>
                <p className="text-xs font-bold text-slate-800">{item.doctor || 'TBA'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                <p className={`text-xs font-bold ${item.priority === 'High' || item.priority === 'Urgent' ? 'text-red-500' : 'text-slate-800'}`}>
                  {item.priority || 'Normal'}
                </p>
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

      <div className="p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
        
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Patient Info Header Card */}
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

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 border-t border-slate-100 pt-8">
              {[
                { label: 'Last visits', value: selectedPatient.lastAppointment },
                { label: 'Issue', value: 'Emergency', isBadge: true },
                { label: 'Assigned doctor', value: 'Dr M. Wagner' },
                { label: 'Referring doctor', value: 'Dr R. Green' },
                { label: 'Next Appt.', value: '23 May, 2023' },
                { label: 'Family doctor', value: 'Dr G. Mclar' }
              ].map((item, idx) => (
                <div key={idx} className={`${idx !== 5 ? 'border-r border-slate-100' : ''} pr-4 last:border-0`}>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
                  <p className={`text-sm font-bold truncate ${item.isBadge ? 'text-slate-900 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100' : 'text-slate-800'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Care Plans Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">Care plans</h3>
              <button className="text-emerald-500 text-sm font-bold flex items-center gap-1 hover:underline transition-all">
                View all <ArrowRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Plan name</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Due date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Dissguss the benefits of regular exercise & developed a personalized exercise plan', priority: 'Medium', date: '24 April, 2023', status: 'Not yet started' },
                    { name: "Assess the patient's current activity level and any limitations or concerns.", priority: 'Medium', date: '24 April, 2023', status: 'Started', active: true },
                    { name: 'Dissguss the benefits of regular exercise & developed a personalized exercise plan', priority: 'Medium', date: '24 April, 2023', status: 'Started', active: true }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 group">
                      <td className="px-6 py-5 text-sm font-semibold text-slate-700 max-w-md">{row.name}</td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-600">{row.priority}</td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-600">{row.date}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1.5 rounded-md text-[11px] font-bold border transition-all ${
                          row.active 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
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
          
          {/* Timeline Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Timeline</h3>
              <button className="text-emerald-500 text-sm font-bold flex items-center gap-1 hover:underline transition-all">
                View all <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-4 relative">
              {/* Upcoming Header Section */}
              <div className="space-y-6">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Upcoming</p>
                {upcomingItems.map((item, index) => renderTimelineItem(item, false))}
              </div>

              {/* Past Header Section */}
              <div className="space-y-6 pt-4">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Past</p>
                {pastItems.map((item, index) => renderTimelineItem(item, index === pastItems.length - 1))}
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-slate-800 text-lg">Actions</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-[0.98]">
                <Plus size={18} /> Add New Entry
              </button>
              <button className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-[0.98]">
                <ExternalLink size={18} /> Referral Center
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};