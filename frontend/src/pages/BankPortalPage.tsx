import React from 'react';
import {
  Building2,
  Lock,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Download,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { formatINR, formatDateTime } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const BankPortalPage: React.FC = () => {
  const { investigations, complaints, locations, freezeAccount, addToast } = useCyberPehra();

  const totalFundsRecovered = investigations.reduce((sum, i) => sum + (i.amountRecovered || 0), 0);
  const pendingRequests = investigations.filter((i) => i.accountFreezeStatus === 'Requested');
  const frozenCount = investigations.filter((i) => i.accountFreezeStatus.includes('Frozen'));

  const handleThrottleAtm = (locName: string) => {
    addToast({
      title: 'ATM Cash-out Limit Enforced',
      message: `Terminal ${locName} cash withdrawal limit capped at ₹10,000 via CBS switch.`,
      type: 'warning',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Bank & Financial Institution (FI) Fraud Desk Portal
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Section 102 CrPC Legal Lien Management • Real-time NPCI Fraud Monitoring & ATM Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Recovered / Frozen:{' '}
            <strong className="text-emerald-400 font-bold">{formatINR(totalFundsRecovered)}</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards for Banks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Pending Freeze Notices</span>
          <div className="text-2xl font-bold font-mono text-amber-400">{pendingRequests.length}</div>
          <span className="text-[11px] text-slate-500">Sec 102 CrPC Legal Requests</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Accounts Locked / Lien Placed</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">{frozenCount.length}</div>
          <span className="text-[11px] text-slate-500">Mule debit blocks enforced</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Monitored ATM Dispensers</span>
          <div className="text-2xl font-bold font-mono text-sky-400">{locations.length}</div>
          <span className="text-[11px] text-slate-500">Cross-bank ATM networks</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Preserved Victim Capital</span>
          <div className="text-2xl font-bold font-mono text-purple-400">{formatINR(totalFundsRecovered)}</div>
          <span className="text-[11px] text-slate-500">Saved from physical cash-out</span>
        </div>
      </div>

      {/* Section 1: Pending Section 102 CrPC Freeze Requests */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Urgent Section 102 CrPC Account Freeze & Lien Requests
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            {pendingRequests.length} ACTION REQUIRED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Suspected Account & Bank</th>
                <th className="py-2.5 px-3">Mule Associate Name</th>
                <th className="py-2.5 px-3">Preserved Balance</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3 text-right">Bank Nodal Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {investigations.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-sky-400">{inv.id}</td>
                  <td className="py-3 px-3 font-mono">
                    <span className="text-amber-300 font-semibold">{inv.suspectedAccount}</span>
                    <div className="text-[10px] text-slate-400">{inv.complaintTitle}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-medium">{inv.suspectedMuleName}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {formatINR(inv.amountRecovered > 0 ? inv.amountRecovered : 650000)}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={inv.accountFreezeStatus} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    {inv.accountFreezeStatus === 'Requested' || inv.accountFreezeStatus === 'None' ? (
                      <button
                        onClick={() => freezeAccount(inv.id, inv.suspectedAccount)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-medium text-[11px] transition-colors shadow-sm flex items-center gap-1.5 ml-auto"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Enforce Sec 102 Freeze</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-mono font-semibold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Debit Block Active</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Targeted ATM Dispenser Controls */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">
              High-Risk ATM Telemetry & Emergency Cash Throttle
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            NPCI ATM Switch Control Interface
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.slice(0, 3).map((loc) => (
            <div
              key={loc.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{loc.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{loc.bankName} • {loc.id}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                  Risk: {loc.riskScore}/100
                </span>
              </div>

              <div className="text-[11px] text-slate-300 space-y-1">
                <div>Window: <strong className="text-amber-300">{loc.predictedTimeWindow}</strong></div>
                <div>Cash in Dispenser: <strong className="font-mono text-slate-100">{formatINR(loc.cashReserve)}</strong></div>
              </div>

              <button
                onClick={() => handleThrottleAtm(loc.name)}
                className="w-full py-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Throttle Max Single Withdrawal</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
