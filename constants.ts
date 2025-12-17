import { Appointment, AppointmentStatus } from './types';
import { 
  LayoutGrid, 
  CalendarDays, 
  Users, 
  FileText, 
  Building2, 
  Stethoscope, 
  FolderHeart, 
  BriefcaseMedical, 
  FileBarChart, 
  MessageSquare, 
  HelpCircle, 
  Settings 
} from 'lucide-react';

export const SIDEBAR_ITEMS = [
  { icon: LayoutGrid, label: 'Dashboard', active: false },
  { icon: CalendarDays, label: 'Appointment', active: true },
  { icon: Users, label: 'Patient', active: false },
  { icon: FileText, label: 'Report', active: false },
  { icon: Building2, label: 'Clinic', active: false },
  { icon: Stethoscope, label: 'Staff', active: false },
  { icon: MessageSquare, label: 'Consultation', active: false },
];

export const FAVORITES_ITEMS = [
  { icon: FolderHeart, label: 'VIP Patient' },
  { icon: BriefcaseMedical, label: 'Equipment' },
  { icon: FileBarChart, label: 'Staff Report' },
];

export const BOTTOM_ITEMS = [
  { icon: MessageSquare, label: 'Feedback' },
  { icon: HelpCircle, label: 'Help Center' },
  { icon: Settings, label: 'Settings' },
];

// Mock Data matching the image
export const MOCK_APPOINTMENTS: Appointment[] = [
  // Monday (Index 0)
  {
    id: '1',
    patientName: 'Tony Hack',
    reason: 'General Check-up',
    startTime: '09:00',
    endTime: '10:00',
    date: '2025-04-21',
    status: AppointmentStatus.Completed,
    dayIndex: 0
  },
  {
    id: '2',
    patientName: 'Jamie Ulric',
    reason: 'Follow-up Consultation',
    startTime: '10:30',
    endTime: '11:30',
    date: '2025-04-21',
    status: AppointmentStatus.Canceled,
    dayIndex: 0
  },
  {
    id: '3',
    patientName: 'Lee Sung Yin',
    reason: 'Blood Test',
    startTime: '13:00',
    endTime: '14:00',
    date: '2025-04-21',
    status: AppointmentStatus.Completed,
    dayIndex: 0
  },
  
  // Tuesday (Index 1)
  {
    id: '4',
    patientName: 'James Wong',
    reason: 'Blood Pressure Check',
    startTime: '09:30',
    endTime: '10:30',
    date: '2025-04-22',
    status: AppointmentStatus.Completed,
    dayIndex: 1
  },
  {
    id: '5',
    patientName: 'Emily Watford',
    reason: 'Headache',
    startTime: '11:00',
    endTime: '12:00',
    date: '2025-04-22',
    status: AppointmentStatus.Waiting,
    dayIndex: 1
  },
  {
    id: '6',
    patientName: 'Lina Garcia',
    reason: 'Skin Rash',
    startTime: '13:00',
    endTime: '14:00',
    date: '2025-04-22',
    status: AppointmentStatus.Scheduled,
    dayIndex: 1
  },

  // Wednesday (Index 2)
  {
    id: '7',
    patientName: 'Henderson Kai',
    reason: 'Prescription Refill',
    startTime: '10:30',
    endTime: '11:30',
    date: '2025-04-23',
    status: AppointmentStatus.Scheduled,
    dayIndex: 2
  },
  {
    id: '8',
    patientName: 'Emily Walts',
    reason: 'Dental Check',
    startTime: '13:30',
    endTime: '14:30',
    date: '2025-04-23',
    status: AppointmentStatus.Scheduled,
    dayIndex: 2
  },

  // Thursday (Index 3)
  {
    id: '9',
    patientName: 'Leo Wildheart',
    reason: 'Chronic Condition Review',
    startTime: '09:00',
    endTime: '10:00',
    date: '2025-04-24',
    status: AppointmentStatus.Scheduled,
    dayIndex: 3
  },
  {
    id: '10',
    patientName: 'Tannia Burg',
    reason: 'Mental Health Consultation',
    startTime: '10:00',
    endTime: '11:00',
    date: '2025-04-24',
    status: AppointmentStatus.Canceled,
    dayIndex: 3
  },
  {
    id: '11',
    patientName: 'Ryo Kzuhaki',
    reason: 'Injury Evaluation',
    startTime: '13:00',
    endTime: '14:00',
    date: '2025-04-24',
    status: AppointmentStatus.Scheduled,
    dayIndex: 3
  },

  // Friday (Index 4)
  {
    id: '12',
    patientName: 'Thomas Andre',
    reason: 'General Check-up',
    startTime: '09:30',
    endTime: '10:30',
    date: '2025-04-25',
    status: AppointmentStatus.Scheduled,
    dayIndex: 4
  },
  {
    id: '13',
    patientName: 'Ling Ling Ben',
    reason: 'Lab Results Discussion',
    startTime: '11:00',
    endTime: '12:00',
    date: '2025-04-25',
    status: AppointmentStatus.Scheduled,
    dayIndex: 4
  },
  {
    id: '14',
    patientName: 'Lily Chen',
    reason: 'Vaccination',
    startTime: '13:30',
    endTime: '14:30',
    date: '2025-04-25',
    status: AppointmentStatus.Scheduled,
    dayIndex: 4
  },
];

export const DAYS_OF_WEEK = [
  { name: 'MON', date: 21 },
  { name: 'TUE', date: 22, active: true },
  { name: 'WED', date: 23 },
  { name: 'THR', date: 24 },
  { name: 'FRI', date: 25 },
];

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'
];
