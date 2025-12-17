import React from 'react';
import { Appointment, AppointmentStatus } from '../types';
import { Check, Clock, X, User } from 'lucide-react';

interface Props {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<Props> = ({ appointment }) => {
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

  return (
    <div className={`w-full h-full rounded-xl bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 flex overflow-hidden hover:shadow-md transition-shadow cursor-pointer group`}>
      {/* Left Color Strip */}
      <div className={`w-[3px] ${stripColor} h-full flex-shrink-0`} />
      
      {/* Content */}
      <div className="p-3.5 flex flex-col justify-between w-full min-w-0">
        <div className="space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">
            {appointment.startTime} - {appointment.endTime}
          </div>
          <h3 className="text-[13px] font-bold text-slate-800 truncate leading-tight">
            {appointment.patientName}
          </h3>
          <p className="text-[11px] text-slate-400 truncate">
            {appointment.reason}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg ${badgeClass} w-full transition-colors`}>
          <Icon size={14} strokeWidth={2.5} />
          <span className="text-[11px] font-bold whitespace-nowrap">{iconText}</span>
        </div>
      </div>
    </div>
  );
};