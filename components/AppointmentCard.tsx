import React from 'react';
import { Appointment, AppointmentStatus } from '../types';
import { Check, Clock, X, User } from 'lucide-react';

interface Props {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<Props> = ({ appointment }) => {
  // Determine styles based on status
  let bgColor = 'bg-white';
  let stripColor = 'bg-slate-400';
  let badgeClass = 'bg-slate-100 text-slate-600';
  let Icon = Clock;
  let iconText = 'Scheduled';

  switch (appointment.status) {
    case AppointmentStatus.Completed:
      badgeClass = 'bg-emerald-100 text-emerald-700';
      stripColor = 'bg-emerald-500';
      Icon = Check;
      iconText = 'Completed';
      break;
    case AppointmentStatus.Canceled:
      badgeClass = 'bg-red-100 text-red-700';
      stripColor = 'bg-red-500';
      Icon = X;
      iconText = 'Canceled';
      break;
    case AppointmentStatus.Waiting:
      badgeClass = 'bg-amber-100 text-amber-700';
      stripColor = 'bg-amber-400';
      Icon = User;
      iconText = 'Patient is waiting';
      break;
    case AppointmentStatus.Scheduled:
      badgeClass = 'bg-sky-100 text-sky-700';
      stripColor = 'bg-sky-500';
      Icon = Clock;
      iconText = 'Scheduled';
      break;
  }

  // Calculate position logic (simplified for this fixed-height demo)
  // In a real app, calculate "top" based on start time relative to grid start
  // For the demo visual, we use relative placement or CSS grid placement if strict,
  // but here we render inside the cell. 
  
  // NOTE: In the parent component, we will position this absolutely. 
  // This component just handles the inner content.

  return (
    <div className={`w-full h-full rounded-lg bg-white shadow-sm border border-slate-100 flex overflow-hidden hover:shadow-md transition-shadow cursor-pointer group`}>
      {/* Left Color Strip */}
      <div className={`w-1 ${stripColor} h-full flex-shrink-0`} />
      
      {/* Content */}
      <div className="p-3 flex flex-col justify-between w-full min-w-0">
        <div>
          <div className="text-[10px] text-slate-500 font-medium mb-0.5">
            {appointment.startTime} - {appointment.endTime}
          </div>
          <h3 className="text-xs font-bold text-slate-800 truncate leading-tight">
            {appointment.patientName}
          </h3>
          <p className="text-[10px] text-slate-500 truncate mt-0.5">
            {appointment.reason}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`mt-2 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md ${badgeClass} w-full`}>
          <Icon size={12} strokeWidth={2.5} />
          <span className="text-[10px] font-semibold whitespace-nowrap">{iconText}</span>
        </div>
      </div>
    </div>
  );
};