import React from 'react';
import {
  LineChart as ChartIcon,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { formatDateTime } from '../utils/formatters';

export const ModelMonitoringPage: React.FC = () => {
  const { modelMetrics, triggerModelRetraining, isRetraining, feedbackRecords } = useCyberPehra();

  const feedbackLoopSteps = [
    { step: '1', title: 'Officer Feedback', desc: 'Ground-truth outcome verified on scene (Arrest / Cash Prevented / False Positive)' },
    { step: '2', title: 'Ground Truth Labeling', desc: 'Classification into positive intervention vs. non-actionable anomaly' },
    { step: '3', title: 'Training Set Expansion', desc: 'Ingestion into historical spatio-temporal GNN tensor dataset' },
    { step: '4', title: 'Automated Fine-Tuning', desc: 'Gradient descent optimization of node routing and ATM cluster weights' },
    { step: '5', title: 'Version Deployment', desc: `Automatic weight rollout (${modelMetrics.version}) with reduced false positive rate` },
    { step: '6', title: 'Enhanced Predictions', desc: 'Sharper withdrawal windows & higher precision for subsequent tranches' },
  ];

  const fullArchitectureLoop = [
    'New Complaint',
    'Data Fusion',
    'AI Prediction',
    'Real-time Alert',
    'Field Action',
    'Outcome Verification',
    'Officer Feedback',
    'Continuous Retraining',
    'Superior Accuracy',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <ChartIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Model Monitoring & Continuous Learning Retraining Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ML performance tracking, confusion matrix telemetry, and autonomous closed-loop retraining pipeline
          </p>
        </div>

        {/* Retrain Trigger Button */}
        <button
          onClick={triggerModelRetraining}
          disabled={isRetraining}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-sky-900/30 flex items-center gap-2 self-start sm:self-auto"
        >
          {isRetraining ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
              <span>Retraining GNN & Spatio-Temporal Weights...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Trigger Autonomous Retraining Batch</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Model Version</span>
          <div className="text-xl font-bold font-mono text-sky-400">{modelMetrics.version}</div>
          <span className="text-[10px] text-emerald-400">● Production Ready</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Global Accuracy</span>
          <div className="text-xl font-bold font-mono text-slate-100">{modelMetrics.accuracy}%</div>
          <span className="text-[10px] text-sky-400">+1.8% over v2.3.0</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Precision Score</span>
          <div className="text-xl font-bold font-mono text-emerald-400">{modelMetrics.precision}%</div>
          <span className="text-[10px] text-slate-500">True positive cashouts</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Recall Sensitivity</span>
          <div className="text-xl font-bold font-mono text-purple-400">{modelMetrics.recall}%</div>
          <span className="text-[10px] text-slate-500">Captured extractions</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">F1 Harmonic Mean</span>
          <div className="text-xl font-bold font-mono text-amber-400">{modelMetrics.f1Score}%</div>
          <span className="text-[10px] text-slate-500">Balanced accuracy</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">False Positive Rate</span>
          <div className="text-xl font-bold font-mono text-cyan-400">{modelMetrics.falsePositiveRate}%</div>
          <span className="text-[10px] text-emerald-400">↓ Lowest in class</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] block">Today's Inferences</span>
          <div className="text-xl font-bold font-mono text-slate-100">{modelMetrics.predictionsToday}</div>
          <span className="text-[10px] text-emerald-400">{modelMetrics.successfulPredictions} verified</span>
        </div>
      </div>

      {/* Visual Feedback Loop: CYBER PEHRA Full Architecture Concept */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">
              The Proactive Continuous Learning Feedback Loop
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            AUTONOMOUS ADAPTATION
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Traditional cybercrime policing is strictly reactive: complaints are filed after the funds are cashed out and laundered.
          <strong> CYBER PEHRA reverses this paradigm</strong> by forecasting the withdrawal location in advance, and iteratively tuning model parameters whenever field officers log ground-truth outcomes.
        </p>

        {/* Horizontal Flow Chain */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 text-center text-xs pt-2">
          {fullArchitectureLoop.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-1"
            >
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-mono text-[11px] flex items-center justify-center border border-sky-500/30 font-bold">
                {idx + 1}
              </span>
              <span className="text-[11px] font-semibold text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Retraining Workflow Breakdown and Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retraining Steps (7 cols) */}
        <div className="lg:col-span-7 rounded-xl bg-[#0f172a] border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Field Feedback to Weights Pipeline
            </h3>
          </div>

          <div className="space-y-3">
            {feedbackLoopSteps.map((s) => (
              <div
                key={s.step}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs flex items-center justify-center border border-purple-500/40 flex-shrink-0 font-bold mt-0.5">
                  {s.step}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{s.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confusion Matrix & Dataset Registry (5 cols) */}
        <div className="lg:col-span-5 rounded-xl bg-[#0f172a] border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Intervention Confusion Matrix</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">N = 84,210 Samples</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">True Positives (TP)</span>
                <span className="text-xl font-bold font-mono text-slate-100">1,248</span>
                <span className="text-[10px] text-slate-400 block">Cash Intercepted / Frozen</span>
              </div>

              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 space-y-1">
                <span className="text-[10px] text-red-400 uppercase font-semibold block">False Positives (FP)</span>
                <span className="text-xl font-bold font-mono text-slate-100">62</span>
                <span className="text-[10px] text-slate-400 block">Non-fraud patrol alert</span>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-semibold block">False Negatives (FN)</span>
                <span className="text-xl font-bold font-mono text-slate-100">41</span>
                <span className="text-[10px] text-slate-400 block">Missed withdrawal point</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">True Negatives (TN)</span>
                <span className="text-xl font-bold font-mono text-slate-100">82,859</span>
                <span className="text-[10px] text-slate-400 block">Normal ATM operations</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
            <div>Last Retraining Run: {formatDateTime(modelMetrics.lastRetrained)}</div>
            <div>Dataset Size: {modelMetrics.trainingSamples.toLocaleString('en-IN')} verified cases</div>
            <div>New feedback queued: <strong className="text-sky-400">{feedbackRecords.filter((f) => !f.usedInModelTraining).length} samples</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
