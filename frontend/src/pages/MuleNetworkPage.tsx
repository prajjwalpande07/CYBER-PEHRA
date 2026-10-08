import React from 'react';
import { GitFork, ShieldAlert, Layers, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { MuleNetworkGraph } from '../components/network/MuleNetworkGraph';
import { formatINR } from '../utils/formatters';

export const MuleNetworkPage: React.FC = () => {
  const { muleNodes, muleEdges, freezeAccount } = useCyberPehra();

  const totalMuleNodes = muleNodes.filter((n) => n.type.includes('mule')).length;
  const frozenCount = muleNodes.filter((n) => n.flag.includes('Frozen')).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <GitFork className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Mule Account Network & Fund Flow Topology
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Graph Analysis of Layer 1 & Layer 2 mule hops, shell entities, P2P crypto conduits, and ATM liquidation endpoints
          </p>
        </div>

        {/* Quick statistics badge */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Mule Nodes: <strong className="text-red-400">{totalMuleNodes}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            Lien / Frozen: <strong className="text-emerald-400">{frozenCount}</strong>
          </div>
        </div>
      </div>

      {/* Network Topology Graph Component */}
      <MuleNetworkGraph
        nodes={muleNodes}
        edges={muleEdges}
        onFreezeAccount={(accNum) => freezeAccount('INV-7731', accNum)}
      />

      {/* Key Insights & Typologies Explained */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Layer 1: Instant Split Velocity</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Funds received from victims are split within 4 to 8 minutes across 2 to 4 retail accounts, staying below the ₹5 Lakh RTGS threshold.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <GitFork className="w-4 h-4" />
            <span>Layer 2: Corporate Shells & P2P</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Funds pass into dummy current accounts registered under bogus GST credentials, or get swapped into USDT cryptocurrency escrow desks.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Layer 3: ATM Cash Extraction</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cash runners utilize cloned cards or cardless OTP cashouts at pre-selected ATMs near highway exits or transit hubs.
          </p>
        </div>
      </div>
    </div>
  );
};
