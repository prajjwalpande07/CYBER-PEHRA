import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  PlusCircle,
  BrainCircuit,
  Map,
  Compass,
  GitFork,
  BellRing,
  ShieldCheck,
  Building2,
  Globe,
  MessageSquareCheck,
  Blocks,
  LineChart,
  Layers,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { useCyberPehra } from '../../context/CyberPehraContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavLinkItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
  badge?: number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  links: NavLinkItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { alerts, investigations } = useCyberPehra();

  const activeAlertsCount = alerts.filter(
    (a) => a.severity === 'CRITICAL' || a.status === 'Delivered'
  ).length;

  const openCasesCount = investigations.filter(
    (i) => i.status !== 'Closed' && i.status !== 'Intervention Completed'
  ).length;

  const navSections: NavSection[] = [
    {
      title: 'COMMAND CENTER',
      links: [
        { to: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { to: '/complaints', label: 'Complaints', icon: <FileSpreadsheet className="w-4 h-4" /> },
        { to: '/complaints/new', label: 'New Complaint', icon: <PlusCircle className="w-4 h-4 text-sky-400" />, highlight: true },
        { to: '/predictions', label: 'Predictive Analytics', icon: <BrainCircuit className="w-4 h-4" /> },
      ],
    },
    {
      title: 'GEOSPATIAL & INTELLIGENCE',
      links: [
        { to: '/heatmap', label: 'Risk Heatmap (GIS)', icon: <Map className="w-4 h-4" /> },
        { to: '/locations', label: 'Withdrawal Locations', icon: <Compass className="w-4 h-4" /> },
        { to: '/mule-network', label: 'Mule Network Graph', icon: <GitFork className="w-4 h-4" /> },
      ],
    },
    {
      title: 'OPERATIONAL INTERVENTION',
      links: [
        {
          to: '/alerts',
          label: 'Real-time Alerts',
          icon: <BellRing className="w-4 h-4" />,
          badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
          badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
        },
        {
          to: '/investigations',
          label: 'LEA Investigations',
          icon: <ShieldCheck className="w-4 h-4" />,
          badge: openCasesCount > 0 ? openCasesCount : undefined,
          badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
        },
        { to: '/bank-portal', label: 'Bank & FI Portal', icon: <Building2 className="w-4 h-4" /> },
        { to: '/i4c-coordination', label: 'I4C Coordination', icon: <Globe className="w-4 h-4" /> },
      ],
    },
    {
      title: 'AUDIT & CONTINUOUS LEARNING',
      links: [
        { to: '/feedback', label: 'Officer Feedback', icon: <MessageSquareCheck className="w-4 h-4" /> },
        { to: '/audit-trail', label: 'Blockchain Audit Trail', icon: <Blocks className="w-4 h-4" /> },
        { to: '/model-monitoring', label: 'Model Retraining', icon: <LineChart className="w-4 h-4" /> },
        { to: '/data-fusion', label: 'Data Fusion Pipeline', icon: <Layers className="w-4 h-4" /> },
        { to: '/settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#090e1d] border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-600 to-blue-800 p-0.5 flex items-center justify-center shadow-lg shadow-sky-900/30">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-sky-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                CYBER PEHRA
              </span>
              <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold">
                PRO
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight">
              Predictive Intervention Grid
            </div>
          </div>
        </div>

        {/* Navigation items scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
              <div className="space-y-0.5 pt-1">
                {section.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40 shadow-sm'
                          : link.highlight
                          ? 'bg-sky-950/40 text-sky-300 hover:bg-sky-900/30 hover:text-white border border-sky-800/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                          link.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Prototype banner */}
        <div className="p-3 border-t border-slate-800 bg-[#070b14] text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            PROTOTYPE DEMONSTRATION
          </div>
          <p className="text-[10px] text-slate-400">
            I4C & Indian Cyber Police Framework
          </p>
        </div>
      </aside>
    </>
  );
};
