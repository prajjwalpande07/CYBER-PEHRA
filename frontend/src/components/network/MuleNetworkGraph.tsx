import React, { useState } from 'react';
import {
  GitFork,
  CreditCard,
  Building,
  MapPin,
  Coins,
  ShieldAlert,
  ArrowRight,
  Info,
  Lock,
  Search,
} from 'lucide-react';
import { MuleNode, MuleEdge } from '../../types';
import { formatINR } from '../../utils/formatters';
import { RiskScoreBadge } from '../common/RiskScoreBadge';

interface MuleNetworkGraphProps {
  nodes: MuleNode[];
  edges: MuleEdge[];
  onFreezeAccount?: (accountNumber: string) => void;
}

export const MuleNetworkGraph: React.FC<MuleNetworkGraphProps> = ({
  nodes,
  edges,
  onFreezeAccount,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[1]?.id || nodes[0]?.id);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchAccount, setSearchAccount] = useState<string>('');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const filteredNodes = nodes.filter((n) => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (searchAccount && !n.accountNumber.includes(searchAccount) && !n.label.toLowerCase().includes(searchAccount.toLowerCase())) return false;
    return true;
  });

  const getNodeColor = (type: MuleNode['type']) => {
    switch (type) {
      case 'victim':
        return { fill: '#0284c7', stroke: '#38bdf8', bg: 'bg-sky-500/20 text-sky-400 border-sky-500/30' };
      case 'mule_l1':
        return { fill: '#ef4444', stroke: '#f87171', bg: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case 'mule_l2':
        return { fill: '#f97316', stroke: '#fb923c', bg: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
      case 'shell_firm':
        return { fill: '#a855f7', stroke: '#c084fc', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'crypto_exchange':
        return { fill: '#eab308', stroke: '#fde047', bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case 'atm':
        return { fill: '#dc2626', stroke: '#ef4444', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      case 'branch':
      default:
        return { fill: '#10b981', stroke: '#34d399', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    }
  };

  const getNodeIcon = (type: MuleNode['type']) => {
    switch (type) {
      case 'victim':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'mule_l1':
      case 'mule_l2':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'shell_firm':
        return <Building className="w-3.5 h-3.5" />;
      case 'crypto_exchange':
        return <Coins className="w-3.5 h-3.5" />;
      case 'atm':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'branch':
        return <Building className="w-3.5 h-3.5" />;
      default:
        return <CreditCard className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl overflow-hidden flex flex-col lg:flex-row">
      {/* Left / Center Graph Canvas */}
      <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Controls Toolbar */}
        <div className="p-3.5 border-b border-slate-800 bg-[#0b1329] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-200">
              Interactive Layered Mule Flow Topology
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-300 focus:outline-none text-xs"
            >
              <option value="all">All Entity Types</option>
              <option value="victim">Victim Origin</option>
              <option value="mule_l1">Layer 1 Mules</option>
              <option value="mule_l2">Layer 2 Mules</option>
              <option value="shell_firm">Shell Corporate</option>
              <option value="crypto_exchange">Crypto Escrows</option>
              <option value="atm">Target ATMs</option>
            </select>

            <div className="relative">
              <input
                type="text"
                value={searchAccount}
                onChange={(e) => setSearchAccount(e.target.value)}
                placeholder="Find Account / Handle..."
                className="bg-slate-900 border border-slate-700 rounded pl-7 pr-2 py-1 text-slate-200 text-xs w-36 focus:w-48 transition-all focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>
        </div>

        {/* SVG Visualization Canvas */}
        <div className="relative w-full h-[480px] bg-[#070b14] overflow-hidden flex items-center justify-center select-none">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <svg className="w-full h-full" viewBox="0 0 900 440">
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="28"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="28"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
            </defs>

            {/* Render Links / Edges */}
            {edges.map((edge) => {
              const srcNode = nodes.find((n) => n.id === edge.source);
              const tgtNode = nodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isEdgeActive =
                selectedNodeId === edge.source || selectedNodeId === edge.target;

              const x1 = srcNode.x || 100;
              const y1 = srcNode.y || 100;
              const x2 = tgtNode.x || 500;
              const y2 = tgtNode.y || 200;

              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2 - 10;

              return (
                <g key={edge.id}>
                  {/* Path */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isEdgeActive ? '#f87171' : '#334155'}
                    strokeWidth={isEdgeActive ? 3 : 1.5}
                    strokeDasharray={edge.type.includes('Predicted') ? '4 4' : 'none'}
                    markerEnd={isEdgeActive ? 'url(#arrow-active)' : 'url(#arrow)'}
                  />

                  {/* Flow label */}
                  <rect
                    x={midX - 35}
                    y={midY - 8}
                    width={70}
                    height={16}
                    rx={3}
                    fill="#0f172a"
                    stroke={isEdgeActive ? '#ef4444' : '#1e293b'}
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fill={isEdgeActive ? '#fca5a5' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {formatINR(edge.amount)}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const colors = getNodeColor(node.type);
              const x = node.x || 200;
              const y = node.y || 200;

              return (
                <g
                  key={node.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      r={30}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={20}
                    fill={colors.fill}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-transform group-hover:scale-110 shadow-lg"
                  />

                  {/* Node Title Label */}
                  <text
                    y={32}
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {node.label.split(':')[1] || node.label}
                  </text>

                  {/* Account number underneath */}
                  <text
                    y={44}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    {node.accountNumber}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Legend bottom corner */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-2 text-[10px] bg-slate-900/90 p-2 rounded border border-slate-800">
            <span className="flex items-center gap-1 text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Victim
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Layer 1 Mule
            </span>
            <span className="flex items-center gap-1 text-orange-400">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Layer 2 Mule
            </span>
            <span className="flex items-center gap-1 text-purple-400">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Shell Corp
            </span>
            <span className="flex items-center gap-1 text-yellow-400">
              <span className="w-2 h-2 rounded-full bg-yellow-500" /> Crypto Escrow
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-600" /> ATM Target
            </span>
          </div>
        </div>
      </div>

      {/* Right Details Inspection Panel */}
      <div className="w-full lg:w-80 p-5 bg-[#0b1329] flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Entity Forensics
              </span>
            </div>
            <RiskScoreBadge score={selectedNode.riskScore} />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Entity Label:</span>
              <span className="font-bold text-slate-100 text-sm">{selectedNode.label}</span>
              <span className="text-slate-400 text-[11px] block mt-0.5">{selectedNode.bank}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Account / Handle:</span>
                <span className="text-amber-300 font-semibold">{selectedNode.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Holder:</span>
                <span className="text-slate-200">{selectedNode.holder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Balance:</span>
                <span className="text-emerald-400 font-bold">{formatINR(selectedNode.balance)}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[11px] block">Intelligence Flag:</span>
              <div className="mt-1 p-2 rounded bg-red-950/40 border border-red-500/30 text-red-300 text-xs leading-relaxed">
                {selectedNode.flag}
              </div>
            </div>

            {/* Related Connected Edges */}
            <div>
              <span className="text-slate-400 text-[11px] block mb-1 font-semibold uppercase">
                Linked Fund Transfers:
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {edges
                  .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map((e) => {
                    const isSender = e.source === selectedNode.id;
                    const otherNodeId = isSender ? e.target : e.source;
                    const otherNode = nodes.find((n) => n.id === otherNodeId);
                    return (
                      <div
                        key={e.id}
                        className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px] flex items-center justify-between"
                      >
                        <span className={isSender ? 'text-red-400' : 'text-emerald-400'}>
                          {isSender ? 'Sent →' : 'Recv ←'} {otherNode?.label.split(':')[1] || otherNodeId}
                        </span>
                        <span className="font-mono font-bold text-slate-200">{formatINR(e.amount)}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {selectedNode.type.includes('mule') || selectedNode.type === 'shell_firm' ? (
          <button
            onClick={() => onFreezeAccount && onFreezeAccount(selectedNode.accountNumber)}
            className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Enforce Sec 102 Account Freeze</span>
          </button>
        ) : (
          <div className="p-2 text-center text-[11px] text-slate-500 bg-slate-900 rounded border border-slate-800">
            Node status: Monitored in National Graph
          </div>
        )}
      </div>
    </div>
  );
};
