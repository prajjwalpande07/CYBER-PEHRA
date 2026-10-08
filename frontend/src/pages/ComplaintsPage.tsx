import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  PlusCircle,
  Search,
  Filter,
  BrainCircuit,
  MapPin,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { RiskScoreBadge } from '../components/common/RiskScoreBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatINR, formatDateTime } from '../utils/formatters';

export const ComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const { complaints, runPrediction } = useCyberPehra();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterState, setFilterState] = useState('ALL');

  const filtered = complaints.filter((c) => {
    if (filterType !== 'ALL' && c.complaintType !== filterType) return false;
    if (filterState !== 'ALL' && c.state !== filterState) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.ncrpRef.toLowerCase().includes(q) ||
        c.victimName.toLowerCase().includes(q) ||
        c.suspectedAccount.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAmount = complaints.reduce((sum, c) => sum + c.transactionAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Cybercrime Complaints Ledger</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time NCRP / CFCFRMS Stream • Ingested tranches flagged for predictive intervention
          </p>
        </div>

        <button
          onClick={() => navigate('/complaints/new')}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-sky-900/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Complaint</span>
        </button>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-lg bg-[#0f172a] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Registered</span>
            <div className="text-xl font-bold font-mono text-slate-100">{complaints.length}</div>
          </div>
          <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-1 rounded border border-sky-500/30">
            NCRP Ingest
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f172a] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Funds In Flight</span>
            <div className="text-xl font-bold font-mono text-purple-400">{formatINR(totalAmount)}</div>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2 py-1 rounded border border-purple-500/30">
            Mule Routes
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0f172a] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Predicted Cashouts</span>
            <div className="text-xl font-bold font-mono text-red-400">
              {complaints.filter((c) => c.status === 'Predicted').length}
            </div>
          </div>
          <span className="text-xs font-mono text-red-400 bg-red-950/60 px-2 py-1 rounded border border-red-500/30">
            Action Ready
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, victim, suspected account..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All Cybercrime Categories</option>
            <option value="Digital Arrest">Digital Arrest</option>
            <option value="UPI Phishing">UPI Phishing</option>
            <option value="Part-time Job Fraud">Part-time Job Fraud</option>
            <option value="Fake Investment App">Fake Investment App</option>
            <option value="Loan App Extortion">Loan App Extortion</option>
            <option value="SIM Swap">SIM Swap</option>
            <option value="Sextortion">Sextortion</option>
          </select>

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Delhi">Delhi</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Telangana">Telangana</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-[#0b1329]">
                <th className="py-3 px-4">Complaint ID & Ref</th>
                <th className="py-3 px-4">Victim & Modus</th>
                <th className="py-3 px-4">Suspected Mule Account</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-sky-400">{c.id}</div>
                    <div className="text-[10px] font-mono text-slate-500">{c.ncrpRef}</div>
                    <div className="text-[10px] text-slate-400">{formatDateTime(c.createdAt)}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{c.victimName}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                      {c.complaintType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-amber-300 font-semibold">{c.suspectedAccount}</span>
                    <div className="text-[10px] text-slate-500">Txn: {c.transactionId}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                    {formatINR(c.transactionAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200">{c.district}</div>
                    <div className="text-slate-400 text-[10px]">{c.state}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskScoreBadge score={c.riskScore} level={c.riskLevel} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/predictions?complaintId=${c.id}`)}
                        className="px-2.5 py-1 rounded bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/40 text-[11px] transition-colors flex items-center gap-1"
                        title="Run Predictive Engine"
                      >
                        <BrainCircuit className="w-3 h-3" />
                        <span>Predict</span>
                      </button>
                      <button
                        onClick={() => navigate('/heatmap')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
                        title="View on Map"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>
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
