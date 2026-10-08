import React, { useState } from 'react';
import {
  Settings,
  Shield,
  RefreshCw,
  Sliders,
  CheckCircle,
  Database,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { UserRole } from '../types';

export const SettingsPage: React.FC = () => {
  const { currentRole, setCurrentRole, resetDemoData, addToast } = useCyberPehra();

  const [simSpeed, setSimSpeed] = useState('Real-time (Normal)');
  const [autoPrediction, setAutoPrediction] = useState(true);
  const [telegramAlerts, setTelegramAlerts] = useState(true);
  const [smsGateway, setSmsGateway] = useState(true);
  const [highRiskThreshold, setHighRiskThreshold] = useState(75);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Configuration Saved',
      message: 'System thresholds and simulation settings updated successfully.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              CYBER PEHRA — System & Security Settings
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Platform Configuration • Role-Based Access Control (RBAC) & Tactical Simulation Controls
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-3.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 font-semibold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data to Initial Seed</span>
        </button>
      </div>

      {/* Form Settings */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Operational Role Persona */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-200 text-sm border-b border-slate-800 pb-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Role-Based Operational Persona</span>
          </div>

          <p className="text-slate-400 text-xs">
            Switch between Law Enforcement, Bank Nodal Officer, I4C National Coordinator, and Data Science Administrator views.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'LEA', label: 'LEA Cyber Crime Cell Officer', desc: 'QRT Patrols, Investigations, Case Dossiers' },
              { id: 'BANK', label: 'Bank & FI Nodal Officer', desc: 'Sec 102 Account Freezes, ATM Limits' },
              { id: 'I4C', label: 'I4C National Coordinator', desc: 'Inter-State Taskforces & National Grid' },
              { id: 'ADMIN', label: 'Data Science Administrator', desc: 'Model Retraining, Data Fusion & Audit Ledger' },
            ].map((r) => (
              <label
                key={r.id}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                  currentRole === r.id
                    ? 'bg-sky-950/40 border-sky-500/60 ring-1 ring-sky-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.id}
                  checked={currentRole === r.id}
                  onChange={() => setCurrentRole(r.id as UserRole)}
                  className="mt-1 text-sky-600 bg-slate-900 border-slate-700"
                />
                <div>
                  <strong className="text-slate-200 block text-xs">{r.label}</strong>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{r.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* AI Model & Threshold Settings */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-200 text-sm border-b border-slate-800 pb-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span>AI Predictive Model & Alert Thresholds</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-300 font-medium">High-Risk Escalation Threshold</span>
                <span className="font-mono font-bold text-sky-400">{highRiskThreshold}/100</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">
                Complaints scoring above this threshold immediately trigger automatic QRT patrol dispatches and bank webhook hold alerts.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <strong className="text-slate-200 block">Automated Predictive Workflow on Ingestion</strong>
                <span className="text-[11px] text-slate-400">
                  Run GNN and Spatio-Temporal forecast immediately upon new complaint registration
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoPrediction}
                onChange={(e) => setAutoPrediction(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-sky-600 w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <strong className="text-slate-200 block">Emergency Telegram Bot & SMS Dispatches</strong>
                <span className="text-[11px] text-slate-400">
                  Push instant coordinates to nearest patrolling officer vehicles
                </span>
              </div>
              <input
                type="checkbox"
                checked={telegramAlerts}
                onChange={(e) => setTelegramAlerts(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-sky-600 w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* Prototype Environment Details */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-200 text-sm border-b border-slate-800 pb-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Prototype Environment & Deployment Metadata</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 font-mono text-[11px]">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">APPLICATION VERSION</span>
              <strong className="text-sky-400">CYBER PEHRA v2.4.1</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">STORAGE STATE</span>
              <strong className="text-emerald-400">Reactive Browser LocalStore</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">TARGET FRAMEWORK</span>
              <strong className="text-purple-400">I4C MHA Hackathon / SIH</strong>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-sky-900/30"
          >
            Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};
