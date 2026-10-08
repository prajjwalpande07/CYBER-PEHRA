import React, { useState } from 'react';
import {
  MessageSquareCheck,
  Star,
  CheckCircle,
  ShieldAlert,
  Send,
  Sparkles,
  Blocks,
  ArrowRight,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { OfficerFeedbackRecord } from '../types';
import { formatDateTime } from '../utils/formatters';

export const FeedbackPage: React.FC = () => {
  const {
    feedbackRecords,
    investigations,
    submitOfficerFeedback,
    triggerModelRetraining,
    isRetraining,
  } = useCyberPehra();

  // New feedback form state
  const [selectedCaseId, setSelectedCaseId] = useState(investigations[0]?.id || 'INV-7731');
  const [officerName, setOfficerName] = useState('Insp. V. K. Sharma');
  const [badgeNumber, setBadgeNumber] = useState('MH-CY-1049');
  const [outcome, setOutcome] = useState<OfficerFeedbackRecord['outcome']>('Cash Withdrawal Prevented');
  const [accuracy, setAccuracy] = useState<number>(5);
  const [validated, setValidated] = useState<boolean>(true);
  const [comments, setComments] = useState(
    'Proactive alert received within 40 minutes of victim debit. QRT patrol stationed near ATM intercepted runner at vestibule and froze remaining balance.'
  );
  const [additionalEvidence, setAdditionalEvidence] = useState(
    'Confiscated 4 cloned ATM debit cards and suspect phone with coordinated Telegram withdrawal timers.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOfficerFeedback({
      caseId: selectedCaseId,
      officerName,
      badgeNumber,
      outcome,
      predictionAccuracy: accuracy,
      riskScoreValidated: validated,
      comments,
      additionalEvidence,
    });
  };

  const avgRating = (
    feedbackRecords.reduce((sum, f) => sum + f.predictionAccuracy, 0) /
    (feedbackRecords.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquareCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Ground-Truth Field Action & Officer Feedback Loop
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Closing the proactive intelligence loop • Ground-truth verification powers continuous Machine Learning retraining
          </p>
        </div>

        {/* Retraining button */}
        <button
          onClick={triggerModelRetraining}
          disabled={isRetraining}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-900/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isRetraining ? 'Retraining Model...' : 'Feed Ground Truth to Model Retrainer'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Validated Interventions</span>
          <div className="text-2xl font-bold font-mono text-slate-100">{feedbackRecords.length}</div>
          <span className="text-[11px] text-slate-500">Verified by Field Investigating Officers</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Average AI Precision Rating</span>
          <div className="text-2xl font-bold font-mono text-amber-400 flex items-center gap-2">
            <span>{avgRating} / 5.0</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[11px] text-slate-500">Exact ATM location & timing window match</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Model Training Buffer Status</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">READY</div>
          <span className="text-[11px] text-slate-500">Labels cryptographically anchored</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submit New Feedback Form (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">Log Tactical Ground Truth</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-slate-400 mb-1">Select Target Investigation Case</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
              >
                {investigations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} — {inv.complaintTitle} ({inv.locationName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Officer Name</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Badge Number</label>
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Operational Outcome</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Cash Withdrawal Prevented">Cash Withdrawal Prevented</option>
                <option value="Arrest">Suspect / Mule Runner Arrested on Scene</option>
                <option value="Account Frozen">Account Frozen in Time (Sec 102)</option>
                <option value="False Positive">False Positive</option>
                <option value="No Action">No Action</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Accuracy Rating (1-5)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setAccuracy(star)}
                    className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= accuracy ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-slate-300 font-mono ml-2">{accuracy}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Officer Observations</label>
              <textarea
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Additional Evidence Recovered</label>
              <textarea
                rows={2}
                value={additionalEvidence}
                onChange={(e) => setAdditionalEvidence(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Record Ground Truth & Anchor Ledger</span>
            </button>
          </form>
        </div>

        {/* Right: History of Recorded Feedback (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Recorded Ground-Truth Feedback Logs ({feedbackRecords.length})
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {feedbackRecords.map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 space-y-2.5 text-xs shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-emerald-400">{record.id}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-sky-400 font-semibold">{record.caseId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono text-amber-400 font-bold">
                      {record.predictionAccuracy}/5 <Star className="w-3 h-3 fill-amber-400 inline" />
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {record.outcome}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Submitted by {record.officerName} ({record.badgeNumber}) • {formatDateTime(record.timestamp)}
                </div>

                <p className="text-slate-300 leading-relaxed bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                  "{record.comments}"
                </p>

                {record.additionalEvidence && (
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Recovered Evidence:</strong> {record.additionalEvidence}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-800">
                  <span>Cryptographic Audit Commitment: VALID</span>
                  <span className={record.usedInModelTraining ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                    {record.usedInModelTraining ? '✓ Integrated in Training Corpus' : '● Queued for Retraining Batch'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
