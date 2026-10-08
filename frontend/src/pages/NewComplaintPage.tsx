import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  BrainCircuit,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { ComplaintType, RiskLevel } from '../types';

export const NewComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const { addComplaint, runPrediction } = useCyberPehra();

  // Form State
  const [ncrpRef, setNcrpRef] = useState(`NCRP-2026-IND-${Math.floor(10000 + Math.random() * 90000)}`);
  const [victimName, setVictimName] = useState('Rajesh Narang');
  const [contactNumber, setContactNumber] = useState('+91 98210 44921');
  const [complaintType, setComplaintType] = useState<ComplaintType>('Digital Arrest');
  const [transactionId, setTransactionId] = useState(`TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [transactionAmount, setTransactionAmount] = useState<number>(1850000);
  const [transactionTime, setTransactionTime] = useState(new Date().toISOString().slice(0, 16));
  const [bank, setBank] = useState('State Bank of India');
  const [accountInfo, setAccountInfo] = useState('SBI Privilege - 40192840192');
  const [suspectedAccount, setSuspectedAccount] = useState('HDFC Bank - 50100918274619');
  const [transactionLocation, setTransactionLocation] = useState('Pune, Maharashtra');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [latitude, setLatitude] = useState<number>(18.5204);
  const [longitude, setLongitude] = useState<number>(73.8567);
  const [complaintDescription, setComplaintDescription] = useState(
    'Victim contacted on Skype by individuals impersonating CBI and Telecom Regulatory Authority. Threatened with non-bailable arrest warrant regarding money laundering parcel. Victim coerced into RTGS liquidation under digital arrest.'
  );
  const [evidenceName, setEvidenceName] = useState<string>('cbi_fake_summons_notice.pdf');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [predictionRunning, setPredictionRunning] = useState(false);

  // Quick preset sample loaders
  const loadPreset = (type: 'digital_arrest' | 'upi_phish' | 'job_scam') => {
    if (type === 'digital_arrest') {
      setComplaintType('Digital Arrest');
      setVictimName('Dr. Sneha Kulkarni');
      setTransactionAmount(2400000);
      setBank('Bank of Maharashtra');
      setAccountInfo('BOM Current - 60192847192');
      setSuspectedAccount('Kotak Mahindra - 8819201928');
      setTransactionLocation('Nanded, Maharashtra');
      setState('Maharashtra');
      setDistrict('Nanded');
      setLatitude(19.1528);
      setLongitude(77.3195);
      setComplaintDescription('Skype video call posing as Mumbai Police Crime Branch accusing victim of drug courier package. Forced to transfer entire savings.');
      setEvidenceName('fake_arrest_warrant_skype.png');
    } else if (type === 'upi_phish') {
      setComplaintType('UPI Phishing');
      setVictimName('Vikramaditya Rathore');
      setTransactionAmount(120000);
      setBank('Punjab National Bank');
      setAccountInfo('PNB Savings - 08120019284');
      setSuspectedAccount('Airtel Payments Bank - 9821039182');
      setTransactionLocation('Bharatpur, Rajasthan');
      setState('Rajasthan');
      setDistrict('Bharatpur');
      setLatitude(27.2152);
      setLongitude(77.4929);
      setComplaintDescription('Electricity disconnection phishing SMS containing malicious APK. Unauthorized UPI debit tranches executed within 4 minutes.');
      setEvidenceName('apk_screen_mirror_dump.txt');
    } else {
      setComplaintType('Part-time Job Fraud');
      setVictimName('Pooja Sen');
      setTransactionAmount(480000);
      setBank('HDFC Bank');
      setAccountInfo('HDFC - 5010049281');
      setSuspectedAccount('Yes Bank - 091827364512');
      setTransactionLocation('Bengaluru, Karnataka');
      setState('Karnataka');
      setDistrict('Bengaluru Urban');
      setLatitude(12.9716);
      setLongitude(77.5946);
      setComplaintDescription('Telegram hotel rating task fraud. Trapped in prepaid task escrow scheme demanding consecutive deposits to unfreeze earned commission.');
      setEvidenceName('telegram_merchant_chat.pdf');
    }
  };

  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
    if (selectedState === 'Maharashtra') {
      setDistrict('Pune');
      setLatitude(18.5204);
      setLongitude(73.8567);
      setTransactionLocation('Pune, Maharashtra');
    } else if (selectedState === 'Karnataka') {
      setDistrict('Bengaluru Urban');
      setLatitude(12.9716);
      setLongitude(77.5946);
      setTransactionLocation('Bengaluru, Karnataka');
    } else if (selectedState === 'Rajasthan') {
      setDistrict('Bharatpur');
      setLatitude(27.2152);
      setLongitude(77.4929);
      setTransactionLocation('Bharatpur, Rajasthan');
    } else if (selectedState === 'Delhi') {
      setDistrict('New Delhi');
      setLatitude(28.6139);
      setLongitude(77.209);
      setTransactionLocation('New Delhi, Delhi NCR');
    } else if (selectedState === 'Gujarat') {
      setDistrict('Surat');
      setLatitude(21.1702);
      setLongitude(72.8311);
      setTransactionLocation('Surat, Gujarat');
    }
  };

  const handleRegister = (runImmediately: boolean = false) => {
    setIsSubmitting(true);
    const riskScore = transactionAmount > 1000000 ? 92 : transactionAmount > 300000 ? 84 : 70;
    const riskLevel: RiskLevel = riskScore >= 90 ? 'CRITICAL' : riskScore >= 75 ? 'HIGH' : 'MEDIUM';

    const newComplaintId = addComplaint({
      ncrpRef,
      victimName,
      contactNumber,
      complaintType,
      transactionId,
      transactionAmount: Number(transactionAmount),
      transactionTime,
      bank,
      accountInfo,
      suspectedAccount,
      transactionLocation,
      state,
      district,
      latitude,
      longitude,
      complaintDescription,
      evidenceUpload: evidenceName,
      status: runImmediately ? 'Analyzing' : 'Pending Review',
      riskScore,
      riskLevel,
    });

    setIsSubmitting(false);
    setSubmittedId(newComplaintId);

    if (runImmediately) {
      setPredictionRunning(true);
      runPrediction(newComplaintId).then(() => {
        setPredictionRunning(false);
        navigate(`/predictions?complaintId=${newComplaintId}`);
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              New Cybercrime Complaint Registration
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            NCRP / CFCFRMS National Portal Ingestion Form • Feeds directly into CYBER PEHRA AI Grid
          </p>
        </div>

        {/* Preset sample buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Load Sample:</span>
          <button
            type="button"
            onClick={() => loadPreset('digital_arrest')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-mono transition-colors"
          >
            Digital Arrest
          </button>
          <button
            type="button"
            onClick={() => loadPreset('upi_phish')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-mono transition-colors"
          >
            UPI Phishing
          </button>
          <button
            type="button"
            onClick={() => loadPreset('job_scam')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 text-xs font-mono transition-colors"
          >
            Task Fraud
          </button>
        </div>
      </div>

      {/* Confirmation Modal if submitted */}
      {submittedId && !predictionRunning && (
        <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-emerald-300">
                Complaint Successfully Received — Case ID: {submittedId}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Forensic hash generated and anchored to National Fusion Pipeline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setPredictionRunning(true);
                runPrediction(submittedId).then(() => {
                  setPredictionRunning(false);
                  navigate(`/predictions?complaintId=${submittedId}`);
                });
              }}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-sky-900/40"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Run Predictive Analytics Workflow Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => navigate('/complaints')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              View Complaints List
            </button>
          </div>
        </div>
      )}

      {/* Main Registration Form Card */}
      <div className="p-6 rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-6 text-xs">
        {/* Section 1: Complaint & Victim Details */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-1.5 flex items-center gap-2">
            <span>1. Reference & Victim Identification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">NCRP / CFCFRMS Reference</label>
              <input
                type="text"
                value={ncrpRef}
                onChange={(e) => setNcrpRef(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Victim Full Name</label>
              <input
                type="text"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fraud Typology & Financial Transaction */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-1.5 flex items-center gap-2">
            <span>2. Fraud Modus Operandi & Banking Transaction</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Cybercrime Category / Typology</label>
              <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value as ComplaintType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Digital Arrest">Digital Arrest (CBI/ED/Police Impersonation)</option>
                <option value="UPI Phishing">UPI Phishing / Fake QR Code</option>
                <option value="Part-time Job Fraud">Part-time Job / Telegram Rating Task</option>
                <option value="Fake Investment App">Fake Investment / Institutional IPO App</option>
                <option value="Loan App Extortion">Predatory Loan App Extortion</option>
                <option value="SIM Swap">SIM Swap / eSIM Duplication Breach</option>
                <option value="Sextortion">WhatsApp Video Call Sextortion</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Transaction ID / RRN / UTR</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Transaction Amount (₹)</label>
              <input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono font-bold text-sky-400 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Victim Bank & Account</label>
              <input
                type="text"
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Suspected Recipient / Mule Account</label>
              <input
                type="text"
                value={suspectedAccount}
                onChange={(e) => setSuspectedAccount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono text-amber-300 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Incident / Debit Date & Time</label>
              <input
                type="datetime-local"
                value={transactionTime}
                onChange={(e) => setTransactionTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Geospatial Coordinates & Location */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-1.5 flex items-center gap-2">
            <span>3. Geospatial & Jurisdiction Coordinates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">State</label>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">District / City</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Narrative Description & Evidence */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-1.5 flex items-center gap-2">
            <span>4. Modus Narrative & Digital Evidence</span>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Detailed Incident Narrative</label>
            <textarea
              rows={3}
              value={complaintDescription}
              onChange={(e) => setComplaintDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed"
            />
          </div>

          {/* Evidence Upload Simulator */}
          <div>
            <label className="block text-slate-400 mb-1">Digital Evidence Document (Bank slip, chat export, APK)</label>
            <div className="p-4 rounded-lg border-2 border-dashed border-slate-700 hover:border-sky-500/50 bg-slate-900/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-slate-500 mb-2" />
              <span className="text-xs text-slate-300 font-medium">{evidenceName}</span>
              <span className="text-[11px] text-slate-500 mt-0.5">Click or drag & drop forensic file to attach</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => handleRegister(false)}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors flex items-center gap-2 border border-slate-700"
          >
            <Save className="w-4 h-4" />
            <span>Register Complaint (Save)</span>
          </button>

          <button
            type="button"
            onClick={() => handleRegister(true)}
            disabled={isSubmitting || predictionRunning}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-900/30 flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{predictionRunning ? 'Running AI Engine...' : 'Submit & Run Predictive Pipeline'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
