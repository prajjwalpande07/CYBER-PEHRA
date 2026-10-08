import React from 'react';
import {
  FileText,
  AlertOctagon,
  MapPin,
  BellRing,
  ShieldCheck,
  IndianRupee,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useCyberPehra } from '../../context/CyberPehraContext';
import { formatINR } from '../../utils/formatters';

export const KpiCards: React.FC = () => {
  const { complaints, locations, alerts, investigations } = useCyberPehra();

  const totalComplaints = complaints.length;
  const highRiskComplaints = complaints.filter(
    (c) => c.riskLevel === 'CRITICAL' || c.riskLevel === 'HIGH'
  ).length;
  const predictedLocationsCount = locations.filter(
    (l) => l.riskScore >= 75
  ).length;
  const activeAlerts = alerts.filter(
    (a) => a.severity === 'CRITICAL' || a.status === 'Delivered' || a.status === 'Sent'
  ).length;
  const casesUnderInvestigation = investigations.filter(
    (i) => i.status !== 'Closed'
  ).length;
  const totalFundsAtRisk = complaints.reduce((sum, c) => sum + c.transactionAmount, 0);

  const kpis = [
    {
      title: 'Total Complaints',
      value: totalComplaints.toString(),
      trend: '+14% vs yesterday',
      icon: <FileText className="w-5 h-5 text-sky-400" />,
      subtext: 'Ingested via NCRP / 1930',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      borderHover: 'hover:border-sky-500/40',
    },
    {
      title: 'High-Risk Complaints',
      value: highRiskComplaints.toString(),
      trend: '68% of active tranches',
      icon: <AlertOctagon className="w-5 h-5 text-red-400" />,
      subtext: 'Score > 75 (Immediate threat)',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20',
      borderHover: 'hover:border-red-500/40',
    },
    {
      title: 'Predicted Locations',
      value: predictedLocationsCount.toString(),
      trend: '91.4% confidence avg',
      icon: <MapPin className="w-5 h-5 text-amber-400" />,
      subtext: 'ATMs & Cash-out Kiosks',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      borderHover: 'hover:border-amber-500/40',
    },
    {
      title: 'Active Alerts',
      value: activeAlerts.toString(),
      trend: 'Dispatched to QRT / Banks',
      icon: <BellRing className="w-5 h-5 text-orange-400" />,
      subtext: 'SMS, NPCI API & Terminals',
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      borderHover: 'hover:border-orange-500/40',
    },
    {
      title: 'Under Investigation',
      value: casesUnderInvestigation.toString(),
      trend: '8 patrols deployed',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      subtext: 'Cross-jurisdiction LEA teams',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      borderHover: 'hover:border-emerald-500/40',
    },
    {
      title: 'Total Funds at Risk',
      value: formatINR(totalFundsAtRisk),
      trend: '₹53.8L frozen in time',
      icon: <IndianRupee className="w-5 h-5 text-purple-400" />,
      subtext: 'Across active mule hops',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      borderHover: 'hover:border-purple-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm transition-all duration-200 ${kpi.borderHover} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">{kpi.icon}</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
              {kpi.value}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className={`px-1.5 py-0.5 rounded border font-medium ${kpi.badgeBg}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400">{kpi.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
