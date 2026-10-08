import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Building,
  CreditCard,
  ShieldAlert,
  Clock,
  Compass,
  FileText,
  Lock,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { ExplainableRiskCard } from '../components/explainable/ExplainableRiskCard';
import { RiskScoreBadge } from '../components/common/RiskScoreBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatINR } from '../utils/formatters';

export const LocationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { locations, complaints, dispatchTeam, markSurveillance, freezeAccount } = useCyberPehra();

  const location = locations.find((l) => l.id === id) || locations[0];

  const linkedComplaints = complaints.filter(
    (c) =>
      c.predictedLocationId === location.id ||
      location.linkedComplaintIds.includes(c.id)
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Back link & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/locations')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-amber-400 font-bold">{location.id}</span>
              <span className="text-slate-500">•</span>
              <h1 className="text-xl font-bold text-slate-100">{location.name}</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {location.address} • {location.district}, {location.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <RiskScoreBadge score={location.riskScore} level={location.riskLevel} />
          <StatusBadge status={location.status} />
        </div>
      </div>

      {/* Facility Specs & Tactical Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Bank & Terminal Type</span>
          <div className="text-sm font-bold text-slate-200">{location.bankName}</div>
          <span className="text-xs text-slate-400">{location.type}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Predicted Withdrawal Window</span>
          <div className="text-sm font-bold font-mono text-amber-400">{location.predictedTimeWindow}</div>
          <span className="text-xs text-slate-400">Confidence: {location.confidenceScore}%</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Estimated Amount at Risk</span>
          <div className="text-sm font-bold font-mono text-red-400">{formatINR(location.amountAtRisk)}</div>
          <span className="text-xs text-slate-400">Dispenser Pool: {formatINR(location.cashReserve)}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Jurisdiction & CCTV</span>
          <div className="text-xs font-semibold text-slate-200 truncate">{location.nearestPoliceStation}</div>
          <span className={`text-[11px] font-mono ${location.cctvOperational ? 'text-emerald-400' : 'text-red-400'}`}>
            {location.cctvOperational ? '● CCTV Operational' : '▲ CCTV Down'} ({location.distanceToPatrolKm} km to QRT)
          </span>
        </div>
      </div>

      {/* Explainable Risk Card Component */}
      <ExplainableRiskCard
        location={location}
        onDispatchPatrol={() => dispatchTeam('INV-7731', location.id)}
        onMarkSurveillance={() => markSurveillance(location.id)}
      />

      {/* Linked Active Complaints */}
      <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Linked Cybercrime Tranches ({linkedComplaints.length})
          </h3>
        </div>

        {linkedComplaints.length > 0 ? (
          <div className="divide-y divide-slate-800/60 text-xs">
            {linkedComplaints.map((comp) => (
              <div key={comp.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono">
                    <strong className="text-sky-400">{comp.id}</strong>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-200 font-sans font-medium">{comp.complaintType}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-sans">{comp.victimName}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Suspected Mule: <span className="font-mono text-amber-300">{comp.suspectedAccount}</span> • Amount:{' '}
                    <strong className="text-slate-200">{formatINR(comp.transactionAmount)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RiskScoreBadge score={comp.riskScore} level={comp.riskLevel} />
                  <button
                    onClick={() => freezeAccount('INV-7731', comp.suspectedAccount, comp.transactionAmount)}
                    className="px-3 py-1 rounded bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 text-[11px] font-medium transition-colors flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Freeze Card</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            No complaints currently linked directly to this terminal. Pre-emptive monitoring active.
          </p>
        )}
      </div>
    </div>
  );
};
