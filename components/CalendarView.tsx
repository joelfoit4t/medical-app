import React from 'react';
import { ChevronLeft, ChevronRight, List, Calendar, SlidersHorizontal, Settings, Clock } from 'lucide-react';
import { DAYS_OF_WEEK, MOCK_APPOINTMENTS, TIME_SLOTS } from '../constants';
import { AppointmentCard } from './AppointmentCard';

export const CalendarView: React.FC = () => {
  // Helper to find appointments for a specific day and time slot
  // Note: Real calendars calculate pixel heights. For this grid approach, we map slots.
  // The design shows slots starting roughly at the hour or half hour. 
  // We will map appointments to the closest hour slot for the visual demo, 
  // but use absolute positioning within the day column for precision.

  const START_HOUR = 9;
  const PIXELS_PER_HOUR = 140; // Height of one hour block

  const getPositionStyle = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startOffset = (startH - START_HOUR) + (startM / 60);
    const duration = (endH - startH) + ((endM - startM) / 60);

    return {
      top: `${startOffset * PIXELS_PER_HOUR}px`,
      height: `${duration * PIXELS_PER_HOUR - 8}px`, // -8 for gap/margin
    };
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        
        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-slate-500 text-sm font-medium hover:text-slate-800">
            <List size={16} /> List
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white text-slate-800 shadow-sm text-sm font-bold">
            <Calendar size={16} /> Calendar
          </button>
        </div>

        {/* Date Navigation & Stats */}
        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 bg-white">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium">
              <Calendar size={14} />
              April 22, 2025
            </div>
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 bg-white">
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="hidden lg:block text-slate-800 font-medium">
            <span className="font-bold text-xl mr-1">3</span> appointments today
          </div>

          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50">
               <SlidersHorizontal size={14} /> Filter
             </button>
             <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 bg-white">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        
        {/* Days Header */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200">
          <div className="p-4 text-xs font-semibold text-slate-400 uppercase flex items-center justify-center border-r border-slate-100">
            GMT +7
          </div>
          {DAYS_OF_WEEK.map((day, index) => (
            <div 
              key={day.name} 
              className={`p-3 text-center border-r border-slate-100 last:border-r-0 ${day.active ? 'bg-sky-50' : ''}`}
            >
              <span className={`text-xs font-bold block mb-1 ${day.active ? 'text-sky-600' : 'text-slate-400'}`}>
                {day.name} {day.date}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable Time Grid */}
        <div className="overflow-y-auto flex-1 relative custom-scrollbar">
          
          {/* Current Time Indicator Line (Static visual for 11:15) */}
          <div className="absolute left-0 right-0 z-10 pointer-events-none flex items-center" style={{ top: `${(11.25 - START_HOUR) * PIXELS_PER_HOUR}px` }}>
            <div className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-r-md shadow-sm z-20">11:15</div>
            <div className="h-[2px] bg-sky-500 w-full relative">
                <div className="absolute right-0 -top-1 w-2 h-2 bg-sky-500 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] min-h-[800px]">
            
            {/* Time Column */}
            <div className="border-r border-slate-100 bg-white z-20 relative">
              {TIME_SLOTS.map((time, i) => (
                <div key={time} className="text-xs text-slate-400 font-medium p-3 text-center border-b border-slate-50 h-[140px] relative">
                  <span className="-top-3 relative bg-white px-1">{time}</span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {DAYS_OF_WEEK.map((day, dayIdx) => (
              <div key={dayIdx} className={`relative border-r border-slate-100 last:border-r-0 ${day.active ? 'bg-sky-50/20' : ''}`}>
                 
                 {/* Background Grid Lines (matching time column) */}
                 {TIME_SLOTS.map((_, tIdx) => (
                   <div key={tIdx} className="border-b border-slate-50 h-[140px] w-full"></div>
                 ))}

                 {/* Break Time Visual (12:00 - 13:00) */}
                 <div 
                    className="absolute w-full flex items-center justify-center opacity-60 z-0"
                    style={{
                        top: `${(12 - START_HOUR) * PIXELS_PER_HOUR}px`,
                        height: `${PIXELS_PER_HOUR}px`,
                        background: 'repeating-linear-gradient(45deg, #f8fafc, #f8fafc 10px, #f1f5f9 10px, #f1f5f9 20px)'
                    }}
                 >
                    {/* Only show label in the middle column roughly */}
                    {dayIdx === 2 && (
                        <div className="bg-white px-3 py-1 rounded-full shadow-sm text-xs text-slate-500 font-medium flex items-center gap-2 border border-slate-200">
                             <span className="text-lg leading-none">♨</span> Break Time
                        </div>
                    )}
                 </div>


                 {/* Appointments */}
                 {MOCK_APPOINTMENTS.filter(apt => apt.dayIndex === dayIdx).map(apt => (
                   <div
                     key={apt.id}
                     className="absolute left-1 right-1 px-1 z-10 transition-all hover:z-20"
                     style={getPositionStyle(apt.startTime, apt.endTime)}
                   >
                     <AppointmentCard appointment={apt} />
                   </div>
                 ))}

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};