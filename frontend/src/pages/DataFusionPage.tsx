import React from 'react';
import {
  Layers,
  Database,
  RefreshCw,
  CheckCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const DataFusionPage: React.FC = () => {
  const { fusionSources } = useCyberPehra();

  const totalRecords = fusionSources.reduce((acc, s) => acc + s.recordsReceived, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              National Data Collection & Multi-Source Fusion Pipeline
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Harmonizing citizen complaints, banking telemetry, mule intelligence, and geospatial ATM layers into a unified feature tensor
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
          <span>Total Ingested Corpus:</span>
          <strong className="text-sky-400 font-bold">{totalRecords.toLocaleString('en-IN')}</strong>
          <span className="text-slate-500">Records</span>
        </div>
      </div>

      {/* Visual Data Fusion Pipeline Architecture Diagram */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">Visual Data Fusion Pipeline</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            PIPELINE OPTIMAL (98.6% Quality Avg)
          </span>
        </div>

        {/* Pipeline steps visual representation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="font-mono text-xs font-bold text-sky-400 flex items-center justify-between">
              <span>STAGE 1: INGESTION</span>
              <span className="text-slate-500">Kafka Stream</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Real-time webhook listeners ingest citizen 1930 / NCRP complaints, UPI switch signals, and telecom CDR events.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="font-mono text-xs font-bold text-purple-400 flex items-center justify-between">
              <span>STAGE 2: NORMALIZATION</span>
              <span className="text-slate-500">Schema Align</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Standardizes bank IFSC codes, transaction hashes, mobile IMSIs, and geographical latitude/longitude geocoding.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="font-mono text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>STAGE 3: GRAPH FUSION</span>
              <span className="text-slate-500">Mule Linking</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Correlates recipient accounts against the National Mule Account Repository to detect split-hops and shell directors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="font-mono text-xs font-bold text-emerald-400 flex items-center justify-between">
              <span>STAGE 4: PREDICTIVE VECTOR</span>
              <span className="text-slate-500">Inference Tensor</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Outputs fused feature vector to the Spatio-Temporal Model for immediate withdrawal location and time window forecasting.
            </p>
          </div>
        </div>
      </div>

      {/* Connected Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {fusionSources.map((source) => (
          <div
            key={source.id}
            className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors text-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                  {source.code}
                </span>
                <StatusBadge status={source.status} size="sm" />
              </div>

              <h4 className="font-bold text-slate-100 text-sm">{source.name}</h4>
              <span className="text-[11px] text-sky-400 font-medium block mt-0.5">
                {source.category}
              </span>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                {source.description}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Records Received:</span>
                <span className="text-slate-200 font-semibold">
                  {source.recordsReceived.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Processed:</span>
                <span className="text-emerald-400 font-semibold">
                  {source.recordsProcessed.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data Quality:</span>
                <span className="text-sky-300 font-bold">{source.dataQuality}%</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px]">
                <span className="text-slate-500">Last Synchronization:</span>
                <span className="text-slate-400 font-sans">{source.lastSync}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
