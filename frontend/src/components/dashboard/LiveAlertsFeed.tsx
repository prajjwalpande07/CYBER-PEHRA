import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellRing, ArrowRight, CheckCheck, Clock } from 'lucide-react';
import { useCyberPehra } from '../../context/CyberPehraContext';
import { RiskScoreBadge } from '../common/RiskScoreBadge';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTime } from '../../utils/formatters';

export const LiveAlertsFeed: React.FC = () => {
  const { alerts, acknowledgeAlert } = useCyberPehra();
  const navigate = useNavigate();

  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-slate-100">Live Dispatched Alerts</h3>
        </div>
        <button
          onClick={() => navigate('/alerts')}
          className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>All Alerts ({alerts.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {recentAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-orange-400">{alert.id}</span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs font-semibold text-slate-200">{alert.title}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Target: <span className="text-slate-300">{alert.locationName}</span> ({alert.district}, {alert.state})
                </div>
              </div>
              <RiskScoreBadge score={alert.riskScore} level={alert.severity} showText={false} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {formatDateTime(alert.timestamp)}
                </span>
                <span>To: <strong className="text-slate-300">{alert.recipient}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={alert.status} size="sm" />
                {alert.status !== 'Acknowledged' && alert.status !== 'Action Taken' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1"
                    title="Acknowledge Receipt"
                  >
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                    <span>Ack</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
