import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  MapPin,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { RiskScoreBadge } from '../components/common/RiskScoreBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatINR } from '../utils/formatters';

export const WithdrawalLocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { locations, dispatchTeam } = useCyberPehra();

  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('ALL');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState<'risk' | 'amount' | 'confidence'>('risk');

  const filtered = locations
    .filter((loc) => {
      if (filterState !== 'ALL' && loc.state !== filterState) return false;
      if (filterLevel !== 'ALL' && loc.riskLevel !== filterLevel) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.bankName.toLowerCase().includes(q) ||
          loc.district.toLowerCase().includes(q) ||
          loc.address.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'risk') return b.riskScore - a.riskScore;
      if (sortBy === 'amount') return b.amountAtRisk - a.amountAtRisk;
      if (sortBy === 'confidence') return b.confidenceScore - a.confidenceScore;
      return 0;
    });

  const states = Array.from(new Set(locations.map((l) => l.state)));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Withdrawal Location Forecasting Registry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ranked list of ATMs, CSP kiosks, and bank branches predicted as high-probability cybercrime cash-out sites
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/heatmap')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Heatmap</span>
          </button>
        </div>
      </div>

      {/* Filter and Sorting Header Bar */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ATM name, bank, district..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All States ({states.length})</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical (&gt;90)</option>
            <option value="HIGH">High (75-89)</option>
            <option value="MEDIUM">Medium (60-74)</option>
            <option value="LOW">Low (&lt;60)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs font-mono"
          >
            <option value="risk">Sort by: Risk Score (High → Low)</option>
            <option value="amount">Sort by: Amount at Risk</option>
            <option value="confidence">Sort by: AI Confidence</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-[#0b1329]">
                <th className="py-3 px-4">ATM / Branch Name</th>
                <th className="py-3 px-4">State & District</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Predicted Time Window</th>
                <th className="py-3 px-4">Amount at Risk</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((loc) => (
                <tr
                  key={loc.id}
                  onClick={() => navigate(`/locations/${loc.id}`)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                      {loc.name}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                      <span>{loc.id}</span>
                      <span>•</span>
                      <span className="text-slate-300">{loc.bankName}</span>
                      <span>•</span>
                      <span className="text-slate-400">{loc.type}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-medium">{loc.district}</div>
                    <div className="text-slate-400 text-[11px]">{loc.state}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskScoreBadge score={loc.riskScore} level={loc.riskLevel} />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-200">{loc.predictedTimeWindow}</div>
                    <div className="text-slate-400 text-[10px]">
                      Patrol: {loc.distanceToPatrolKm} km away
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                    {formatINR(loc.amountAtRisk)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-sky-400">
                    {loc.confidenceScore}%
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={loc.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/locations/${loc.id}`)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors flex items-center gap-1"
                        title="View Full Explainable Risk Card"
                      >
                        <Eye className="w-3 h-3 text-sky-400" />
                        <span>Inspect</span>
                      </button>
                      {loc.status !== 'Patrol Dispatched' && (
                        <button
                          onClick={() => dispatchTeam('INV-7731', loc.id)}
                          className="px-2.5 py-1 rounded bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/40 text-[11px] transition-colors flex items-center gap-1"
                          title="Deploy QRT Patrol Team"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Dispatch</span>
                        </button>
                      )}
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
