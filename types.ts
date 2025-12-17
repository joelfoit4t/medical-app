export enum AppointmentStatus {
  Completed = 'Completed',
  Scheduled = 'Scheduled',
  Canceled = 'Canceled',
  Waiting = 'Patient is waiting'
}

export interface Appointment {
  id: string;
  patientName: string;
  reason: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  date: string;      // YYYY-MM-DD
  status: AppointmentStatus;
  dayIndex: number; // 0 = Monday, 1 = Tuesday, etc. (helper for grid)
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export type ViewMode = 'list' | 'calendar';