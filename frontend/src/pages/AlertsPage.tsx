import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  Filter,
  CheckCheck,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Send,
  Radio,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { RiskScoreBadge } from '../components/common/RiskScoreBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDateTime, formatINR } from '../utils/formatters';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, acknowledgeAlert, dispatchTeam } = useCyberPehra();

  const [filterType, setFilterType] = useState('ALL');
  const [filterRecipient, setFilterRecipient] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filterType !== 'ALL' && a.type !== filterType) return false;
    if (filterRecipient !== 'ALL' && a.recipient !== filterRecipient) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <BellRing className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Real-time Alert Dispatch & Notification Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated multi-channel push to LEA Quick Response Teams, Bank Nodal Officers, and I4C Interstate Grid
          </p>
        </div>

        {/* Live Channel Status Pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SMS / Telegram Gateway: ACTIVE
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            NPCI API Webhook: SYNCHRONIZED
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-300">
          <Filter className="w-4 h-4 text-orange-400" />
          <span>Filter Alert Pipeline:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All Alert Types</option>
            <option value="Critical Risk Location">Critical Risk Location</option>
            <option value="High Risk ATM">High Risk ATM</option>
            <option value="Suspicious Mule Network">Suspicious Mule Network</option>
            <option value="Imminent Withdrawal">Imminent Withdrawal</option>
            <option value="Cross-Jurisdiction Activity">Cross-Jurisdiction Activity</option>
          </select>

          <select
            value={filterRecipient}
            onChange={(e) => setFilterRecipient(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All Stakeholders</option>
            <option value="Law Enforcement Agencies">Law Enforcement Agencies (LEA)</option>
            <option value="Banks / Financial Institutions">Banks / Financial Institutions</option>
            <option value="I4C">I4C National Analyst</option>
            <option value="Joint Taskforce">Joint Taskforce</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All Delivery Statuses</option>
            <option value="Sent">Sent</option>
            <option value="Delivered">Delivered</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Action Taken">Action Taken</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-500/30">
                  {alert.id}
                </span>
                <span className="text-xs font-bold text-slate-100">{alert.title}</span>
                <RiskScoreBadge score={alert.riskScore} level={alert.severity} showText={false} />
              </div>

              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  Target Node: <strong className="text-slate-100">{alert.locationName}</strong> ({alert.district}, {alert.state})
                </span>
                <span>
                  Stakeholder: <strong className="text-sky-300">{alert.recipient}</strong>
                </span>
                <span>
                  Channel: <span className="font-mono text-slate-400">{alert.channel}</span>
                </span>
                <span>
                  Amount: <strong className="text-red-400 font-mono">{formatINR(alert.amountAtRisk)}</strong>
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                Timestamp: {formatDateTime(alert.timestamp)}
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <StatusBadge status={alert.status} />

              {alert.status !== 'Acknowledged' && alert.status !== 'Action Taken' && (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Acknowledge</span>
                </button>
              )}

              <button
                onClick={() => navigate(`/locations/${alert.locationId}`)}
                className="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/40 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Inspect Target</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
