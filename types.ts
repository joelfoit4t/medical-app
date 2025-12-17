export enum AppointmentStatus {
  Completed = 'Completed',
  Scheduled = 'Scheduled',
  Canceled = 'Canceled',
  Waiting = 'Patient is waiting'
}

export enum PatientStatus {
  Stable = 'Stable',
  Mild = 'Mild',
  Critical = 'Critical'
}

export enum StaffStatus {
  Active = 'Active',
  OnBreak = 'On Break',
  OffDuty = 'Off Duty'
}

export enum StaffRole {
  Doctor = 'Doctor',
  Nurse = 'Nurse',
  Surgeon = 'Surgeon',
  Specialist = 'Specialist',
  Receptionist = 'Receptionist'
}

export interface Appointment {
  id: string;
  patientName: string;
  reason: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  date: string;      // YYYY-MM-DD
  status: AppointmentStatus;
  dayIndex: number; // 0 = Monday, 1 = Tuesday, etc.
}

export interface Patient {
  id: string;
  name: string;
  avatar: string;
  lastAppointment: string;
  age: number;
  dob: string;
  gender: 'Male' | 'Female';
  diagnosis: string;
  status: PatientStatus;
}

export interface Staff {
  id: string;
  name: string;
  avatar: string;
  role: StaffRole;
  department: string;
  status: StaffStatus;
  email: string;
  schedule: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export type NavItem = 
  | 'Dashboard' 
  | 'Appointment' 
  | 'Appointment List' 
  | 'Add Appointment' 
  | 'Patient' 
  | 'Patient List' 
  | 'Patient Profile' 
  | 'Add Patient' 
  | 'Report' 
  | 'Clinic' 
  | 'Staff' 
  | 'Consultation';