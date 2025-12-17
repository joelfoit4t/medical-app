import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, List, Calendar, SlidersHorizontal, Settings, Clock, Sparkles, X } from 'lucide-react';
import { DAYS_OF_WEEK, MOCK_APPOINTMENTS, TIME_SLOTS } from '../constants';
import { AppointmentCard } from './AppointmentCard';
import { getSmartSchedulingSuggestion } from '../services/geminiService';

export const CalendarView: React.FC = () => {
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');

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

  const handleSmartSchedule = async () => {
    setShowAiModal(true);
    setAiLoading(true);
    setAiSuggestion('');
    
    // Simulate fetching appointments for "today" (using Tue 22 as today)
    const todaysAppointments = MOCK_APPOINTMENTS.filter(a => a.dayIndex === 1);
    const suggestion = await getSmartSchedulingSuggestion('2025-04-22', todaysAppointments);
    
    setAiSuggestion(suggestion);
    setAiLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col relative">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        
        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-slate-500 text-sm font-medium hover:text-slate-800">
            <List size={16} /> List
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white text-slate-800 shadow-sm text-sm font-bold">
            <Calendar size={16} /> Calendar
          </button>
        </div>

        {/* Date Navigation & Stats */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6 w-full xl:w-auto justify-between xl:justify-end">
          <div className="flex items-center gap-2 order-1">
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 bg-white">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium whitespace-nowrap">
              <Calendar size={14} />
              April 22, 2025
            </div>
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 bg-white">
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="hidden md:block text-slate-800 font-medium order-2">
            <span className="font-bold text-xl mr-1">3</span> appointments today
          </div>

          <div className="flex items-center gap-2 order-3 ml-auto xl:ml-0">
             <button 
               onClick={handleSmartSchedule}
               className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90 shadow-sm transition-all"
             >
               <Sparkles size={14} /> Smart Assist
             </button>
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col min-h-0">
        
        {/* Days Header */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200 overflow-x-auto">
          <div className="p-4 text-xs font-semibold text-slate-400 uppercase flex items-center justify-center border-r border-slate-100 shrink-0 sticky left-0 bg-white z-20">
            GMT +7
          </div>
          {DAYS_OF_WEEK.map((day, index) => (
            <div 
              key={day.name} 
              className={`p-3 text-center border-r border-slate-100 last:border-r-0 min-w-[120px] ${day.active ? 'bg-sky-50' : ''}`}
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
          <div className="absolute left-0 right-0 z-10 pointer-events-none flex items-center w-full" style={{ top: `${(11.25 - START_HOUR) * PIXELS_PER_HOUR}px` }}>
            <div className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-r-md shadow-sm z-20 sticky left-0">11:15</div>
            <div className="h-[2px] bg-sky-500 w-full relative">
                <div className="absolute right-0 -top-1 w-2 h-2 bg-sky-500 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] min-h-[800px] w-full">
            
            {/* Time Column */}
            <div className="border-r border-slate-100 bg-white z-20 relative sticky left-0">
              {TIME_SLOTS.map((time, i) => (
                <div key={time} className="text-xs text-slate-400 font-medium p-3 text-center border-b border-slate-50 h-[140px] relative bg-white">
                  <span className="-top-3 relative bg-white px-1">{time}</span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {DAYS_OF_WEEK.map((day, dayIdx) => (
              <div key={dayIdx} className={`relative border-r border-slate-100 last:border-r-0 min-w-[120px] ${day.active ? 'bg-sky-50/20' : ''}`}>
                 
                 {/* Background Grid Lines (matching time column) */}
                 {TIME_SLOTS.map((_, tIdx) => (
                   <div key={tIdx} className="border-b border-slate-50 h-[140px] w-full"></div>
                 ))}

                 {/* Break Time Visual (12:00 - 13:00) */}
                 <div 
                    className="absolute w-full flex items-center justify-center opacity-60 z-0 pointer-events-none"
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

      {/* AI Suggestions Modal */}
      {showAiModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-xl">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 border border-white/50 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles size={20} />
                <h3 className="font-bold">Smart Assistant</h3>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            
            {aiLoading ? (
               <div className="py-8 flex flex-col items-center gap-3 text-slate-500">
                 <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-xs font-medium">Analyzing schedule...</p>
               </div>
            ) : (
              <div className="prose prose-sm prose-slate max-w-none">
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100" dangerouslySetInnerHTML={{ __html: aiSuggestion }}></div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setShowAiModal(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};