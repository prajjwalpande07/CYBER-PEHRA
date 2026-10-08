import React from 'react';
import {
  Globe,
  Share2,
  Building,
  ShieldAlert,
  ArrowRight,
  Send,
  CheckCircle2,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { formatINR } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const I4CCoordinationPage: React.FC = () => {
  const { complaints, alerts, investigations, addToast } = useCyberPehra();

  // State-wise breakdown
  const stateSummary = [
    { state: 'Maharashtra', alerts: 5, totalRisk: 3650000, hotZone: 'Nanded, Pune, Mumbai', activeMules: 14 },
    { state: 'Karnataka', alerts: 3, totalRisk: 3200000, hotZone: 'Bengaluru Indiranagar', activeMules: 9 },
    { state: 'Rajasthan', alerts: 4, totalRisk: 950000, hotZone: 'Bharatpur, Alwar, Mewat', activeMules: 22 },
    { state: 'Gujarat', alerts: 2, totalRisk: 1100000, hotZone: 'Surat Diamond Market', activeMules: 7 },
    { state: 'Telangana', alerts: 2, totalRisk: 890000, hotZone: 'Cyberabad Hitec City', activeMules: 8 },
    { state: 'Jharkhand', alerts: 3, totalRisk: 720000, hotZone: 'Jamtara Karmatanr', activeMules: 35 },
    { state: 'Delhi NCR', alerts: 2, totalRisk: 510000, hotZone: 'Connaught Place, Gurugram', activeMules: 11 },
  ];

  // Cross-jurisdiction cases
  const crossJurisdictionCases = [
    {
      caseId: 'I4C-X-901',
      title: 'Digital Arrest Interstate Syndicate',
      origin: 'Pune (Maharashtra)',
      transitHop: 'Alwar (Rajasthan)',
      cashOutTarget: 'Nanded SBI ATM (Maharashtra)',
      amount: 2200000,
      agencies: ['Maharashtra Cyber', 'Rajasthan Police CID', 'Kotak Mahindra Nodal'],
      status: 'Joint Taskforce Active',
    },
    {
      caseId: 'I4C-X-902',
      title: 'Fake Institutional IPO Allotment App',
      origin: 'Bengaluru (Karnataka)',
      transitHop: 'Surat Hawala Desk (Gujarat)',
      cashOutTarget: 'Indiranagar ICICI E-Lobby',
      amount: 3200000,
      agencies: ['Karnataka CID', 'Gujarat Cyber Cell', 'Yes Bank Fraud Desk'],
      status: 'Escalated to MHA',
    },
    {
      caseId: 'I4C-X-903',
      title: 'Mewat Electricity Bill Phishing Wave',
      origin: 'Jaipur (Rajasthan)',
      transitHop: 'Bharatpur Kaman Junction',
      cashOutTarget: 'PNB Bharatpur Highway Kiosk',
      amount: 185000,
      agencies: ['Rajasthan Police', 'Haryana Cyber Thana', 'Airtel Payments Bank'],
      status: 'Patrol Deployed',
    },
  ];

  const handleDeployTaskforce = (caseTitle: string) => {
    addToast({
      title: 'Inter-State Taskforce Deployed',
      message: `I4C Joint Taskforce notified for "${caseTitle}". Direct tactical bridge active.`,
      type: 'warning',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Globe className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Indian Cyber Crime Coordination Centre (I4C) — Inter-State Grid
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ministry of Home Affairs (MHA) National Coordination • Inter-State Taskforces & Pan-India Fund Flow Tracing
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-purple-950/40 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg">
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>36 STATES & UTs SYNCHRONIZED</span>
        </div>
      </div>

      {/* Cross-Jurisdiction Escalation Cases */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Active Inter-State Cross-Jurisdiction Syndicates
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Multi-State Section 166 CrPC Coordination
          </span>
        </div>

        <div className="space-y-3">
          {crossJurisdictionCases.map((cs) => (
            <div
              key={cs.caseId}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-bold text-purple-400">{cs.caseId}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-bold text-slate-100">{cs.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-400">
                    {formatINR(cs.amount)}
                  </span>
                  <StatusBadge status={cs.status} size="sm" />
                </div>
              </div>

              {/* Fund Route Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs p-2.5 rounded-lg bg-[#070b14] border border-slate-800/80 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">1. Victim Origin:</span>
                  <span className="text-slate-200 font-semibold">{cs.origin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">2. Transit / Layering Hop:</span>
                  <span className="text-amber-300 font-semibold">{cs.transitHop}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">3. Target Cash-Out Hub:</span>
                  <span className="text-red-400 font-semibold">{cs.cashOutTarget}</span>
                </div>
              </div>

              {/* Participating Agencies & Dispatch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-slate-500">Coordinating Units:</span>
                  {cs.agencies.map((ag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {ag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleDeployTaskforce(cs.title)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-purple-900/30"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Deploy Joint Taskforce</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* State-wise Threat Matrix Table */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">State-wise Cybercrime Heat & Mule Density</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">National Radar Matrix</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">State / Jurisdiction</th>
                <th className="py-2.5 px-3">Active Alerts</th>
                <th className="py-2.5 px-3">Capital Under Threat</th>
                <th className="py-2.5 px-3">Identified Hotspot Clusters</th>
                <th className="py-2.5 px-3">Flagged Mule Accounts</th>
                <th className="py-2.5 px-3 text-right">Coordination Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stateSummary.map((st, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-200">{st.state}</td>
                  <td className="py-3 px-3 font-mono text-orange-400 font-bold">{st.alerts}</td>
                  <td className="py-3 px-3 font-mono font-bold text-purple-400">{formatINR(st.totalRisk)}</td>
                  <td className="py-3 px-3 text-slate-300">{st.hotZone}</td>
                  <td className="py-3 px-3 font-mono text-amber-300 font-bold">{st.activeMules}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                      ✓ Synchronized
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
