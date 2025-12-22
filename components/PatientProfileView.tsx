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
  Plus,
  Pill,
  MoreHorizontal,
  Check,
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
  TrendingUp,
  TrendingDown,
  StickyNote,
  Search,
  History,
  X,
  RefreshCcw,
  Microscope,
  Download,
  AlertTriangle,
  Beaker,
  FileUp,
  Eye,
  List as ListIcon,
  LayoutGrid,
  Target,
  ShieldCheck,
  Info
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
  trend: 'up' | 'down' | 'stable';
  timestamp: string;
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

const MaterialDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}> = ({ value, onChange, onClose }) => {
  const initialDate = useMemo(() => {
    if (!value || value === 'Prescription date' || value === 'Select Date') return new Date();
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [value]);

  const [viewDate, setViewDate] = useState(initialDate);
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const days = useMemo(() => {
    const dCount = daysInMonth(viewDate.getMonth(), viewDate.getFullYear());
    const startDay = startDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
    const prevMonthDays = daysInMonth(viewDate.getMonth() - 1, viewDate.getFullYear());
    
    const arr = [];
    for (let i = startDay - 1; i >= 0; i--) arr.push({ day: prevMonthDays - i, current: false, date: new Date(year, viewDate.getMonth() - 1, prevMonthDays - i) });
    for (let i = 1; i <= dCount; i++) arr.push({ day: i, current: true, date: new Date(year, viewDate.getMonth(), i) });
    const total = 42;
    const remaining = total - arr.length;
    for (let i = 1; i <= remaining; i++) arr.push({ day: i, current: false, date: new Date(year, viewDate.getMonth() + 1, i) });
    return arr;
  }, [viewDate, year]);

  return (
    <div className="absolute bottom-full right-0 mb-4 bg-white rounded-3xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 z-[150] w-[300px] p-6 animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
      <div className="flex items-center justify-between mb-6">
        <button type="button" className="text-sm font-black text-[#1e293b] uppercase tracking-wider">{monthName} {year}</button>
        <div className="flex gap-2">
          <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><ChevronLeft size={18} /></button>
          <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center mb-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[10px] font-black text-slate-300 py-1 uppercase tracking-tighter">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1.5">
        {days.map((item, idx) => {
          const isToday = item.date.toDateString() === new Date().toDateString();
          const isSelected = value === item.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
          return (
            <button key={idx} type="button" onClick={() => { onChange(item.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })); onClose(); }} className={`h-9 w-9 rounded-full text-[12px] font-bold transition-all mx-auto flex items-center justify-center ${!item.current ? 'text-slate-200' : isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'} ${isToday && !isSelected ? 'text-emerald-500 border border-emerald-100' : ''}`}>{item.day}</button>
          );
        })}
      </div>
    </div>
  );
};

export const PatientProfileView: React.FC<Props> = ({ patients, selectedId, onBack, language, onPatientSelect }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [queueSearchQuery, setQueueSearchQuery] = useState('');
  const [isLogVitalsModalOpen, setIsLogVitalsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<LabReport | null>(null);
  const [labViewMode, setLabViewMode] = useState<'grid' | 'list'>('grid');
  
  const [currentVitals, setCurrentVitals] = useState<VitalReading[]>([
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', icon: Heart, trend: 'stable', timestamp: '2 hours ago' },
    { label: 'Blood Pressure', value: '118/76', unit: 'mmHg', status: 'normal', icon: Activity, trend: 'down', timestamp: '2 hours ago' },
    { label: 'Temperature', value: '36.8', unit: '°C', status: 'normal', icon: Thermometer, trend: 'stable', timestamp: '2 hours ago' },
    { label: 'Respiratory Rate', value: '14', unit: 'bpm', status: 'normal', icon: Wind, trend: 'up', timestamp: '4 hours ago' },
    { label: 'Oxygen Saturation', value: '98', unit: '%', status: 'normal', icon: Droplets, trend: 'stable', timestamp: '2 hours ago' },
    { label: 'Weight', value: '74.5', unit: 'kg', status: 'elevated', icon: Scale, trend: 'up', timestamp: 'Last visit' },
  ]);

  const [vitalsHistory, setVitalsHistory] = useState([
    { date: '12 May, 2025', time: '09:45 AM', hr: '74', bp: '120/80', temp: '36.7', rr: '16', spo2: '99', weight: '74.2' },
    { date: '10 May, 2025', time: '10:15 AM', hr: '76', bp: '122/82', temp: '36.9', rr: '18', spo2: '98', weight: '74.5' },
    { date: '05 May, 2025', time: '02:30 PM', hr: '72', bp: '118/76', temp: '36.6', rr: '14', spo2: '98', weight: '74.8' },
  ]);

  const [vitalInputs, setVitalInputs] = useState({ hr: '', bp: '', temp: '', spo2: '', rr: '', weight: '' });

  const [evaluations, setEvaluations] = useState<EvaluationNote[]>([
    { id: '1', content: '<p>Patient reports improvement in cardiovascular stamina. BP remains steady at 120/80.</p>', date: '12 May, 2025', doctor: 'Dr. Clara Redfield', timestamp: 1715494400000 },
    { id: '2', content: '<p>Initial visit. Patient presented with mild tachycardia. Advised ECG and follow-up.</p>', date: '05 May, 2025', doctor: 'Dr. Clara Redfield', timestamp: 1714889600000 }
  ]);
  const [currentEvalContent, setCurrentEvalContent] = useState('');
  const [evalDoctorName, setEvalDoctorName] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  
  const editorRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const t = useTranslation(language);

  const groupedLabs = useMemo(() => {
    const groups: { [key: string]: LabReport[] } = {};
    const labs: LabReport[] = [
      { id: '1', title: 'Full Blood Count', date: '12 May, 2025', category: 'Hematology', doctor: 'Dr. Clara Redfield', status: 'Normal', result: '14.2 g/dL', unit: 'g/dL', referenceRange: '13.5 - 17.5', findings: 'All indicators within normal range.' },
      { id: '2', title: 'Lipid Profile', date: '05 Mar, 2025', category: 'Biochemistry', doctor: 'Dr. Clara Redfield', status: 'Abnormal', result: '240 mg/dL', unit: 'mg/dL', referenceRange: '< 200', findings: 'Elevated cholesterol levels.' },
    ];
    labs.forEach(lab => {
      const year = lab.date.split(', ')[1] || '2025';
      if (!groups[year]) groups[year] = [];
      groups[year].push(lab);
    });
    return groups;
  }, []);

  const filteredQueue = useMemo(() => {
    return patients.filter(p => p.name.toLowerCase().includes(queueSearchQuery.toLowerCase()));
  }, [patients, queueSearchQuery]);

  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [medFilter, setMedFilter] = useState<'All' | 'Active' | 'Inactive'>('Active');
  const [isMedFilterMenuOpen, setIsMedFilterMenuOpen] = useState(false);
  const [activeActionMedId, setActiveActionMedId] = useState<string | null>(null);
  const [activeLabActionId, setActiveLabActionId] = useState<string | null>(null);
  const [isEditMedModalOpen, setIsEditMedModalOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id' | 'isActive'>>({ name: '', strength: '', dosage: '', instructions: '', prescribedBy: '', prescrDate: '' });

  const medFilterRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const labActionMenuRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const selectedPatient = useMemo(() => patients.find(p => p.id === selectedId) || patients[0], [selectedId, patients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (medFilterRef.current && !medFilterRef.current.contains(event.target as Node)) setIsMedFilterMenuOpen(false);
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) setActiveActionMedId(null);
      if (labActionMenuRef.current && !labActionMenuRef.current.contains(event.target as Node)) setActiveLabActionId(null);
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) setShowDatePicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (editorContainerRef.current && typeof ClassicEditor !== 'undefined' && activeTab === 'Care plans') {
      ClassicEditor
        .create(editorContainerRef.current, {
          toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote']
        })
        .then((editor: any) => {
          editorRef.current = editor;
          editor.setData(currentEvalContent);
          editor.model.document.on('change:data', () => {
            setCurrentEvalContent(editor.getData());
          });
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy().then(() => {
          editorRef.current = null;
        });
      }
    };
  }, [activeTab]);

  const handleEditMedication = (med: Medication) => { setEditingMedication({ ...med }); setIsEditMedModalOpen(true); setActiveActionMedId(null); };
  const handleSaveMedication = (e: React.FormEvent) => { e.preventDefault(); if (editingMedication) { setMedications(prev => prev.map(m => m.id === editingMedication.id ? editingMedication : m)); setIsEditMedModalOpen(false); setEditingMedication(null); setShowDatePicker(false); } };
  const handleAddMedication = (e: React.FormEvent) => { e.preventDefault(); const medication: Medication = { ...newMedication, id: `${100 + medications.length}-M`, isActive: true, prescrDate: newMedication.prescrDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }; setMedications(prev => [medication, ...prev]); setIsAddMedModalOpen(false); setNewMedication({ name: '', strength: '', dosage: '', instructions: '', prescribedBy: '', prescrDate: '' }); setShowDatePicker(false); };

  const handleSaveNotes = () => {
    if (!currentEvalContent.trim()) return;
    setIsSavingNotes(true);
    setTimeout(() => {
      if (editingNoteId) {
        setEvaluations(prev => prev.map(e => e.id === editingNoteId ? { ...e, content: currentEvalContent, doctor: evalDoctorName || 'Dr. Clara Redfield' } : e));
      } else {
        const newNote: EvaluationNote = {
          id: Math.random().toString(36).substring(7),
          content: currentEvalContent,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          doctor: evalDoctorName || 'Dr. Clara Redfield',
          timestamp: Date.now()
        };
        setEvaluations(prev => [newNote, ...prev]);
      }
      setIsSavingNotes(false);
      setCurrentEvalContent('');
      setEvalDoctorName('');
      setEditingNoteId(null);
      if (editorRef.current) editorRef.current.setData('');
    }, 1000);
  };

  const handleEditNote = (note: EvaluationNote) => {
    setEditingNoteId(note.id);
    setCurrentEvalContent(note.content);
    setEvalDoctorName(note.doctor);
    if (editorRef.current) editorRef.current.setData(note.content);
    editorContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteNote = (id: string) => {
    setEvaluations(prev => prev.filter(e => e.id !== id));
  };

  const handleDownloadPDF = (report: LabReport) => {
    const content = `SILOE MED - LABORATORY REPORT\nPatient: ${selectedPatient.name}\nReport ID: MED-LAB-${report.id}-2025\nStatus: ${report.status}\nResult: ${report.result}\nClinical Interpretation: ${report.findings || 'No findings interpreted.'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/\s+/g, '_')}_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    setCurrentVitals(prev => prev.map(v => {
      let newValue = v.value;
      if (v.label === 'Heart Rate' && vitalInputs.hr) newValue = vitalInputs.hr;
      if (v.label === 'Blood Pressure' && vitalInputs.bp) newValue = vitalInputs.bp;
      if (v.label === 'Temperature' && vitalInputs.temp) newValue = vitalInputs.temp;
      if (v.label === 'Oxygen Saturation' && vitalInputs.spo2) newValue = vitalInputs.spo2;
      if (v.label === 'Respiratory Rate' && vitalInputs.rr) newValue = vitalInputs.rr;
      if (v.label === 'Weight' && vitalInputs.weight) newValue = vitalInputs.weight;
      return { ...v, value: newValue, timestamp: 'Just now' };
    }));
    const newTableEntry = {
      date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      hr: vitalInputs.hr || '72', bp: vitalInputs.bp || '120/80', temp: vitalInputs.temp || '36.8', spo2: vitalInputs.spo2 || '98', rr: vitalInputs.rr || '14', weight: vitalInputs.weight || '74.5'
    };
    setVitalsHistory(prev => [newTableEntry, ...prev]);
    setIsLogVitalsModalOpen(false);
    setVitalInputs({ hr: '', bp: '', temp: '', spo2: '', rr: '', weight: '' });
  };

  const tabs = [ 'Overview', 'Clinical data', 'Medications', 'Care plans', 'Labs', 'Benefits', 'Relationships', 'Unified health score', 'Schedule' ];

  const renderMedicationsTab = () => {
    const filteredMeds = medications.filter(m => {
      if (medFilter === 'All') return true;
      if (medFilter === 'Active') return m.isActive;
      if (medFilter === 'Inactive') return !m.isActive;
      return true;
    });

    return (
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-500">
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-6 relative" ref={medFilterRef}>
            <button 
              onClick={() => setIsMedFilterMenuOpen(!isMedFilterMenuOpen)}
              className="flex items-center group"
            >
              <div className={`w-12 h-12 rounded-2xl border transition-all flex items-center justify-center shadow-sm ${isMedFilterMenuOpen ? 'bg-emerald-50 border-emerald-300 text-emerald-500' : 'bg-emerald-50/30 border-emerald-100 text-emerald-600'}`}>
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <div className="h-10 w-px bg-slate-200 mx-6"></div>
              <div className="flex flex-col items-start">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Filtering:</span>
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">{medFilter}</span>
              </div>
            </button>

            {isMedFilterMenuOpen && (
              <div className="absolute left-0 top-[calc(100%+12px)] w-64 bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-[70] overflow-hidden py-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="px-6 py-3 border-b border-slate-50 mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication Status</p>
                </div>
                <div className="p-1.5 space-y-1">
                  {['All', 'Active', 'Inactive'].map((f) => (
                    <button 
                      key={f}
                      onClick={() => { setMedFilter(f as any); setIsMedFilterMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${medFilter === f ? 'bg-emerald-50/50 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                    >
                      <span className="text-sm">{f} Medications</span>
                      {medFilter === f && <Check size={16} className="text-emerald-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsAddMedModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"
          >
            <Plus size={16} strokeWidth={3} /> Add medication
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/20">
                <th className="px-8 py-4 w-10 border-r border-slate-100"><input type="checkbox" className="rounded border-slate-300 text-emerald-500 cursor-pointer" /></th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">ID</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Medication Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Dosage</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Instructions</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Prescribed By</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Prescr. Date</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMeds.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 border-r border-slate-50"><input type="checkbox" className="rounded border-slate-300 text-emerald-500 cursor-pointer" /></td>
                  <td className="px-8 py-5 text-xs font-black text-slate-400 border-r border-slate-50">{med.id}</td>
                  <td className="px-8 py-5 border-r border-slate-50"><p className="text-sm font-black text-slate-800 leading-tight">{med.name}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{med.strength}</p></td>
                  <td className="px-8 py-5 border-r border-slate-50"><div className="flex items-center gap-2 bg-emerald-50/50 px-3 py-1.5 rounded-full border border-emerald-100/50 w-fit"><Pill size={14} className="text-emerald-500 rotate-45" /><span className="text-xs font-black text-emerald-700">{med.dosage}</span></div></td>
                  <td className="px-8 py-5 text-xs font-black text-slate-600 border-r border-slate-50">{med.instructions}</td>
                  <td className="px-8 py-5 border-r border-slate-50"><div className="flex items-center gap-3"><img src={`https://i.pravatar.cc/150?u=${med.prescribedBy.replace(/\s+/g, '')}`} className="w-8 h-8 rounded-full border border-white shadow-sm" alt="" /><p className="text-xs font-black text-slate-700">{med.prescribedBy}</p></div></td>
                  <td className="px-8 py-5 text-xs font-black text-slate-800 border-r border-slate-50">{med.prescrDate}</td>
                  <td className="px-8 py-5 text-right relative">
                    <button onClick={() => setActiveActionMedId(activeActionMedId === med.id ? null : med.id)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={20} /></button>
                    {activeActionMedId === med.id && (
                      <div ref={actionMenuRef} className="absolute right-8 top-12 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1">
                        <button onClick={() => handleEditMedication(med)} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Pencil size={14} /> Edit</button>
                        <button className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> Remove</button>
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
    <div className="flex gap-8 animate-in fade-in duration-500 h-full">
      <div className="w-80 shrink-0 bg-white border border-slate-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" placeholder="Search patients..." value={queueSearchQuery} onChange={(e) => setQueueSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" /></div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {filteredQueue.map((p) => (<div key={p.id} onClick={() => onPatientSelect?.(p.id)} className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border-2 ${selectedId === p.id ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'}`}><div className="relative"><img src={p.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-100" alt="" /></div><div className="min-w-0"><p className={`text-sm font-black truncate ${selectedId === p.id ? 'text-emerald-900' : 'text-slate-800'}`}>{p.name}</p></div></div>))}
        </div>
      </div>
      <div className="flex-1 space-y-8 pb-12">
        <div className="flex items-center justify-between px-2"><div><h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Evaluation</h3><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ongoing clinical monitoring</p></div><button onClick={() => setIsLogVitalsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"><Plus size={16} /> Log vitals</button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentVitals.map((vital, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm group hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-4"><div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500"><vital.icon size={24} /></div></div>
              <div className="space-y-0.5"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{vital.label}</p><div className="flex items-baseline gap-1.5"><span className="text-3xl font-black text-slate-800 tracking-tight">{vital.value}</span><span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{vital.unit}</span></div></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/20">
            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Evaluation Notes</h4>
            <button onClick={handleSaveNotes} disabled={isSavingNotes} className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 disabled:opacity-50">Save Entry</button>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <input type="text" placeholder="Enter observer name..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" value={evalDoctorName} onChange={(e) => setEvalDoctorName(e.target.value)} />
            <div ref={editorContainerRef} className="flex-1"></div>
          </div>
        </div>
        <div className="space-y-4">
          {evaluations.map(e => (
            <div key={e.id} className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3"><p className="text-sm font-black text-slate-800">{e.doctor}</p><span className="text-xs text-slate-400 font-bold">{e.date}</span></div>
                <button onClick={() => handleDeleteNote(e.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
              <div className="text-sm text-slate-600 font-medium" dangerouslySetInnerHTML={{ __html: e.content }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc] pb-10">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20"><button onClick={onBack} className="p-2 hover:bg-emerald-50 rounded-lg text-slate-400 border border-slate-200 transition-all active:scale-95 group"><ArrowLeft size={18} className="group-hover:text-emerald-500 transition-colors" /></button><div className="flex items-center gap-2 text-sm font-medium"><span className="text-slate-400">Patient data</span><ChevronRight size={14} className="text-slate-300" /><span className="text-slate-800 font-bold">{selectedPatient.name}</span></div></div>
      <div className="bg-white border-b border-slate-200 px-6 overflow-x-auto sticky top-16 z-20 shadow-sm"><div className="flex gap-8">{tabs.map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{tab}</button>))}</div></div>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {activeTab === 'Overview' && <div className="grid grid-cols-1 xl:grid-cols-12 gap-8"><div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6"><div className="flex gap-6"><div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 text-3xl font-bold">{selectedPatient.name.charAt(0)}</div><div><h2 className="text-3xl font-black text-slate-800">{selectedPatient.name}</h2><p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedPatient.age} Y/O • {selectedPatient.gender}</p></div></div></div></div>}
        {activeTab === 'Medications' && renderMedicationsTab()}
        {activeTab === 'Care plans' && renderCarePlansTab()}
        {!['Overview', 'Medications', 'Care plans'].includes(activeTab) && <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-20 text-center"><h3 className="text-lg font-bold text-slate-800">{activeTab}</h3><p className="text-sm text-slate-500 mt-1">Section is under development.</p></div>}
      </div>

      {isLogVitalsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsLogVitalsModalOpen(false)} />
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 p-10">
            <h2 className="text-3xl font-black text-slate-800 mb-6">Log Vitals</h2>
            <form onSubmit={handleLogVitalsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Heart Rate" className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={vitalInputs.hr} onChange={e => setVitalInputs({...vitalInputs, hr: e.target.value})} />
                <input type="text" placeholder="Blood Pressure" className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={vitalInputs.bp} onChange={e => setVitalInputs({...vitalInputs, bp: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-full font-black uppercase tracking-widest text-xs">Save Vitals</button>
            </form>
          </div>
        </div>
      )}

      {isAddMedModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsAddMedModalOpen(false)} />
          <div className="bg-white rounded-[60px] shadow-2xl w-full max-w-2xl overflow-visible relative z-10 p-16">
            <h2 className="text-[42px] font-black text-[#1e293b] mb-12">Add Medication</h2>
            <form onSubmit={handleAddMedication} className="space-y-8">
              <div className="space-y-6">
                <input type="text" required className="w-full px-8 py-6 bg-white border-2 border-emerald-400 rounded-[28px] text-xl font-bold placeholder:text-slate-300 outline-none" value={newMedication.name} onChange={e => setNewMedication({...newMedication, name: e.target.value})} placeholder="Name" />
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" required className="w-full px-8 py-6 bg-slate-50 rounded-[28px] text-xl font-bold placeholder:text-slate-300 outline-none" value={newMedication.strength} onChange={e => setNewMedication({...newMedication, strength: e.target.value})} placeholder="Strength" />
                  <input type="text" required className="w-full px-8 py-6 bg-slate-50 rounded-[28px] text-xl font-bold placeholder:text-slate-300 outline-none" value={newMedication.dosage} onChange={e => setNewMedication({...newMedication, dosage: e.target.value})} placeholder="Dosage" />
                </div>
                <div className="relative group h-[82px] flex items-center bg-slate-50 border border-slate-100 rounded-[28px] px-8 cursor-pointer" ref={datePickerRef}>
                    <div onClick={() => setShowDatePicker(!showDatePicker)} className="w-full flex items-center justify-between">
                      <span className={`text-xl font-bold ${newMedication.prescrDate ? 'text-slate-800' : 'text-slate-300'}`}>{newMedication.prescrDate || 'Select Date'}</span>
                      <Calendar size={24} className="text-emerald-400" />
                    </div>
                    {showDatePicker && (<MaterialDatePicker value={newMedication.prescrDate} onChange={(val) => setNewMedication({...newMedication, prescrDate: val})} onClose={() => setShowDatePicker(false)} />)}
                </div>
              </div>
              <div className="flex items-center justify-end gap-12 pt-12">
                <button type="button" onClick={() => setIsAddMedModalOpen(false)} className="text-emerald-500 font-black uppercase tracking-[0.2em] text-sm hover:text-emerald-700 transition-colors">Cancel</button>
                <button type="submit" className="px-16 py-6 bg-emerald-500 text-white font-black rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditMedModalOpen && editingMedication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsEditMedModalOpen(false)} />
          <div className="bg-white rounded-[60px] shadow-2xl w-full max-w-2xl overflow-visible relative z-10 p-16">
            <h2 className="text-[42px] font-black text-[#1e293b] mb-12">Edit Medication</h2>
            <form onSubmit={handleSaveMedication} className="space-y-8">
              <div className="space-y-6">
                <input type="text" required className="w-full px-8 py-6 bg-white border-2 border-emerald-400 rounded-[28px] text-xl font-bold outline-none" value={editingMedication.name} onChange={e => setEditingMedication({...editingMedication, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" required className="w-full px-8 py-6 bg-slate-50 rounded-[28px] text-xl font-bold outline-none" value={editingMedication.strength} onChange={e => setEditingMedication({...editingMedication, strength: e.target.value})} />
                  <input type="text" required className="w-full px-8 py-6 bg-slate-50 rounded-[28px] text-xl font-bold outline-none" value={editingMedication.dosage} onChange={e => setEditingMedication({...editingMedication, dosage: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-12 pt-12">
                <button type="button" onClick={() => setIsEditMedModalOpen(false)} className="text-emerald-500 font-black uppercase tracking-[0.2em] text-sm hover:text-emerald-700 transition-colors">Cancel</button>
                <button type="submit" className="px-16 py-6 bg-emerald-500 text-white font-black rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
