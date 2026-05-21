import React from 'react';
import Sidebar from './components/sidebar';
import Dashboard from './pages/dashboard';

export default function App() {
  return (
    <div className="flex flex-row h-screen w-screen bg-[#fafafa] antialiased overflow-hidden m-0 p-0">
      {/* We wrap the Sidebar in a container that forces it 
        to stay exactly 16rem (w-64) wide and never squish to 0
      */}
      <div className="w-64 min-w-[16rem] h-full flex-shrink-0 z-10">
        <Sidebar />
      </div>
      
      {/* The Dashboard is forced to take up exactly the remaining space 
        available on the screen (flex-1) and handle its own vertical scroll
      */}
      <div className="flex-1 h-full min-w-0 overflow-y-auto">
        <Dashboard />
      </div>
    </div>
  );
}