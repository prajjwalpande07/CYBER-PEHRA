import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const MainLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans">
      {/* Top Disclaimer Banner */}
      <div className="bg-amber-950/40 border-b border-amber-600/30 px-4 py-1 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>
          <strong>CYBER PEHRA PROTOTYPE</strong> — Demonstration Environment using synthetic test data. For Hackathon / SIH presentation only.
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* Header */}
          <div className="flex items-center">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-3 lg:hidden text-slate-400 hover:text-white bg-[#090e1d] border-b border-slate-800"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <Header />
            </div>
          </div>

          {/* Page Outlet */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#080d1a]">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal />
    </div>
  );
};
