import React from 'react';
import { Activity, Database, Cpu, Map, Bell, Server, CheckCircle2 } from 'lucide-react';
import { useCyberPehra } from '../../context/CyberPehraContext';

export const SystemHealthPanel: React.FC = () => {
  const { modelMetrics } = useCyberPehra();

  const services = [
    {
      name: 'Data Ingestion Grid',
      desc: 'NCRP / CFCFRMS Webhook Pipeline',
      status: 'OPERATIONAL',
      latency: '24ms',
      icon: <Server className="w-4 h-4 text-emerald-400" />,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      name: 'ML Predictive Engine',
      desc: `Graph Neural Net (${modelMetrics.version})`,
      status: modelMetrics.status === 'RETRAINING' ? 'RETRAINING' : 'ACTIVE',
      latency: '140ms inference',
      icon: <Cpu className="w-4 h-4 text-sky-400" />,
      color: modelMetrics.status === 'RETRAINING' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      name: 'GIS Spatial Clusterer',
      desc: 'OpenStreetMap & ATM Geodetic Grid',
      status: 'OPERATIONAL',
      latency: '18ms raster',
      icon: <Map className="w-4 h-4 text-purple-400" />,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    {
      name: 'Multi-Channel Alert Bus',
      desc: 'SMS, NPCI Webhooks, LEA Terminals',
      status: 'DELIVERING',
      latency: '99.8% uptime',
      icon: <Bell className="w-4 h-4 text-orange-400" />,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    },
    {
      name: 'National Mule Ledger',
      desc: 'Graph DB & Sharded Cluster',
      status: 'HEALTHY',
      latency: '41,250 nodes',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      name: 'Continuous Learning Queue',
      desc: 'Officer Ground-Truth Ingestion',
      status: 'SYNCHRONIZED',
      latency: `${modelMetrics.accuracy}% accuracy`,
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
  ];

  return (
    <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-100">National Cyber Grid Health & Services</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ALL CLUSTERS NOMINAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 rounded-md bg-slate-800/80 border border-slate-700/60">
                {srv.icon}
              </div>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${srv.color}`}>
                {srv.status}
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">{srv.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{srv.desc}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-1.5">{srv.latency}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
