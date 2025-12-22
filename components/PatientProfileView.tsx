import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  ChevronRight, 
  Plus,
  Pill,
  MoreHorizontal,
  Activity,
  Archive,
  Pencil,
  Trash2,
  Calendar,
  User as UserIcon,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  Scale,
  Search,
  X,
  Beaker,
  FileUp,
  Eye,
  List as ListIcon,
  LayoutGrid,
  Target,
  Info,
  History as HistoryIcon,
  SlidersHorizontal,
  Clock,
  // Fix: Added missing Download icon import
  Download
} from 'lucide-react';
import { Patient, Language, PatientStatus } from '../types';
import { useTranslation } from '../i18n/translations';

// Declare CKEditor as a global from the CDN
declare const ClassicEditor: any;

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

interface VitalReading {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'elevated' | 'critical';
  icon: any;
  timestamp: string;
}

interface VitalsHistoryEntry {
  date: string;
  time: string;
  hr: string;
  bp: string;
  temp: string;
  rr: string;
  spo2: string;
  weight: string;
}

interface LabReport {
  id: string;
  title: string;
  date: string;
  category: string;
  doctor: string;
  status: 'Normal' | 'Abnormal' | 'Critical' | 'Pending';
  result: string;
  unit?: string;
  referenceRange?: string;
  findings?: string;
}

interface EvaluationNote {
  id: string;
  content: string;
  date: string;
  doctor: string;
  doctorAvatar: string;
  timestamp: number;
}

interface Props {
  patients: Patient[];
  selectedId: string | null;
  onBack: () => void;
  language: Language;
  onPatientSelect?: (id: string) => void;
}

const INITIAL_MEDICATIONS: Medication[] = [
  { id: '100-M', name: 'Amoxicillin', strength: '500MG', dosage: '2 capsules', instructions: 'Mornings only without meal', prescribedBy: 'Dr. Jane Sully', prescrDate: '23 July, 2023', isActive: true },
  { id: '101-M', name: 'Lisinopril', strength: '10MG', dosage: '1 tablet', instructions: 'Once daily in the morning', prescribedBy: 'Dr. Clara Redfield', prescrDate: '15 April, 2024', isActive: true },
  { id: '102-M', name: 'Metformin', strength: '500MG', dosage: '1 tablet', instructions: 'Twice daily with meals', prescribedBy: 'Dr. Mike Wagner', prescrDate: '10 January, 2024', isActive: true },
];

const CURRENT_USER = {
  name: 'Dr. Clara Redfield',
  avatar: 'https://picsum.photos/id/64/100/100'
};

export const PatientProfileView: React.FC<Props> = ({ patients, selectedId, onBack, language, onPatientSelect }) => {
  const tabs = ['Overview', 'Medications', 'Care plan', 'Labs'];
  const [activeTab, setActiveTab] = useState('Care plan');
  const [queueSearchQuery, setQueueSearchQuery] = useState('');
  const [isLogVitalsModalOpen, setIsLogVitalsModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<LabReport | null>(null);
  const [labViewMode, setLabViewMode] = useState<'grid' | 'list'>('grid');
  const [vitalsViewMode, setVitalsViewMode] = useState<'list' | 'grid'>('list');
  
  const [currentVitals] = useState<VitalReading[]>([
    { label: 'HEART RATE', value: '72', unit: 'BPM', status: 'normal', icon: Heart, timestamp: '2 hours ago' },
    { label: 'BLOOD PRESSURE', value: '118/76', unit: 'MMHG', status: 'normal', icon: Activity, timestamp: '2 hours ago' },
    { label: 'TEMPERATURE', value: '36.8', unit: '°C', status: 'normal', icon: Thermometer, timestamp: '2 hours ago' },
    { label: 'RESPIRATORY RATE', value: '14', unit: 'BPM', status: 'normal', icon: Wind, timestamp: '4 hours ago' },
    { label: 'OXYGEN SATURATION', value: '98', unit: '%', status: 'normal', icon: Droplets, timestamp: '2 hours ago' },
    { label: 'WEIGHT', value: '74.5', unit: 'KG', status: 'normal', icon: Scale, timestamp: 'Last visit' },
  ]);

  const [vitalsHistory, setVitalsHistory] = useState<VitalsHistoryEntry[]>([
    { date: '12 May, 2025', time: '09:45 AM', hr: '74', bp: '120/80', temp: '36.7', rr: '16', spo2: '99', weight: '74.2' },
    { date: '10 May, 2025', time: '10:15 AM', hr: '76', bp: '122/82', temp: '36.9', rr: '18', spo2: '98', weight: '74.5' },
    { date: '05 May, 2025', time: '02:30 PM', hr: '72', bp: '118/76', temp: '36.6', rr: '14', spo2: '98', weight: '74.8' },
  ]);

  const [vitalInputs, setVitalInputs] = useState({ hr: '', bp: '', temp: '', rr: '', spo2: '', weight: '' });

  const [evaluations, setEvaluations] = useState<EvaluationNote[]>([
    { 
      id: '1', 
      content: 'Patient reports improvement in cardiovascular stamina. BP remains steady at 120/80.', 
      date: '12 May, 2025', 
      doctor: 'Dr. Clara Redfield', 
      doctorAvatar: CURRENT_USER.avatar,
      timestamp: 1715494400000 
    },
    { 
      id: '2', 
      content: 'Initial visit. Patient presented with mild tachycardia. Advised ECG and follow-up.', 
      date: '05 May, 2025', 
      doctor: 'Dr. Clara Redfield', 
      doctorAvatar: CURRENT_USER.avatar,
      timestamp: 1714889600000 
    }
  ]);
  const [currentEvalContent, setCurrentEvalContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  
  const editorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const isInitializingRef = useRef(false);
  const t = useTranslation(language);

  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [medFilter, setMedFilter] = useState<'All' | 'Active' | 'Inactive'>('Active');
  const [isMedFilterMenuOpen, setIsMedFilterMenuOpen] = useState(false);
  const [activeActionMedId, setActiveActionMedId] = useState<string | null>(null);
  const [isEditMedModalOpen, setIsEditMedModalOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id' | 'isActive'>>({ name: '', strength: '', dosage: '', instructions: '', prescribedBy: '', prescrDate: '' });

  const medFilterRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const selectedPatient = useMemo(() => patients.find(p => p.id === selectedId) || patients[0], [selectedId, patients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (medFilterRef.current && !medFilterRef.current.contains(event.target as Node)) setIsMedFilterMenuOpen(false);
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) setActiveActionMedId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // CKEditor Initialization with robust double-init protection
  useEffect(() => {
    let localEditor: any = null;
    
    if (editorContainerRef.current && typeof ClassicEditor !== 'undefined' && activeTab === 'Care plan') {
      if (isInitializingRef.current || editorRef.current) return;

      isInitializingRef.current = true;
      ClassicEditor
        .create(editorContainerRef.current, {
          toolbar: ['heading', '|', 'bold', 'italic', 'link', 'blockQuote', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
            ]
          }
        })
        .then((editor: any) => {
          localEditor = editor;
          editorRef.current = editor;
          editor.setData(currentEvalContent);
          editor.model.document.on('change:data', () => {
            setCurrentEvalContent(editor.getData());
          });
          isInitializingRef.current = false;
        })
        .catch((error: any) => {
          console.error('CKEditor error:', error);
          isInitializingRef.current = false;
        });
    }

    return () => {
      if (localEditor) {
        localEditor.destroy().then(() => {
          if (editorRef.current === localEditor) {
            editorRef.current = null;
          }
        });
      }
    };
  }, [activeTab]);

  const handleEditMedication = (med: Medication) => { setEditingMedication({ ...med }); setIsEditMedModalOpen(true); setActiveActionMedId(null); };
  const handleSaveMedication = (e: React.FormEvent) => { e.preventDefault(); if (editingMedication) { setMedications(prev => prev.map(m => m.id === editingMedication.id ? editingMedication : m)); setIsEditMedModalOpen(false); setEditingMedication(null); } };
  const handleAddMedication = (e: React.FormEvent) => { e.preventDefault(); const medication: Medication = { ...newMedication, id: `${100 + medications.length}-M`, isActive: true, prescrDate: newMedication.prescrDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }; setMedications(prev => [medication, ...prev]); setIsAddMedModalOpen(false); setNewMedication({ name: '', strength: '', dosage: '', instructions: '', prescribedBy: '', prescrDate: '' }); };

  const handleSaveNotes = () => {
    if (!currentEvalContent.trim()) return;
    setIsSavingNotes(true);
    setTimeout(() => {
      if (editingNoteId) {
        setEvaluations(prev => prev.map(e => e.id === editingNoteId ? { ...e, content: currentEvalContent } : e));
      } else {
        const newNote: EvaluationNote = {
          id: Math.random().toString(36).substring(7),
          content: currentEvalContent,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          doctor: CURRENT_USER.name,
          doctorAvatar: CURRENT_USER.avatar,
          timestamp: Date.now()
        };
        setEvaluations(prev => [newNote, ...prev]);
      }
      setIsSavingNotes(false);
      setCurrentEvalContent('');
      setEditingNoteId(null);
      if (editorRef.current) editorRef.current.setData('');
    }, 800);
  };

  const handleEditNote = (note: EvaluationNote) => {
    setEditingNoteId(note.id);
    setCurrentEvalContent(note.content);
    if (editorRef.current) editorRef.current.setData(note.content);
    editorContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteNote = (id: string) => {
    setEvaluations(prev => prev.filter(e => e.id !== id));
  };

  const handleLogVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const currentEntry: VitalsHistoryEntry = {
        date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        hr: vitalInputs.hr || '72',
        bp: vitalInputs.bp || '120/80',
        temp: vitalInputs.temp || '36.8',
        rr: vitalInputs.rr || '14',
        spo2: vitalInputs.spo2 || '98',
        weight: vitalInputs.weight || '74.5'
    };
    setVitalsHistory(prev => [currentEntry, ...prev]);
    setIsLogVitalsModalOpen(false);
    setVitalInputs({ hr: '', bp: '', temp: '', rr: '', spo2: '', weight: '' });
  };

  const renderMedicationsTab = () => {
    const filteredMeds = medications.filter(m => {
      if (medFilter === 'Active') return m.isActive;
      if (medFilter === 'Inactive') return !m.isActive;
      return true;
    });

    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex items-center justify-between bg-white px-8 py-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Current Medications</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Prescription and dosage log</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={medFilterRef}>
              <button 
                onClick={() => setIsMedFilterMenuOpen(!isMedFilterMenuOpen)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${isMedFilterMenuOpen ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <SlidersHorizontal size={16} /> {medFilter}
              </button>
              {isMedFilterMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1">
                  {['All', 'Active', 'Inactive'].map((f) => (
                    <button
                      key={f}
                      onClick={() => { setMedFilter(f as any); setIsMedFilterMenuOpen(false); }}
                      className={`w-full text-left px-5 py-3 text-xs font-bold transition-all ${medFilter === f ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsAddMedModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"
            >
              <Plus size={16} strokeWidth={3} /> ADD MEDICATION
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Strength</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosage</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prescribed By</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMeds.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <Pill size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{med.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{med.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{med.strength}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{med.dosage}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-500">{med.prescribedBy}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${med.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {med.isActive ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <button 
                      onClick={() => setActiveActionMedId(activeActionMedId === med.id ? null : med.id)}
                      className="text-slate-300 hover:text-slate-600 transition-colors"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    {activeActionMedId === med.id && (
                      <div ref={actionMenuRef} className="absolute right-8 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1">
                        <button onClick={() => handleEditMedication(med)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                          <Pencil size={14} /> Edit Dosage
                        </button>
                        <button onClick={() => {
                          setMedications(prev => prev.map(m => m.id === med.id ? {...m, isActive: !m.isActive} : m));
                          setActiveActionMedId(null);
                        }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                          <Archive size={14} /> {med.isActive ? 'Archive' : 'Restore'}
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
    );
  };

  const renderCarePlansTab = () => (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 h-full">
      {/* Patient Sidebar */}
      <div className="w-full lg:w-80 shrink-0 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm max-h-[calc(100vh-200px)] sticky top-20">
        <div className="p-6 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={queueSearchQuery}
              onChange={(e) => setQueueSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {patients.filter(p => p.name.toLowerCase().includes(queueSearchQuery.toLowerCase())).map((p) => (
            <div 
              key={p.id} 
              onClick={() => onPatientSelect?.(p.id)}
              className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border-2 ${
                selectedId === p.id ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-transparent hover:bg-slate-50'
              }`}
            >
              <img src={p.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
              <div className="min-w-0">
                <p className={`text-sm font-black truncate ${selectedId === p.id ? 'text-emerald-900' : 'text-slate-800'}`}>{p.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation Content */}
      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Evaluation</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ongoing clinical monitoring</p>
          </div>
          <button 
            onClick={() => setIsLogVitalsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"
          >
            <Plus size={16} strokeWidth={3} /> LOG VITALS
          </button>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentVitals.map((vital, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-[32px] border shadow-sm group hover:border-emerald-200 transition-all ${idx === 3 ? 'border-emerald-300 ring-1 ring-emerald-50' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <vital.icon size={24} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{vital.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-800 tracking-tighter">{vital.value}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{vital.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vitals History Log Section */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                 <HistoryIcon size={20} />
               </div>
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Vitals History Log</h4>
             </div>
             
             <div className="flex bg-slate-100 p-1 rounded-xl">
               <button onClick={() => setVitalsViewMode('list')} className={`p-2 rounded-lg transition-all ${vitalsViewMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon size={18} /></button>
               <button onClick={() => setVitalsViewMode('grid')} className={`p-2 rounded-lg transition-all ${vitalsViewMode === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={18} /></button>
             </div>
          </div>

          <div className="overflow-hidden">
            {vitalsViewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Time</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">HR</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">BP</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Temp</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">RR</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SpO2</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vitalsHistory.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-xs font-black text-slate-800">{h.date}</p>
                          <p className="text-[10px] font-bold text-slate-400">{h.time}</p>
                        </td>
                        <td className="px-8 py-5 text-center text-xs font-bold text-slate-600">{h.hr}</td>
                        <td className="px-8 py-5 text-center text-xs font-bold text-slate-600">{h.bp}</td>
                        <td className="px-8 py-5 text-center text-xs font-bold text-slate-600">{h.temp}°</td>
                        <td className="px-8 py-5 text-center text-xs font-bold text-slate-600">{h.rr}</td>
                        <td className="px-8 py-5 text-center text-xs font-bold text-slate-600">{h.spo2}%</td>
                        <td className="px-8 py-5 text-center text-xs font-bold text-slate-600">{h.weight}kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                {vitalsHistory.map((h, i) => (
                  <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-[24px] p-6 hover:border-emerald-200 transition-all group shadow-sm">
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-white">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-emerald-50 shadow-sm border border-slate-50"><Calendar size={16} /></div>
                          <div><p className="text-xs font-black text-slate-800">{h.date}</p><p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10} /> {h.time}</p></div>
                       </div>
                       <button className="text-slate-300 hover:text-slate-500"><Info size={16} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                       {[ {l:'Heart Rate',v:h.hr,u:'BPM'}, {l:'Blood Pressure',v:h.bp,u:'mmHg'}, {l:'Temp',v:h.temp,u:'C'}, {l:'Resp Rate',v:h.rr,u:'BPM'}, {l:'Oxygen',v:h.spo2,u:'SpO2'}, {l:'Weight',v:h.weight,u:'KG'} ].map((item, idx)=>(
                          <div key={idx} className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.l}</p>
                            <p className="text-sm font-black text-slate-700">{item.v}{idx===2?'°':''} <span className="text-[10px] text-slate-400 font-bold uppercase">{item.u}</span></p>
                          </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Notes Input Area */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[450px]">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-black text-slate-800 tracking-tight text-sm">Evaluation Notes</h4>
            <button 
              onClick={handleSaveNotes} 
              disabled={isSavingNotes || !currentEvalContent.trim()} 
              className="px-10 py-3 bg-[#10b981] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-[#059669] transition-all disabled:opacity-50"
            >
              {isSavingNotes ? 'SAVING...' : editingNoteId ? 'UPDATE ENTRY' : 'SAVE ENTRY'}
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
              <img src={CURRENT_USER.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
              <span className="text-sm font-bold text-slate-500">{CURRENT_USER.name}</span>
            </div>
            <div ref={editorContainerRef} className="flex-1"></div>
          </div>
        </div>

        {/* Notes Log - Refined styling for natural icon colors (Blue for edit, Red for delete) */}
        <div className="space-y-8 pb-20">
          {evaluations.map(e => (
            <div key={e.id} className="bg-white rounded-[40px] border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] p-10 group transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                  <img src={e.doctorAvatar} alt={e.doctor} className="w-12 h-12 rounded-full object-cover border-2 border-slate-50 shadow-sm" />
                  <div>
                    <p className="text-base font-bold text-slate-800 leading-tight">{e.doctor}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{e.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <button 
                    onClick={() => handleEditNote(e)} 
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="Edit Note"
                  >
                    <Pencil size={20} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(e.id)} 
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <div className="h-px bg-slate-50 w-full mb-8" />
              <div 
                className="text-sm text-slate-600 font-medium leading-relaxed prose prose-slate max-w-none px-1" 
                dangerouslySetInnerHTML={{ __html: e.content }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const groupedLabs = useMemo(() => {
    const groups: { [key: string]: LabReport[] } = {};
    const labs: LabReport[] = [
      { id: '1', title: 'Full Blood Count', date: '12 May, 2025', category: 'Hematology', doctor: 'Dr. Clara Redfield', status: 'Normal', result: '14.2 g/dL', unit: 'g/dL', referenceRange: '13.5 - 17.5', findings: 'All indicators within normal range.' },
      { id: '2', title: 'Lipid Profile', date: '05 Mar, 2025', category: 'Biochemistry', doctor: 'Dr. Clara Redfield', status: 'Abnormal', result: '240 mg/dL', unit: 'mg/dL', referenceRange: '< 200', findings: 'Elevated cholesterol levels.' },
      { id: '3', title: 'Vitamin D Test', date: '10 Jan, 2025', category: 'Biochemistry', doctor: 'Dr. Mike Wagner', status: 'Normal', result: '32 ng/mL', findings: 'Sufficient levels detected.' },
      { id: '4', title: 'Kidney Function Test', date: '15 Dec, 2024', category: 'Biochemistry', doctor: 'Dr. Mike Wagner', status: 'Normal', result: '92 mL/min', findings: 'Creatinine levels optimal.' },
      { id: '5', title: 'Blood Glucose (A1C)', date: '10 Nov, 2024', category: 'Endocrinology', doctor: 'Dr. Clara Redfield', status: 'Normal', result: '5.4%', findings: 'Excellent long-term glucose control.' },
      { id: '6', title: 'Liver Function Test', date: '05 Sep, 2024', category: 'Biochemistry', doctor: 'Dr. Mike Wagner', status: 'Normal', result: '22 U/L', findings: 'Hepatic enzymes are within range.' },
      { id: '7', title: 'Thyroid Panel', date: '20 Jul, 2023', category: 'Endocrinology', doctor: 'Dr. Clara Redfield', status: 'Normal', result: '2.1 uIU/mL', findings: 'TSH within normal range.' },
      { id: '8', title: 'Urinalysis', date: '15 Apr, 2023', category: 'Urology', doctor: 'Dr. Mike Wagner', status: 'Normal', result: 'Neg', findings: 'No anomalies detected.' },
      { id: '9', title: 'Basic Metabolic Panel', date: '05 Jan, 2023', category: 'Biochemistry', doctor: 'Dr. Mike Wagner', status: 'Normal', result: '98 mg/dL', findings: 'Electrolytes and glucose stable.' },
    ];
    labs.forEach(lab => {
      const year = lab.date.split(', ')[1] || '2025';
      if (!groups[year]) groups[year] = [];
      groups[year].push(lab);
    });
    return groups;
  }, []);

  const renderLabsTab = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between bg-white px-8 py-6 rounded-[32px] border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Laboratory Reports</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Diagnostic history timeline</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button onClick={() => setLabViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${labViewMode === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={20} /></button>
            <button onClick={() => setLabViewMode('list')} className={`p-2.5 rounded-xl transition-all ${labViewMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon size={20} /></button>
          </div>
          <button onClick={() => {}} className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"><FileUp size={16} /> Upload Report</button>
        </div>
      </div>
      <div className="space-y-12">
        {(Object.entries(groupedLabs) as [string, LabReport[]][]).sort((a, b) => b[0].localeCompare(a[0])).map(([year, labs]) => (
          <div key={year} className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full">{year}</span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
            {labViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {labs.map((lab) => (
                  <div key={lab.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden group hover:border-emerald-300 transition-all flex flex-col">
                    <div className="p-8 space-y-6 flex-1">
                      <div className="flex items-start justify-between">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${lab.status === 'Normal' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}><Beaker size={24} /></div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${lab.status === 'Normal' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-red-100/50 text-red-700'}`}>{lab.status}</span>
                      </div>
                      <h4 className="text-xl font-black text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">{lab.title}</h4>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Result</p><p className="text-sm font-black text-slate-800">{lab.result}</p></div>
                        <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ref. Range</p><p className="text-sm font-black text-slate-800">{lab.referenceRange || 'N/A'}</p></div>
                      </div>
                    </div>
                    <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2"><img src={`https://i.pravatar.cc/150?u=${lab.doctor.replace(/\s+/g, '')}`} className="w-6 h-6 rounded-full grayscale opacity-50" alt="" /><span className="text-[10px] font-bold text-slate-500">{lab.doctor}</span></div>
                      <div className="flex items-center gap-2"><button onClick={() => setViewingReport(lab)} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-lg transition-all"><Eye size={18} /></button><button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-lg transition-all"><Download size={18} /></button></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Title</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Result</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Physician</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {labs.map((lab) => (
                      <tr key={lab.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-5 text-sm font-bold text-slate-400">{lab.date}</td>
                        <td className="px-8 py-5"><p className="text-sm font-black text-slate-800">{lab.title}</p></td>
                        <td className="px-8 py-5 text-sm font-black text-slate-800">{lab.result}</td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-500">{lab.doctor}</td>
                        <td className="px-8 py-5"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${lab.status === 'Normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{lab.status}</span></td>
                        <td className="px-8 py-5 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => setViewingReport(lab)} className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"><Eye size={18} /></button><button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"><Download size={18} /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-full bg-[#fcfcfc]">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
        <button onClick={onBack} className="p-2 hover:bg-emerald-50 rounded-lg text-slate-400 border border-slate-200 transition-all active:scale-95 group">
          <ArrowLeft size={18} className="group-hover:text-emerald-500 transition-colors" />
        </button>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-slate-400">Patient data</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-800 font-bold">{selectedPatient.name}</span>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 px-6 overflow-x-auto sticky top-[65px] z-20 shadow-sm">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold whitespace-nowrap transition-all border-b-4 normal-case ${
                activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto w-full">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in duration-500">
             <div className="xl:col-span-8 space-y-8">
               <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="w-32 h-32 bg-emerald-50 rounded-[48px] flex items-center justify-center text-emerald-50 text-4xl font-black shadow-inner">
                   {selectedPatient.name.charAt(0)}
                 </div>
                 <div className="flex-1 text-center md:text-left">
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                     <h2 className="text-4xl font-black text-slate-900 tracking-tight">{selectedPatient.name}</h2>
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                       selectedPatient.status === PatientStatus.Stable ? 'bg-emerald-50 text-emerald-600' :
                       selectedPatient.status === PatientStatus.Mild ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                     }`}>
                       {selectedPatient.status}
                     </span>
                   </div>
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                     <span className="flex items-center gap-2"><UserIcon size={14} className="text-emerald-500" /> {selectedPatient.gender}</span>
                     <span className="flex items-center gap-2"><Calendar size={14} className="text-emerald-500" /> {selectedPatient.age} Y/O</span>
                     <span className="flex items-center gap-2"><Target size={14} className="text-emerald-500" /> {selectedPatient.diagnosis}</span>
                   </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="w-12 h-12 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all"><Phone size={20} /></button>
                    <button className="w-12 h-12 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all"><MessageSquare size={20} /></button>
                 </div>
               </div>
               <div className="grid grid-cols-3 gap-6">
                  {currentVitals.slice(0,3).map((v, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{v.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-800">{v.value}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{v.unit}</span>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
             <div className="xl:col-span-4 space-y-6">
                <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                   <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-6">Patient Health Summary</h3>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                           <span className="text-xs font-bold text-slate-400">UNIFIED SCORE</span>
                           <span className="text-lg font-black text-emerald-400">82%</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                           <span className="text-xs font-bold text-slate-400">RISK CATEGORY</span>
                           <span className="text-lg font-black text-amber-400">MODERATE</span>
                        </div>
                     </div>
                   </div>
                   <Activity size={120} className="absolute -right-8 -bottom-8 text-white/5" />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Medications' && renderMedicationsTab()}
        {activeTab === 'Care plan' && renderCarePlansTab()}
        {activeTab === 'Labs' && renderLabsTab()}

        {!['Overview', 'Medications', 'Care plan', 'Labs'].includes(activeTab) && (
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-32 text-center flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
              <Activity size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{activeTab}</h3>
            <p className="text-slate-500 mt-2 font-medium">This section is currently being updated for clinical consistency.</p>
          </div>
        )}
      </div>

      {/* Log Vitals Modal */}
      {isLogVitalsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsLogVitalsModalOpen(false)} />
          <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 p-12 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <h2 className="text-4xl font-black text-slate-800 mb-10">Log Vitals</h2>
            <form onSubmit={handleLogVitalsSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Heart Rate" 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                  value={vitalInputs.hr} onChange={e => setVitalInputs({...vitalInputs, hr: e.target.value})} 
                />
                <input 
                  type="text" placeholder="Blood Pressure" 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                  value={vitalInputs.bp} onChange={e => setVitalInputs({...vitalInputs, bp: e.target.value})} 
                />
                <input 
                  type="text" placeholder="Temperature" 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                  value={vitalInputs.temp} onChange={e => setVitalInputs({...vitalInputs, temp: e.target.value})} 
                />
                <input 
                  type="text" placeholder="Respiratory Rate" 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                  value={vitalInputs.rr} onChange={e => setVitalInputs({...vitalInputs, rr: e.target.value})} 
                />
                <input 
                  type="text" placeholder="Oxygen Saturation" 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                  value={vitalInputs.spo2} onChange={e => setVitalInputs({...vitalInputs, spo2: e.target.value})} 
                />
                <input 
                  type="text" placeholder="Weight" 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                  value={vitalInputs.weight} onChange={e => setVitalInputs({...vitalInputs, weight: e.target.value})} 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-6 bg-[#10b981] text-white font-black rounded-full hover:bg-[#059669] shadow-xl shadow-emerald-200/50 transition-all uppercase tracking-[0.2em] text-sm mt-4"
              >
                SAVE VITALS
              </button>
              <button 
                type="button" 
                onClick={() => setIsLogVitalsModalOpen(false)}
                className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-6 hover:text-slate-600"
              >
                Cancel Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lab Report Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setViewingReport(null)} />
          <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10">
            <div className={`p-12 text-white ${viewingReport.status === 'Normal' ? 'bg-[#10b981]' : 'bg-red-500'}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-black tracking-tight">{viewingReport.title}</h2>
                <button onClick={() => setViewingReport(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <p className="text-white/80 font-bold uppercase tracking-widest text-xs">{viewingReport.category} • {viewingReport.date}</p>
            </div>
            <div className="p-12 space-y-10">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Clinical Result</p>
                  <p className="text-4xl font-black text-slate-800">{viewingReport.result} <span className="text-lg text-slate-400 font-bold">{viewingReport.unit || ''}</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Requesting Physician</p>
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/150?u=${viewingReport.doctor.replace(/\s+/g, '')}`} className="w-10 h-10 rounded-full shadow-sm" alt="" />
                    <p className="text-sm font-black text-slate-700">{viewingReport.doctor}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Diagnostic Interpretation</p>
                <p className="text-slate-600 font-medium leading-relaxed">{viewingReport.findings || 'No specific findings documented.'}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => {}} className="flex-1 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><Eye size={16} /> Download Report</button>
                <button onClick={() => setViewingReport(null)} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-full hover:bg-slate-200 transition-all uppercase tracking-widest text-[11px]">Close Preview</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medication Modal */}
      {isEditMedModalOpen && editingMedication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsEditMedModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
            <div className="bg-[#10b981] p-10 text-white">
              <h2 className="text-3xl font-black tracking-tight">Edit Medication</h2>
              <p className="text-emerald-50 text-sm font-medium mt-1">Adjust prescription for {editingMedication.name}</p>
            </div>
            <form onSubmit={handleSaveMedication} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strength</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800" value={editingMedication.strength} onChange={e => setEditingMedication({...editingMedication, strength: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dosage</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800" value={editingMedication.dosage} onChange={e => setEditingMedication({...editingMedication, dosage: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instructions</label>
                <textarea rows={2} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 resize-none" value={editingMedication.instructions} onChange={e => setEditingMedication({...editingMedication, instructions: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-[2] py-4 bg-[#10b981] text-white font-black rounded-full hover:bg-[#059669] transition-all uppercase tracking-widest text-[11px]">Save Changes</button>
                <button type="button" onClick={() => setIsEditMedModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-full hover:bg-slate-200 transition-all uppercase tracking-widest text-[11px]">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {isAddMedModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsAddMedModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
            <div className="bg-[#10b981] p-10 text-white">
              <h2 className="text-3xl font-black tracking-tight">New Prescription</h2>
              <p className="text-emerald-50 text-sm font-medium mt-1">Add a new medication to the patient record.</p>
            </div>
            <form onSubmit={handleAddMedication} className="p-10 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medication Name</label>
                <input type="text" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800" value={newMedication.name} onChange={e => setNewMedication({...newMedication, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strength</label>
                  <input type="text" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800" value={newMedication.strength} onChange={e => setNewMedication({...newMedication, strength: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dosage</label>
                  <input type="text" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800" value={newMedication.dosage} onChange={e => setNewMedication({...newMedication, dosage: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prescribed By</label>
                <input type="text" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800" value={newMedication.prescribedBy} onChange={e => setNewMedication({...newMedication, prescribedBy: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-[2] py-4 bg-[#10b981] text-white font-black rounded-full hover:bg-[#059669] transition-all uppercase tracking-widest text-[11px]">Add Medication</button>
                <button type="button" onClick={() => setIsAddMedModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-full hover:bg-slate-200 transition-all uppercase tracking-widest text-[11px]">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};