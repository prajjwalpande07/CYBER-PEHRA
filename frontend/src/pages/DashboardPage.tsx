import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  PlusCircle,
  BrainCircuit,
  MapPin,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { KpiCards } from '../components/dashboard/KpiCards';
import { ComplaintTrendChart } from '../components/dashboard/ComplaintTrendChart';
import { RiskDistributionChart } from '../components/dashboard/RiskDistributionChart';
import { PredictedLocationsTable } from '../components/dashboard/PredictedLocationsTable';
import { LiveAlertsFeed } from '../components/dashboard/LiveAlertsFeed';
import { SystemHealthPanel } from '../components/dashboard/SystemHealthPanel';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole, modelMetrics } = useCyberPehra();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Operational Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              CYBER PEHRA — Predictive Intelligence & Intervention Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Forecasting cybercrime cash withdrawal locations in advance • Active Persona:{' '}
            <strong className="text-sky-300">
              {currentRole === 'LEA'
                ? 'Law Enforcement Agency (Crime Branch)'
                : currentRole === 'BANK'
                ? 'Bank & FI Fraud Desk'
                : currentRole === 'I4C'
                ? 'I4C National Grid'
                : 'Data Science & Admin'}
            </strong>
          </p>
        </div>

        {/* Quick Operational Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/complaints/new')}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-lg shadow-sky-900/30 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Complaint</span>
          </button>
          <button
            onClick={() => navigate('/predictions')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Run Prediction</span>
          </button>
          <button
            onClick={() => navigate('/heatmap')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>GIS Radar</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <KpiCards />

      {/* Row 1: Trends & Severity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ComplaintTrendChart />
        </div>
        <div>
          <RiskDistributionChart />
        </div>
      </div>

      {/* Row 2: High Risk Predicted Locations Table */}
      <PredictedLocationsTable />

      {/* Row 3: Live Alerts and Continuous Learning Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveAlertsFeed />
        </div>

        {/* Continuous Learning Loop Highlight Card */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-100">Continuous AI Retraining</h3>
              </div>
              <span className="font-mono text-xs text-sky-400 font-bold bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                {modelMetrics.version}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated feedback loop between field officers and predictive weights
            </p>
          </div>

          {/* Workflow Micro Flow */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>Model Accuracy</span>
              <strong className="text-emerald-400 font-mono">{modelMetrics.accuracy}%</strong>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${modelMetrics.accuracy}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-slate-300 pt-1">
              <span>False Positive Resilience</span>
              <strong className="text-sky-400 font-mono">{modelMetrics.falsePositiveRate}%</strong>
            </div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              Field Action → Ground Truth Feedback → Retrain Pipeline
            </div>
          </div>

          <button
            onClick={() => navigate('/model-monitoring')}
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <span>Inspect Model Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 4: System Health Panel */}
      <SystemHealthPanel />
    </div>
  );
};
