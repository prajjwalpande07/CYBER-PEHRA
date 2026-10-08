import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ShieldCheck, Eye, Compass } from 'lucide-react';
import { useCyberPehra } from '../../context/CyberPehraContext';
import { RiskScoreBadge } from '../common/RiskScoreBadge';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR } from '../../utils/formatters';

export const PredictedLocationsTable: React.FC = () => {
  const { locations, dispatchTeam } = useCyberPehra();
  const navigate = useNavigate();

  // Show top 6 highest risk locations
  const topLocations = [...locations]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  return (
    <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            High-Risk Predicted Withdrawal Locations (ATMs & Branches)
          </h3>
        </div>
        <button
          onClick={() => navigate('/locations')}
          className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <span>View All Locations ({locations.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Location & ATM</th>
              <th className="py-2.5 px-3">State / District</th>
              <th className="py-2.5 px-3">Risk Score</th>
              <th className="py-2.5 px-3">Predicted Time Window</th>
              <th className="py-2.5 px-3">Amount at Risk</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {topLocations.map((loc) => (
              <tr
                key={loc.id}
                className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                onClick={() => navigate(`/locations/${loc.id}`)}
              >
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">
                    {loc.name}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                    <span>{loc.id}</span>
                    <span>•</span>
                    <span className="text-slate-300">{loc.bankName}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-200 font-medium">{loc.district}</div>
                  <div className="text-slate-400 text-[11px]">{loc.state}</div>
                </td>
                <td className="py-3 px-3">
                  <RiskScoreBadge score={loc.riskScore} level={loc.riskLevel} />
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-200 font-medium">{loc.predictedTimeWindow}</div>
                  <div className="text-slate-400 text-[10px] font-mono">
                    Confidence: <strong className="text-sky-400">{loc.confidenceScore}%</strong>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-100">
                  {formatINR(loc.amountAtRisk)}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={loc.status} size="sm" />
                </td>
                <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => navigate(`/locations/${loc.id}`)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors flex items-center gap-1"
                      title="Inspect Explainable Risk Card"
                    >
                      <Eye className="w-3 h-3 text-sky-400" />
                      <span>Risk Card</span>
                    </button>
                    {loc.status !== 'Patrol Dispatched' && (
                      <button
                        onClick={() => dispatchTeam(`INV-7731`, loc.id)}
                        className="px-2.5 py-1 rounded bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/40 text-[11px] transition-colors flex items-center gap-1"
                        title="Deploy QRT Patrol to ATM"
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
  );
};
