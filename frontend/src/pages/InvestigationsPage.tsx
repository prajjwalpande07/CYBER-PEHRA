import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Send,
  Lock,
  Compass,
  FileCheck,
  Download,
  Plus,
  Clock,
  CheckCircle,
  Eye,
  FileText,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { InvestigationCase } from '../types';
import { RiskScoreBadge } from '../components/common/RiskScoreBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { FeedbackModal } from '../components/feedback/FeedbackModal';
import { formatDateTime, formatINR } from '../utils/formatters';

export const InvestigationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    investigations,
    dispatchTeam,
    freezeAccount,
    markSurveillance,
    submitOfficerFeedback,
    addToast,
  } = useCyberPehra();

  const [selectedCase, setSelectedCase] = useState<InvestigationCase>(investigations[0]);
  const [feedbackCase, setFeedbackCase] = useState<InvestigationCase | null>(null);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    selectedCase.notes.push(
      `${new Date().toLocaleTimeString()} - ${newNote.trim()}`
    );
    setNewNote('');

    addToast({
      title: 'Investigation Log Updated',
      message: `Note appended to Case ${selectedCase.id}.`,
      type: 'info',
    });
  };

  const handleGenerateIntelReport = () => {
    addToast({
      title: 'Intelligence Dossier Compiled',
      message: `Case ${selectedCase.id} Section 91 CrPC intelligence report formatted and exported.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Law Enforcement Investigation & Field Action Grid
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated LEA Cyber Crime Branch Interface • Tactical Dispatch, Account Freezes & Ground Action Log
          </p>
        </div>

        {/* Global LEA Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateIntelReport}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Generate Intelligence Report</span>
          </button>
        </div>
      </div>

      {/* Main Split: Cases List on Left, Case Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cases List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Investigations ({investigations.length})
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {investigations.map((inv) => {
              const isSelected = selectedCase?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedCase(inv)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#0f172a] border-sky-500 shadow-md ring-1 ring-sky-500/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-sky-400 text-xs">{inv.id}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-[11px]">{inv.complaintId}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-1">
                        {inv.complaintTitle}
                      </h4>
                    </div>
                    <RiskScoreBadge score={inv.riskLevel === 'CRITICAL' ? 94 : 84} level={inv.riskLevel} showText={false} />
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="truncate max-w-[200px]">Officer: {inv.assignedOfficer}</span>
                    <StatusBadge status={inv.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Case Dossier (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-6 text-xs">
          {/* Top Dossier Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-400">{selectedCase.id}</span>
                <span className="text-slate-500">•</span>
                <h3 className="text-base font-bold text-slate-100">{selectedCase.complaintTitle}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Investigating Unit: <strong className="text-slate-300">{selectedCase.policeStation}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={selectedCase.status} />
              <button
                onClick={() => setFeedbackCase(selectedCase)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 text-xs font-semibold transition-colors flex items-center gap-1.5"
                title="Log Field Action Ground Truth"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Log Outcome & Feedback</span>
              </button>
            </div>
          </div>

          {/* Quick Tactical Action Buttons Row */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-2">
            <button
              onClick={() => dispatchTeam(selectedCase.id, selectedCase.locationId)}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-sky-900/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Team</span>
            </button>

            <button
              onClick={() => freezeAccount(selectedCase.id, selectedCase.suspectedAccount)}
              className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Freeze Account (Sec 102)</span>
            </button>

            <button
              onClick={() => {
                if (selectedCase.locationId) markSurveillance(selectedCase.locationId);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Mark Surveillance</span>
            </button>
          </div>

          {/* Field Data Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Suspected Mule Account & Entity</span>
              <div className="font-mono text-amber-300 font-semibold">{selectedCase.suspectedAccount}</div>
              <div className="text-slate-300 text-[11px]">{selectedCase.suspectedMuleName}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Target Withdrawal Point</span>
              <div className="font-semibold text-slate-200">{selectedCase.locationName}</div>
              <div className="text-slate-400 text-[11px]">Assigned to: {selectedCase.assignedOfficer}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Section 102 Account Freeze Status</span>
              <div className="font-semibold text-sky-300">{selectedCase.accountFreezeStatus}</div>
              <div className="text-emerald-400 font-mono text-[11px] font-bold">
                Recovered / Preserved: {formatINR(selectedCase.amountRecovered)}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Field Seizure Status</span>
              <div className="font-semibold text-slate-200">{selectedCase.seizureStatus}</div>
              <div className="text-slate-400 text-[11px]">
                Registered at: {formatDateTime(selectedCase.createdAt)}
              </div>
            </div>
          </div>

          {/* Evidence Chain */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Digital & Physical Evidence Chain</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedCase.evidenceList.map((ev, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono text-[11px] flex items-center gap-1.5 hover:border-slate-700 cursor-pointer"
                >
                  <FileText className="w-3 h-3 text-sky-400" />
                  <span>{ev}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Investigation Chronological Log / Notes */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Chronological Operational Notes</span>
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {selectedCase.notes.map((note, idx) => (
                <div key={idx} className="text-[11px] text-slate-300 border-l-2 border-sky-500/60 pl-2.5 py-0.5">
                  {note}
                </div>
              ))}
            </div>

            {/* Add note field */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log field update, suspect sighting, or coordination notice..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Note</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Officer Feedback Modal */}
      {feedbackCase && (
        <FeedbackModal
          isOpen={true}
          onClose={() => setFeedbackCase(null)}
          investigation={feedbackCase}
          onSubmit={submitOfficerFeedback}
        />
      )}
    </div>
  );
};
