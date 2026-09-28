import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#EDEDED] flex p-0 md:p-2.5 gap-2.5">
      {/* Permanent Left Sidebar: 240px */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Central Workspace: #111214 with rounded corners and subtle border */}
      <div className="flex-1 flex flex-col md:ml-[240px] min-w-0 bg-[#111214] md:rounded-2xl border-0 md:border md:border-[#272A2F]/80 overflow-hidden shadow-2xl">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
