import React, { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  Activity,
  User,
  ChevronDown,
  RefreshCw,
  Building2,
  Globe2,
  Cpu,
  BadgeAlert,
  LogOut,
} from 'lucide-react';
import { useCyberPehra } from '../../context/CyberPehraContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { NotificationDrawer } from '../common/NotificationDrawer';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, setSearchModalOpen, resetDemoData } = useCyberPehra();
  const { logout } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'LEA',
      label: 'LEA Cyber Cell Officer',
      desc: 'Investigating Officer / Quick Response Team',
      icon: <Shield className="w-4 h-4 text-sky-400" />,
    },
    {
      role: 'BANK',
      label: 'Bank & FI Nodal Officer',
      desc: 'Fraud Risk Mgmt & Sec 102 Account Freeze',
      icon: <Building2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      role: 'I4C',
      label: 'I4C National Analyst',
      desc: 'MHA National Coordination & Inter-State Grid',
      icon: <Globe2 className="w-4 h-4 text-purple-400" />,
    },
    {
      role: 'ADMIN',
      label: 'Data Scientist / Admin',
      desc: 'Model Retraining, Data Fusion & Ledger Audit',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
    },
  ];

  const currentRoleInfo = roles.find((r) => r.role === currentRole) || roles[0];

  return (
    <header className="sticky top-0 z-30 bg-[#090e1d]/95 backdrop-blur border-b border-slate-800 text-slate-100 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setSearchModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-sky-500/50 text-slate-400 hover:text-slate-200 text-xs transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate">Search complaints, ATMs, cases, accounts...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {/* Live Monitoring Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] tracking-wide">LIVE INTERVENTION GRID</span>
        </div>

        {/* Date Time Live Clock */}
        <div className="hidden md:flex flex-col text-right font-mono text-xs">
          <span className="text-slate-300 font-medium">{currentTime || 'Loading clock...'}</span>
          <span className="text-[10px] text-slate-500">IST (UTC+05:30)</span>
        </div>

        {/* System Health Status */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px]">SYS: OPTIMAL</span>
        </div>

        {/* Notification Center Bell */}
        <NotificationDrawer />

        {/* Reset Demo Data quick button */}
        <button
          onClick={resetDemoData}
          title="Reset Simulation Data"
          className="p-2 rounded-lg bg-slate-900 border border-slate-700/70 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-sky-500/50 transition-colors"
          >
            <div className="w-7 h-7 rounded bg-sky-950 border border-sky-500/30 flex items-center justify-center">
              {currentRoleInfo.icon}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight flex items-center gap-1">
                <span>{currentRoleInfo.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {currentRole === 'LEA'
                  ? 'Insp. V. K. Sharma (MH-CY-1049)'
                  : currentRole === 'BANK'
                  ? 'Nodal Officer (Fraud Desk)'
                  : currentRole === 'I4C'
                  ? 'National Grid Analyst (MHA)'
                  : 'AI Engineer / ML Ops'}
              </div>
            </div>
          </button>

          {roleMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0b1329] border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in duration-100"
              onMouseLeave={() => setRoleMenuOpen(false)}
            >
              <div className="p-2.5 border-b border-slate-800 bg-[#0f172a] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Operational Persona
              </div>
              <div className="p-1 space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setCurrentRole(r.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                      currentRole === r.role
                        ? 'bg-sky-500/15 border border-sky-500/40 text-slate-100'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5">{r.icon}</div>
                    <div>
                      <div className="font-medium text-slate-200">{r.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-800 bg-[#090e1d] text-center text-[10px] text-slate-400">
                Role-Based Access Control (RBAC) Prototype
              </div>
              <div className="p-1 border-t border-slate-800 bg-[#070b14]">
                <button
                  type="button"
                  onClick={() => {
                    setRoleMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="font-medium">Sign Out (Lock Console)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
