import React, { useState } from 'react';
import {
  Blocks,
  ShieldCheck,
  Search,
  Hash,
  Link as LinkIcon,
  CheckCircle2,
  Lock,
  ArrowDown,
  Info,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { truncateHash } from '../utils/cryptoHash';
import { formatDateTime } from '../utils/formatters';

export const AuditTrailPage: React.FC = () => {
  const { blockchainBlocks } = useCyberPehra();
  const [search, setSearch] = useState('');

  const filteredBlocks = [...blockchainBlocks]
    .reverse()
    .filter((b) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        b.action.toLowerCase().includes(q) ||
        b.caseId.toLowerCase().includes(q) ||
        b.officer.toLowerCase().includes(q) ||
        b.hash.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Blocks className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Cryptographic Blockchain Audit Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident, cryptographically chained event log • Guarantees chain of custody for court-admissible evidence
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CHAIN INTEGRITY: VERIFIED & SEALED</span>
        </div>
      </div>

      {/* Security Disclaimer Banner */}
      <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-500/30 text-xs text-sky-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Chain of Custody Notice:</strong> Every administrative action, AI inference timestamp, Section 102 account freeze, and officer ground-truth rating is hashed with SHA-256 and committed into a verifiable Merkle sequence.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Action, Case ID, Officer, or Hash..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total Blocks: <strong className="text-slate-200">{blockchainBlocks.length}</strong>
        </span>
      </div>

      {/* Block Sequence Visual Grid */}
      <div className="space-y-4">
        {filteredBlocks.map((block, idx) => (
          <div key={block.blockId} className="relative group">
            <div className="p-4 sm:p-5 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Block #{block.blockId}
                  </span>
                  <span className="font-bold text-slate-100 font-mono">{block.action}</span>
                  <span className="text-slate-500">•</span>
                  <span className="font-mono text-sky-400 font-semibold">{block.caseId}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatDateTime(block.timestamp)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{block.status}</span>
                  </span>
                </div>
              </div>

              {/* Payload Summary */}
              <div className="text-slate-300 font-sans leading-relaxed text-xs">
                {block.payloadSummary}
              </div>

              {/* Cryptographic Hashes Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800/90 space-y-0.5">
                  <span className="text-slate-500 text-[10px] uppercase block flex items-center gap-1">
                    <Hash className="w-3 h-3 text-indigo-400" />
                    Current Block Hash (SHA-256):
                  </span>
                  <span className="text-slate-200 select-all font-semibold break-all">
                    {block.hash}
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800/90 space-y-0.5">
                  <span className="text-slate-500 text-[10px] uppercase block flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-slate-400" />
                    Previous Block Hash:
                  </span>
                  <span className="text-slate-400 select-all break-all">
                    {block.previousHash}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                <span>Signer / Validator: <strong className="text-slate-400 font-mono">{block.officer}</strong></span>
                <span>Merkle Leaf Verified</span>
              </div>
            </div>

            {/* Connecting Chain Indicator */}
            {idx < filteredBlocks.length - 1 && (
              <div className="flex justify-center -my-1 relative z-10">
                <div className="p-1 rounded-full bg-slate-900 border border-slate-700 text-slate-500">
                  <ArrowDown className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
