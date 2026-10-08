import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { RiskScoreBadge } from '../components/common/RiskScoreBadge';
import { ExplainableRiskCard } from '../components/explainable/ExplainableRiskCard';
import { formatINR } from '../utils/formatters';

export const PredictionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { complaints, locations, runPrediction, dispatchTeam, markSurveillance } = useCyberPehra();

  const paramComplaintId = searchParams.get('complaintId');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(
    paramComplaintId || complaints[0]?.id || 'CP-2026-8941'
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [predictionResult, setPredictionResult] = useState<{
    locationId: string;
    riskScore: number;
    confidence: number;
    window: string;
  } | null>(null);

  const selectedComplaint =
    complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  // Find linked or best matching location
  const targetLocation =
    locations.find((l) => l.id === selectedComplaint?.predictedLocationId) ||
    locations.find((l) => l.state === selectedComplaint?.state) ||
    locations[0];

  const stages = [
    'Graph Neural Network: Ingesting Mule Network & Account Layering Topology...',
    'Spatio-Temporal Analysis: Correlating Historical Withdrawal Speed & City Commute...',
    'Geospatial Density: Geocoding ATM Cluster Dispenser Capacities & CCTV Logs...',
    'Risk Scoring Engine: Computing Normalized Feature Attribution & Alert Windows...',
  ];

  const handleRunPrediction = async () => {
    setIsProcessing(true);
    setProcessingStage(0);

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(i);
      await new Promise((res) => setTimeout(res, 450));
    }

    const res = await runPrediction(selectedComplaint.id);

    setPredictionResult({
      locationId: res.location.id,
      riskScore: res.riskScore,
      confidence: res.location.confidenceScore,
      window: res.location.predictedTimeWindow,
    });

    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <BrainCircuit className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Predictive Analytics Engine — Withdrawal Forecasting
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine Learning Spatio-Temporal Inference Model • Pre-empts cash liquidation before ATM extraction
          </p>
        </div>

        {/* Case selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Select Case:</span>
          <select
            value={selectedComplaintId}
            onChange={(e) => {
              setSelectedComplaintId(e.target.value);
              setPredictionResult(null);
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          >
            {complaints.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.complaintType} ({formatINR(c.transactionAmount)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Features vs Processing Engine vs Output Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Input Matrix Card */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>1. Multi-Modal Feature Inputs</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                FUSED
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Complaint & Victim Anchor</span>
                <span className="font-semibold text-slate-200">{selectedComplaint.victimName}</span>
                <div className="text-[11px] text-slate-400 font-mono">
                  Type: <strong className="text-slate-300">{selectedComplaint.complaintType}</strong> • Amount:{' '}
                  <strong className="text-sky-400">{formatINR(selectedComplaint.transactionAmount)}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Mule Layering Vector</span>
                <span className="font-mono text-amber-300 font-semibold">{selectedComplaint.suspectedAccount}</span>
                <div className="text-[11px] text-slate-400">
                  Bank: {selectedComplaint.bank} • Location: {selectedComplaint.transactionLocation}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] block">Geospatial Ingestion</span>
                <div className="text-[11px] text-slate-300 font-mono">
                  Coordinates: {selectedComplaint.latitude}, {selectedComplaint.longitude}
                </div>
                <div className="text-[10px] text-slate-500">
                  25 nearby ATMs & bank branches mapped in radius
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-sky-950/30 border border-sky-500/20 text-[11px] text-sky-300">
            ✓ 6 Data sources fused into real-time tensor
          </div>
        </div>

        {/* Step 2: Processing AI Pipeline Card */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>2. AI Inference Pipeline</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800 flex items-start gap-2">
                <div className="mt-0.5 text-purple-400">●</div>
                <div>
                  <strong className="text-slate-200">Graph Neural Network (GNN):</strong>
                  <p className="text-[11px] text-slate-400">
                    Detects mule clustering, split-ratios, and hop velocity.
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/90 border border-slate-800 flex items-start gap-2">
                <div className="mt-0.5 text-sky-400">●</div>
                <div>
                  <strong className="text-slate-200">Spatio-Temporal Transformer:</strong>
                  <p className="text-[11px] text-slate-400">
                    Calculates time elapsed since victim transfer vs. traffic transit speed.
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/90 border border-slate-800 flex items-start gap-2">
                <div className="mt-0.5 text-amber-400">●</div>
                <div>
                  <strong className="text-slate-200">Anomaly Detection Filter:</strong>
                  <p className="text-[11px] text-slate-400">
                    Cross-references with offline CCTVs and high-cash dispenser capacity.
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/90 border border-slate-800 flex items-start gap-2">
                <div className="mt-0.5 text-red-400">●</div>
                <div>
                  <strong className="text-slate-200">SHAP Risk Score Attribution:</strong>
                  <p className="text-[11px] text-slate-400">
                    Ranks top 5 causal factors for court-admissible explainability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunPrediction}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-700 hover:from-sky-500 hover:to-indigo-600 text-white font-bold text-xs transition-all shadow-lg shadow-sky-900/30 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Processing Pipeline...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Run Prediction on Case {selectedComplaint.id}</span>
              </>
            )}
          </button>
        </div>

        {/* Step 3: Predictive Output Forecast */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Predictive Intelligence Output</span>
              </span>
              <RiskScoreBadge
                score={predictionResult?.riskScore || targetLocation.riskScore}
                level={targetLocation.riskLevel}
              />
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">
                  Forecasted Withdrawal Location:
                </span>
                <div className="font-bold text-slate-100 text-sm mt-0.5">{targetLocation.name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{targetLocation.address}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Confidence Level:</span>
                  <span className="text-sm font-bold font-mono text-sky-400">
                    {predictionResult?.confidence || targetLocation.confidenceScore}%
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Target Time Window:</span>
                  <span className="text-xs font-semibold font-mono text-amber-400">
                    {predictionResult?.window || targetLocation.predictedTimeWindow}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-red-300 font-semibold">Funds at Immediate Risk:</span>
                  <span className="font-mono font-bold text-red-400">
                    {formatINR(targetLocation.amountAtRisk)}
                  </span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  Nearest Police Patrol: {targetLocation.nearestPoliceStation} ({targetLocation.distanceToPatrolKm} km away)
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/heatmap?locationId=${targetLocation.id}`)}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Locate on Map</span>
            </button>
            <button
              onClick={() => dispatchTeam(`INV-7731`, targetLocation.id)}
              className="flex-1 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1 shadow-lg shadow-sky-900/30"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Dispatch QRT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Animation Banner during processing */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-sky-950/60 border border-sky-500/50 shadow-xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-sky-300 font-semibold flex items-center gap-2">
              <RotateCcw className="w-4 h-4 animate-spin text-sky-400" />
              <span>{stages[processingStage]}</span>
            </span>
            <span className="font-mono text-sky-400 font-bold">
              {Math.round(((processingStage + 1) / stages.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((processingStage + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Explainable Risk Card for the Forecasted Location */}
      <ExplainableRiskCard
        location={targetLocation}
        onDispatchPatrol={() => dispatchTeam('INV-7731', targetLocation.id)}
        onMarkSurveillance={() => markSurveillance(targetLocation.id)}
      />
    </div>
  );
};
