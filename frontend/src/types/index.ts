export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UserRole = 'LEA' | 'BANK' | 'I4C' | 'ADMIN';

export type ComplaintType =
  | 'Digital Arrest'
  | 'UPI Phishing'
  | 'Part-time Job Fraud'
  | 'Fake Investment App'
  | 'Loan App Extortion'
  | 'SIM Swap'
  | 'Sextortion';

export interface Complaint {
  id: string; // e.g. CP-2026-8941
  ncrpRef: string; // e.g. NCRP-2026-MHA-98214
  victimName: string;
  contactNumber: string;
  complaintType: ComplaintType;
  transactionId: string;
  transactionAmount: number;
  transactionTime: string;
  bank: string;
  accountInfo: string;
  suspectedAccount: string;
  transactionLocation: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  complaintDescription: string;
  evidenceUpload?: string;
  status: 'Pending Review' | 'Analyzing' | 'Predicted' | 'Under Investigation' | 'Closed';
  riskScore: number;
  riskLevel: RiskLevel;
  predictedLocationId?: string;
  createdAt: string;
}

export interface RiskFactor {
  factor: string;
  impact: number;
  description: string;
  category: 'mule' | 'temporal' | 'spatial' | 'transactional' | 'network';
}

export interface WithdrawalLocation {
  id: string;
  name: string;
  bankName: string;
  type: 'ATM' | 'Bank Branch' | 'CSP/Kiosk';
  state: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  riskScore: number;
  riskLevel: RiskLevel;
  predictedTimeWindow: string;
  amountAtRisk: number;
  confidenceScore: number; // e.g. 91%
  status: 'Monitoring' | 'Alert Sent' | 'Patrol Dispatched' | 'Under Surveillance' | 'Intercepted';
  linkedComplaintIds: string[];
  linkedMuleAccounts: string[];
  reasons: RiskFactor[];
  nearestPoliceStation: string;
  distanceToPatrolKm: number;
  cctvOperational: boolean;
  cashReserve: number;
  lastAnomalyDetected: string;
}

export interface AlertNotification {
  id: string; // e.g. ALT-9042
  title: string;
  type:
    | 'Critical Risk Location'
    | 'High Risk ATM'
    | 'Suspicious Mule Network'
    | 'Imminent Withdrawal'
    | 'Cross-Jurisdiction Activity';
  locationId: string;
  locationName: string;
  state: string;
  district: string;
  riskScore: number;
  severity: RiskLevel;
  timestamp: string;
  recipient: 'Law Enforcement Agencies' | 'Banks / Financial Institutions' | 'I4C' | 'Joint Taskforce';
  channel: 'SMS + Dashboard' | 'Email + API' | 'Direct Terminal' | 'NPCI Urgent Webhook';
  status: 'Sent' | 'Delivered' | 'Acknowledged' | 'Action Taken';
  amountAtRisk: number;
}

export interface InvestigationCase {
  id: string; // e.g. INV-7731
  complaintId: string;
  complaintTitle: string;
  assignedOfficer: string;
  policeStation: string;
  locationName: string;
  locationId?: string;
  riskLevel: RiskLevel;
  suspectedAccount: string;
  suspectedMuleName: string;
  actionTaken: string;
  accountFreezeStatus: 'None' | 'Requested' | 'Frozen (Sec 102 CrPC)' | 'Lien Placed';
  seizureStatus: 'Pending' | 'Cash Seized' | 'No Seizure' | 'Asset Frozen';
  amountRecovered: number;
  evidenceList: string[];
  notes: string[];
  status: 'Open' | 'Team Dispatched' | 'Surveillance Active' | 'Intervention Completed' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface OfficerFeedbackRecord {
  id: string;
  caseId: string;
  officerName: string;
  badgeNumber: string;
  outcome: 'Arrest' | 'Account Frozen' | 'Cash Withdrawal Prevented' | 'False Positive' | 'No Action';
  predictionAccuracy: number; // 1-5
  riskScoreValidated: boolean;
  comments: string;
  additionalEvidence: string;
  timestamp: string;
  usedInModelTraining: boolean;
}

export interface BlockchainBlock {
  blockId: number;
  timestamp: string;
  action: string;
  officer: string;
  caseId: string;
  hash: string;
  previousHash: string;
  status: 'CONFIRMED' | 'IMMUTABLE';
  payloadSummary: string;
}

export interface ModelMetrics {
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  predictionsToday: number;
  successfulPredictions: number;
  lastRetrained: string;
  trainingSamples: number;
  status: 'OPTIMAL' | 'RETRAINING' | 'EVALUATING';
}

export interface DataFusionSource {
  id: string;
  name: string;
  code: string;
  category: string;
  recordsReceived: number;
  recordsProcessed: number;
  lastSync: string;
  dataQuality: number; // percentage e.g. 98.6
  status: 'ACTIVE' | 'SYNCING' | 'OPTIMAL' | 'DEGRADED';
  description: string;
}

export interface MuleNode {
  id: string;
  label: string;
  type: 'victim' | 'mule_l1' | 'mule_l2' | 'shell_firm' | 'atm' | 'branch' | 'crypto_exchange';
  bank: string;
  accountNumber: string;
  holder: string;
  balance: number;
  riskScore: number;
  flag: string;
  x?: number;
  y?: number;
}

export interface MuleEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  type: 'UPI Transfer' | 'IMPS/NEFT' | 'ATM Cash-Out' | 'P2P Crypto' | 'Cheque Clearance';
  timestamp: string;
  hopLevel: number;
}
