import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Header />
      
      <main className="lg:pl-64 pt-16 h-screen flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <CalendarView />
        </div>
      </main>
      
      {/* Mobile Overlay (Generic placeholder for responsiveness) */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden hidden"></div>
    </div>
  );
}

export default App;