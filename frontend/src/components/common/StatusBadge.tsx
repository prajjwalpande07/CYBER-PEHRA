import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st.toLowerCase()) {
      case 'team dispatched':
      case 'patrol dispatched':
      case 'action taken':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'frozen (sec 102 crpc)':
      case 'frozen (sec 102)':
      case 'account frozen':
      case 'cash seized':
      case 'intervention completed':
      case 'secured':
      case 'active':
      case 'optimal':
      case 'closed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'alert sent':
      case 'surveillance active':
      case 'under surveillance':
      case 'syncing':
      case 'monitoring':
      case 'predicted':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'critical':
      case 'degraded':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'open':
      case 'delivered':
      case 'analyzing':
      case 'pending review':
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
    }
  };

  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${getBadgeStyle(
        status
      )} ${pad} tracking-wide`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
      {status}
    </span>
  );
};
