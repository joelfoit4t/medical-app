import { Appointment, AppointmentStatus, Patient, PatientStatus, Staff, StaffRole, StaffStatus } from './types';
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
  { icon: LayoutGrid, label: 'Dashboard' },
  { icon: CalendarDays, label: 'Appointment' },
  { icon: Users, label: 'Patient' },
  { icon: FileText, label: 'Report' },
  { icon: Building2, label: 'Clinic' },
  { icon: Stethoscope, label: 'Staff' },
  { icon: MessageSquare, label: 'Consultation' },
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

export const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Willy Ben Chen', avatar: 'https://i.pravatar.cc/150?u=1', lastAppointment: '10-04-2025', age: 27, dob: '10-02-1998', gender: 'Male', diagnosis: 'Diabetes', status: PatientStatus.Stable },
  { id: '2', name: 'Emily Watford', avatar: 'https://i.pravatar.cc/150?u=2', lastAppointment: '09-04-2025', age: 37, dob: '20-01-1988', gender: 'Female', diagnosis: 'Hypertension', status: PatientStatus.Critical },
  { id: '3', name: 'Nicholas Robertson', avatar: 'https://i.pravatar.cc/150?u=3', lastAppointment: '08-04-2025', age: 25, dob: '24-06-1999', gender: 'Male', diagnosis: 'Anxiety Disorder', status: PatientStatus.Stable },
  { id: '4', name: 'Sarah Mitchell', avatar: 'https://i.pravatar.cc/150?u=4', lastAppointment: '25-04-2025', age: 32, dob: '14-09-1992', gender: 'Female', diagnosis: 'Hypertension', status: PatientStatus.Mild },
  { id: '5', name: 'James Wong', avatar: 'https://i.pravatar.cc/150?u=5', lastAppointment: '23-04-2025', age: 45, dob: '11-03-1980', gender: 'Male', diagnosis: 'Type 2 Diabetes', status: PatientStatus.Stable },
  { id: '6', name: 'Lina Garcia', avatar: 'https://i.pravatar.cc/150?u=6', lastAppointment: '22-04-2025', age: 29, dob: '05-12-1995', gender: 'Female', diagnosis: 'Asthma', status: PatientStatus.Mild },
  { id: '7', name: 'Tony Hack', avatar: 'https://i.pravatar.cc/150?u=7', lastAppointment: '21-04-2025', age: 41, dob: '18-08-1983', gender: 'Male', diagnosis: 'Chronic Back Pain', status: PatientStatus.Stable },
  { id: '8', name: 'Jamie Ulric', avatar: 'https://i.pravatar.cc/150?u=8', lastAppointment: '21-04-2025', age: 34, dob: '30-11-1990', gender: 'Male', diagnosis: 'Post-Op Recovery', status: PatientStatus.Mild },
  { id: '9', name: 'Lee Sung Yin', avatar: 'https://i.pravatar.cc/150?u=9', lastAppointment: '21-04-2025', age: 52, dob: '12-04-1973', gender: 'Male', diagnosis: 'Hyperlipidemia', status: PatientStatus.Stable },
  { id: '10', name: 'Henderson Kai', avatar: 'https://i.pravatar.cc/150?u=10', lastAppointment: '23-04-2025', age: 22, dob: '15-05-2002', gender: 'Male', diagnosis: 'Flu Symptoms', status: PatientStatus.Mild },
];

export const MOCK_STAFF: Staff[] = [
  { id: 's1', name: 'Dr. Clara Redfield', avatar: 'https://i.pravatar.cc/150?u=clara', role: StaffRole.Doctor, department: 'General Medicine', status: StaffStatus.Active, email: 'clara.redfield@medicare.com', schedule: 'Mon-Fri, 09:00-17:00' },
  { id: 's2', name: 'Dr. Leon Kennedy', avatar: 'https://i.pravatar.cc/150?u=leon', role: StaffRole.Surgeon, department: 'Cardiology', status: StaffStatus.OnBreak, email: 'leon.kennedy@medicare.com', schedule: 'Tue-Sat, 08:00-16:00' },
  { id: 's3', name: 'Jill Valentine', avatar: 'https://i.pravatar.cc/150?u=jill', role: StaffRole.Nurse, department: 'Emergency', status: StaffStatus.Active, email: 'jill.v@medicare.com', schedule: 'Mon-Thu, 20:00-06:00' },
  { id: 's4', name: 'Chris Redfield', avatar: 'https://i.pravatar.cc/150?u=chris', role: StaffRole.Specialist, department: 'Neurology', status: StaffStatus.OffDuty, email: 'chris.r@medicare.com', schedule: 'Wed-Sun, 10:00-18:00' },
  { id: 's5', name: 'Ada Wong', avatar: 'https://i.pravatar.cc/150?u=ada', role: StaffRole.Receptionist, department: 'Administration', status: StaffStatus.Active, email: 'ada.wong@medicare.com', schedule: 'Mon-Fri, 08:30-16:30' },
  { id: 's6', name: 'Dr. Albert Wesker', avatar: 'https://i.pravatar.cc/150?u=albert', role: StaffRole.Doctor, department: 'Research', status: StaffStatus.Active, email: 'albert.w@medicare.com', schedule: 'Mon-Fri, 09:00-17:00' },
  { id: 's7', name: 'Sherry Birkin', avatar: 'https://i.pravatar.cc/150?u=sherry', role: StaffRole.Nurse, department: 'Pediatrics', status: StaffStatus.Active, email: 'sherry.b@medicare.com', schedule: 'Mon-Fri, 08:00-16:00' },
  { id: 's8', name: 'Dr. Barry Burton', avatar: 'https://i.pravatar.cc/150?u=barry', role: StaffRole.Specialist, department: 'Security Management', status: StaffStatus.Active, email: 'barry.b@medicare.com', schedule: 'Mon-Sun, 24/7 On-Call' },
  { id: 's9', name: 'Rebecca Chambers', avatar: 'https://i.pravatar.cc/150?u=rebecca', role: StaffRole.Doctor, department: 'Biochemistry', status: StaffStatus.Active, email: 'rebecca.c@medicare.com', schedule: 'Mon-Fri, 09:00-17:00' },
  { id: 's10', name: 'Hunk', avatar: 'https://i.pravatar.cc/150?u=hunk', role: StaffRole.Specialist, department: 'Tactical Medicine', status: StaffStatus.OffDuty, email: 'hunk@medicare.com', schedule: 'Night Shift' },
  { id: 's11', name: 'Dr. Carlos Oliveira', avatar: 'https://i.pravatar.cc/150?u=carlos', role: StaffRole.Doctor, department: 'Infectious Diseases', status: StaffStatus.Active, email: 'carlos.o@medicare.com', schedule: 'Tue-Sat, 07:00-15:00' },
  { id: 's12', name: 'Sheva Alomar', avatar: 'https://i.pravatar.cc/150?u=sheva', role: StaffRole.Nurse, department: 'General Medicine', status: StaffStatus.OnBreak, email: 'sheva.a@medicare.com', schedule: 'Mon-Fri, 09:00-17:00' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  // --- JANUARY 2025 ---
  { id: 'jan-1', patientName: 'Early Bird', reason: 'New Year Check', startTime: '09:00', endTime: '10:00', date: '2025-01-06', status: AppointmentStatus.Completed, dayIndex: 0 },
  
  // --- MARCH 2025 ---
  { id: 'mar-1', patientName: 'March Patient', reason: 'Spring Allergy', startTime: '11:00', endTime: '12:00', date: '2025-03-10', status: AppointmentStatus.Completed, dayIndex: 0 },

  // --- APRIL 2025 ---
  { id: 'apr-1', patientName: 'Tony Hack', reason: 'General Check-up', startTime: '09:00', endTime: '10:00', date: '2025-04-21', status: AppointmentStatus.Completed, dayIndex: 0 },
  { id: 'apr-2', patientName: 'Jamie Ulric', reason: 'Follow-up Consultation', startTime: '10:30', endTime: '11:30', date: '2025-04-21', status: AppointmentStatus.Canceled, dayIndex: 0 },
  { id: 'apr-3', patientName: 'Lee Sung Yin', reason: 'Blood Test', startTime: '13:00', endTime: '14:00', date: '2025-04-21', status: AppointmentStatus.Completed, dayIndex: 0 },
  { id: 'apr-4', patientName: 'James Wong', reason: 'Blood Pressure Check', startTime: '09:30', endTime: '10:30', date: '2025-04-22', status: AppointmentStatus.Completed, dayIndex: 1 },
  { id: 'apr-5', patientName: 'Emily Watford', reason: 'Headache', startTime: '11:00', endTime: '12:00', date: '2025-04-22', status: AppointmentStatus.Waiting, dayIndex: 1 },
  { id: 'apr-6', patientName: 'Lina Garcia', reason: 'Skin Rash', startTime: '13:00', endTime: '14:00', date: '2025-04-22', status: AppointmentStatus.Scheduled, dayIndex: 1 },
  { id: 'apr-7', patientName: 'Henderson Kai', reason: 'Prescription Refill', startTime: '10:30', endTime: '11:30', date: '2025-04-23', status: AppointmentStatus.Scheduled, dayIndex: 2 },
  { id: 'apr-8', patientName: 'Emily Walts', reason: 'Dental Check', startTime: '13:30', endTime: '14:30', date: '2025-04-23', status: AppointmentStatus.Scheduled, dayIndex: 2 },
  { id: 'apr-9', patientName: 'Leo Wildheart', reason: 'Chronic Review', startTime: '09:00', endTime: '10:00', date: '2025-04-24', status: AppointmentStatus.Scheduled, dayIndex: 3 },
  { id: 'apr-10', patientName: 'Tannia Burg', reason: 'Consultation', startTime: '10:00', endTime: '11:00', date: '2025-04-24', status: AppointmentStatus.Canceled, dayIndex: 3 },
  { id: 'apr-11', patientName: 'Ryo Kuzuhaki', reason: 'Evaluation', startTime: '13:00', endTime: '14:00', date: '2025-04-24', status: AppointmentStatus.Scheduled, dayIndex: 3 },
  { id: 'apr-12', patientName: 'Thomas Andre', reason: 'Check-up', startTime: '09:30', endTime: '10:30', date: '2025-04-25', status: AppointmentStatus.Scheduled, dayIndex: 4 },
  { id: 'apr-13', patientName: 'Ling Ling Ben', reason: 'Lab Results', startTime: '11:00', endTime: '12:00', date: '2025-04-25', status: AppointmentStatus.Scheduled, dayIndex: 4 },
  { id: 'apr-14', patientName: 'Lily Chen', reason: 'Vaccination', startTime: '13:30', endTime: '14:30', date: '2025-04-25', status: AppointmentStatus.Scheduled, dayIndex: 4 },

  // --- MAY 2025 ---
  { id: 'may-1', patientName: 'Sarah Mitchell', reason: 'Prenatal Visit', startTime: '09:00', endTime: '10:00', date: '2025-05-12', status: AppointmentStatus.Scheduled, dayIndex: 0 },
  { id: 'may-2', patientName: 'David Kim', reason: 'Asthma Follow-up', startTime: '11:00', endTime: '12:00', date: '2025-05-12', status: AppointmentStatus.Scheduled, dayIndex: 0 },
  { id: 'may-3', patientName: 'Willy Ben Chen', reason: 'Diabetes Screening', startTime: '14:00', endTime: '15:00', date: '2025-05-12', status: AppointmentStatus.Scheduled, dayIndex: 0 },
  { id: 'may-4', patientName: 'Ahmed Ibrahim', reason: 'Heart Monitoring', startTime: '09:30', endTime: '10:30', date: '2025-05-13', status: AppointmentStatus.Scheduled, dayIndex: 1 },
  { id: 'may-5', patientName: 'Maria Rodriguez', reason: 'Diet Consultation', startTime: '13:00', endTime: '14:00', date: '2025-05-13', status: AppointmentStatus.Scheduled, dayIndex: 1 },
  { id: 'may-6', patientName: 'Nicholas Robertson', reason: 'Therapy Session', startTime: '10:00', endTime: '11:30', date: '2025-05-14', status: AppointmentStatus.Scheduled, dayIndex: 2 },
  { id: 'may-7', patientName: 'Emily Tan', reason: 'Skin Allergy Review', startTime: '13:00', endTime: '14:00', date: '2025-05-14', status: AppointmentStatus.Scheduled, dayIndex: 2 },
  { id: 'may-8', patientName: 'Willy Ben Chen', reason: 'Annual Physical', startTime: '09:00', endTime: '10:30', date: '2025-05-15', status: AppointmentStatus.Scheduled, dayIndex: 3 },
  { id: 'may-9', patientName: 'Sarah Mitchell', reason: 'Flu Vaccine', startTime: '11:00', endTime: '11:30', date: '2025-05-15', status: AppointmentStatus.Scheduled, dayIndex: 3 },
  { id: 'may-10', patientName: 'James Wong', reason: 'Eye Exam', startTime: '14:00', endTime: '15:00', date: '2025-05-15', status: AppointmentStatus.Scheduled, dayIndex: 3 },
  { id: 'may-11', patientName: 'Lina Garcia', reason: 'Blood Test', startTime: '09:30', endTime: '10:30', date: '2025-05-16', status: AppointmentStatus.Scheduled, dayIndex: 4 },

  // --- OCTOBER 2025 ---
  { id: 'oct-1', patientName: 'Halloween Patient', reason: 'Spooky Checkup', startTime: '14:00', endTime: '15:00', date: '2025-10-27', status: AppointmentStatus.Scheduled, dayIndex: 0 },

  // --- DECEMBER 2025 ---
  { id: 'dec-1', patientName: 'Christmas Patient', reason: 'Holiday Health', startTime: '10:00', endTime: '11:00', date: '2025-12-22', status: AppointmentStatus.Scheduled, dayIndex: 0 },
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