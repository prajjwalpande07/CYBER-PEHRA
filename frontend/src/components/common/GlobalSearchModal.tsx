import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShieldAlert, MapPin, Landmark, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useCyberPehra } from '../../context/CyberPehraContext';
import { RiskScoreBadge } from './RiskScoreBadge';
import { formatINR } from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, complaints, locations, investigations } = useCyberPehra();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const q = query.trim().toLowerCase();

  // Search complaints
  const matchedComplaints = q
    ? complaints.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.ncrpRef.toLowerCase().includes(q) ||
          c.victimName.toLowerCase().includes(q) ||
          c.transactionId.toLowerCase().includes(q) ||
          c.suspectedAccount.toLowerCase().includes(q) ||
          c.complaintType.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q)
      )
    : complaints.slice(0, 3);

  // Search locations
  const matchedLocations = q
    ? locations.filter(
        (l) =>
          l.id.toLowerCase().includes(q) ||
          l.name.toLowerCase().includes(q) ||
          l.bankName.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          l.state.toLowerCase().includes(q) ||
          l.linkedMuleAccounts.some((acc) => acc.includes(q))
      )
    : locations.slice(0, 3);

  // Search investigations
  const matchedInvestigations = q
    ? investigations.filter(
        (inv) =>
          inv.id.toLowerCase().includes(q) ||
          inv.complaintId.toLowerCase().includes(q) ||
          inv.assignedOfficer.toLowerCase().includes(q) ||
          inv.suspectedAccount.toLowerCase().includes(q) ||
          inv.suspectedMuleName.toLowerCase().includes(q) ||
          inv.locationName.toLowerCase().includes(q)
      )
    : investigations.slice(0, 2);

  const totalResults = matchedComplaints.length + matchedLocations.length + matchedInvestigations.length;

  const handleSelect = (path: string) => {
    setSearchModalOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#0b1329] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#0f172a]">
          <Search className="w-5 h-5 text-sky-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Complaint ID, Case ID, Account, Transaction ID, ATM, District..."
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder:text-slate-400 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <span>ESC</span>
          </div>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-5 text-xs">
          {!q && (
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2">
              Recent High-Priority Records
            </div>
          )}

          {/* Complaints Group */}
          {matchedComplaints.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-sky-400 px-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Cybercrime Complaints ({matchedComplaints.length})</span>
              </div>
              <div className="space-y-1">
                {matchedComplaints.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(`/complaints`)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-sky-500/40 cursor-pointer transition-colors group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-400">{c.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-200 font-medium">{c.complaintType}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400">{c.victimName}</span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-3 text-[11px]">
                        <span>Txn: {c.transactionId}</span>
                        <span>Amount: <strong className="text-slate-200">{formatINR(c.transactionAmount)}</strong></span>
                        <span>Mule: <span className="font-mono text-amber-300">{c.suspectedAccount}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskScoreBadge score={c.riskScore} level={c.riskLevel} />
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locations Group */}
          {matchedLocations.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-amber-400 px-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Predicted ATM & Branch Locations ({matchedLocations.length})</span>
              </div>
              <div className="space-y-1">
                {matchedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => handleSelect(`/locations/${loc.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-colors group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 font-bold">{loc.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-100 font-semibold">{loc.name}</span>
                        <span className="text-xs px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{loc.type}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-3">
                        <span>{loc.district}, {loc.state}</span>
                        <span>Window: <strong className="text-slate-300">{loc.predictedTimeWindow}</strong></span>
                        <span>At Risk: <strong className="text-red-400">{formatINR(loc.amountAtRisk)}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskScoreBadge score={loc.riskScore} level={loc.riskLevel} />
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investigations Group */}
          {matchedInvestigations.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-emerald-400 px-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Investigation Cases ({matchedInvestigations.length})</span>
              </div>
              <div className="space-y-1">
                {matchedInvestigations.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => handleSelect(`/investigations`)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-colors group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400 font-bold">{inv.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-100 font-medium">{inv.complaintTitle}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-3">
                        <span>Officer: {inv.assignedOfficer}</span>
                        <span>Freeze: <strong className="text-sky-300">{inv.accountFreezeStatus}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {inv.status}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Landmark className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm">No matching records found for "{query}"</p>
              <p className="text-xs text-slate-500">Try searching for "Nanded", "Shivaji", "CP-2026-", or an account number</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#090e1d] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono flex items-center">
                <CornerDownLeft className="w-3 h-3 inline" />
              </kbd>
              <span>to select</span>
            </span>
          </div>
          <span>National Cybercrime Intelligence Database</span>
        </div>
      </div>
    </div>
  );
};
