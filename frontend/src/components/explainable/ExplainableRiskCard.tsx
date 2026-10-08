import React from 'react';
import {
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Compass,
  CreditCard,
  Network,
  CheckCircle,
} from 'lucide-react';
import { WithdrawalLocation, RiskFactor } from '../../types';
import { RiskScoreBadge } from '../common/RiskScoreBadge';
import { getRiskColorClass } from '../../utils/formatters';

interface ExplainableRiskCardProps {
  location: WithdrawalLocation;
  onDispatchPatrol?: () => void;
  onMarkSurveillance?: () => void;
}

export const ExplainableRiskCard: React.FC<ExplainableRiskCardProps> = ({
  location,
  onDispatchPatrol,
  onMarkSurveillance,
}) => {
  const colors = getRiskColorClass(location.riskLevel);

  const getCategoryIcon = (category: RiskFactor['category']) => {
    switch (category) {
      case 'mule':
        return <CreditCard className="w-3.5 h-3.5 text-red-400" />;
      case 'temporal':
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      case 'spatial':
        return <Compass className="w-3.5 h-3.5 text-sky-400" />;
      case 'network':
        return <Network className="w-3.5 h-3.5 text-purple-400" />;
      case 'transactional':
      default:
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const totalCalculatedScore = location.reasons.reduce((acc, curr) => acc + curr.impact, 0);

  return (
    <div className="rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0b1329] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-100">
              EXPLAINABLE RISK CARD — Why Was This Location Flagged?
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            XAI Feature Attribution Breakdown & Spatio-Temporal Anomaly Signals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RiskScoreBadge score={location.riskScore} level={location.riskLevel} />
          <div className="hidden sm:block text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">AI Confidence</span>
            <span className="text-xs font-mono font-bold text-sky-400">{location.confidenceScore}%</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Core summary grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Flagged Entity:</span>
            <span className="font-semibold text-slate-200 text-sm">{location.name}</span>
            <span className="text-slate-400 block text-[11px] font-mono mt-0.5">{location.address}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Forecasted Cash-Out Window:</span>
            <span className="font-semibold text-amber-400 font-mono text-sm">{location.predictedTimeWindow}</span>
            <span className="text-slate-400 block text-[11px] mt-0.5">
              Nearest Police: <strong className="text-slate-300">{location.nearestPoliceStation}</strong>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Surveillance & Camera:</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                  location.cctvOperational
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}
              >
                {location.cctvOperational ? '✓ CCTV Operational' : '⚠ CCTV Offline / Degraded'}
              </span>
            </div>
            <span className="text-slate-400 block text-[11px] font-mono mt-1">
              Patrol Proximity: {location.distanceToPatrolKm} km
            </span>
          </div>
        </div>

        {/* Feature Attribution List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400">
              Factor Attribution Weights (Normalized to 100)
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              Cumulative Factor Sum: <strong className="text-sky-400">+{totalCalculatedScore} pts</strong>
            </span>
          </div>

          <div className="space-y-2.5">
            {location.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-slate-800 border border-slate-700">
                      {getCategoryIcon(reason.category)}
                    </span>
                    <span className="font-semibold text-slate-200 text-xs">{reason.factor}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {reason.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
                      +{reason.impact}
                    </span>
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed pl-8">
                  {reason.description}
                </p>

                {/* Micro progress weight bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, reason.impact * 2.8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Recommendations Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>Recommended Tactical Interventions</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>
              Deploy <strong>{location.nearestPoliceStation}</strong> patrol vehicle to stage within 200m of the ATM vestibule.
            </li>
            <li>
              Notify <strong>{location.bankName} Nodal Officer</strong> to place instantaneous Section 102 debit freeze on linked cards:
              {location.linkedMuleAccounts.map((acc, i) => (
                <span key={i} className="font-mono text-amber-300 mx-1 bg-slate-800 px-1 py-0.2 rounded text-[11px]">
                  {acc}
                </span>
              ))}
            </li>
            <li>
              Instruct ATM custodian to restrict cash dispenser notes to maximum single withdrawal limit of ₹10,000.
            </li>
          </ul>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            {onDispatchPatrol && (
              <button
                onClick={onDispatchPatrol}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-lg shadow-sky-900/30 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Dispatch Quick Response Team (QRT)</span>
              </button>
            )}
            {onMarkSurveillance && (
              <button
                onClick={onMarkSurveillance}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Activate Drone & CCTV Surveillance</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
