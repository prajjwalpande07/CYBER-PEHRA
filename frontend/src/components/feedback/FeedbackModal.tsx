import React, { useState } from 'react';
import { X, Star, CheckCircle, ShieldCheck, FileCheck } from 'lucide-react';
import { OfficerFeedbackRecord, InvestigationCase } from '../../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  investigation: InvestigationCase;
  onSubmit: (feedback: Omit<OfficerFeedbackRecord, 'id' | 'timestamp' | 'usedInModelTraining'>) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  investigation,
  onSubmit,
}) => {
  const [officerName, setOfficerName] = useState('Insp. V. K. Sharma');
  const [badgeNumber, setBadgeNumber] = useState('MH-CY-1049');
  const [outcome, setOutcome] = useState<OfficerFeedbackRecord['outcome']>('Cash Withdrawal Prevented');
  const [accuracy, setAccuracy] = useState<number>(5);
  const [validated, setValidated] = useState<boolean>(true);
  const [comments, setComments] = useState(
    'Proactive alert received within 40 minutes of victim debit. QRT patrol stationed near ATM intercepted runner at vestibule and froze remaining balance.'
  );
  const [additionalEvidence, setAdditionalEvidence] = useState(
    'Impounded 3 cloned ATM debit cards, suspect smartphone with Telegram chat logs, and cash seizure memo.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      caseId: investigation.id,
      officerName,
      badgeNumber,
      outcome,
      predictionAccuracy: accuracy,
      riskScoreValidated: validated,
      comments,
      additionalEvidence,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0b1329] border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Submit Field Officer Feedback — Case {investigation.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-slate-200 font-semibold">{investigation.complaintTitle}</div>
            <div className="text-slate-400 text-[11px]">
              Location: <span className="text-amber-300">{investigation.locationName}</span> • Suspected Account: <span className="font-mono text-slate-300">{investigation.suspectedAccount}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Investigating Officer Name</label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Badge / Officer ID</label>
              <input
                type="text"
                required
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
              <option value="False Positive">False Positive (No suspicious activity observed)</option>
              <option value="No Action">No Action Possible (Runner already fled)</option>
            </select>
          </div>

          {/* Star Rating for prediction accuracy */}
          <div>
            <label className="block text-slate-400 mb-1.5">
              Prediction Accuracy & Location Precision Rating (1 - 5 Stars)
            </label>
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
              <span className="text-slate-300 font-mono text-xs ml-2">
                {accuracy}/5 ({accuracy === 5 ? 'Exact Location & Window Match' : accuracy >= 4 ? 'High Precision' : 'Moderate Match'})
              </span>
            </div>
          </div>

          {/* Validated Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="validate-risk"
              checked={validated}
              onChange={(e) => setValidated(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-0"
            />
            <label htmlFor="validate-risk" className="text-slate-300 select-none">
              Confirm that the calculated AI Risk Factors matched on-ground realities
            </label>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Field Observations & Notes</label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              placeholder="Provide tactical notes..."
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Additional Evidence Recovered</label>
            <textarea
              rows={2}
              value={additionalEvidence}
              onChange={(e) => setAdditionalEvidence(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
              placeholder="Mention CCTV footage, device IMEIs, confiscated debit cards..."
            />
          </div>

          <div className="p-2.5 rounded bg-sky-950/40 border border-sky-500/20 text-[11px] text-sky-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>
              This feedback will be appended as an immutable block to the <strong>Blockchain Audit Trail</strong> and queued into the <strong>Continuous Learning Retraining Dataset</strong>.
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-lg shadow-emerald-900/30 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Ground-Truth Feedback</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
