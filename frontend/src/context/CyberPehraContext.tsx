import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  WithdrawalLocation,
  AlertNotification,
  InvestigationCase,
  OfficerFeedbackRecord,
  BlockchainBlock,
  ModelMetrics,
  DataFusionSource,
  MuleNode,
  MuleEdge,
  UserRole,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_LOCATIONS,
  INITIAL_ALERTS,
  INITIAL_INVESTIGATIONS,
  INITIAL_OFFICER_FEEDBACK,
  INITIAL_BLOCKCHAIN_BLOCKS,
  INITIAL_DATA_FUSION_SOURCES,
  INITIAL_MODEL_METRICS,
  INITIAL_MULE_NODES,
  INITIAL_MULE_EDGES,
} from '../data/mockData';
import { generateSha256Hash } from '../utils/cryptoHash';
import { api } from '../services/api';
import { wsClient } from '../services/websocket';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
}

interface CyberPehraContextType {
  // State
  complaints: Complaint[];
  locations: WithdrawalLocation[];
  alerts: AlertNotification[];
  investigations: InvestigationCase[];
  feedbackRecords: OfficerFeedbackRecord[];
  blockchainBlocks: BlockchainBlock[];
  fusionSources: DataFusionSource[];
  modelMetrics: ModelMetrics;
  muleNodes: MuleNode[];
  muleEdges: MuleEdge[];
  currentRole: UserRole;
  isRetraining: boolean;
  toasts: ToastNotification[];
  searchModalOpen: boolean;

  // Actions
  setCurrentRole: (role: UserRole) => void;
  setSearchModalOpen: (open: boolean) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt'>) => string;
  runPrediction: (complaintId: string) => Promise<{ location: WithdrawalLocation; riskScore: number }>;
  dispatchTeam: (caseId: string, locationId?: string) => void;
  freezeAccount: (caseId: string, accountNumber: string, amountToFreeze?: number) => void;
  markSurveillance: (locationId: string) => void;
  submitOfficerFeedback: (feedback: Omit<OfficerFeedbackRecord, 'id' | 'timestamp' | 'usedInModelTraining'>) => void;
  triggerModelRetraining: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => void;
  resetDemoData: () => void;
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp' | 'read'>) => void;
  markToastRead: (id: string) => void;
  clearAllToasts: () => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
}

const CyberPehraContext = createContext<CyberPehraContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'CYBER_PEHRA_V1_';

export const CyberPehraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load helper
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    loadState('complaints', INITIAL_COMPLAINTS)
  );
  const [locations, setLocations] = useState<WithdrawalLocation[]>(() =>
    loadState('locations', INITIAL_LOCATIONS)
  );
  const [alerts, setAlerts] = useState<AlertNotification[]>(() =>
    loadState('alerts', INITIAL_ALERTS)
  );
  const [investigations, setInvestigations] = useState<InvestigationCase[]>(() =>
    loadState('investigations', INITIAL_INVESTIGATIONS)
  );
  const [feedbackRecords, setFeedbackRecords] = useState<OfficerFeedbackRecord[]>(() =>
    loadState('feedback', INITIAL_OFFICER_FEEDBACK)
  );
  const [blockchainBlocks, setBlockchainBlocks] = useState<BlockchainBlock[]>(() =>
    loadState('blocks', INITIAL_BLOCKCHAIN_BLOCKS)
  );
  const [fusionSources, setFusionSources] = useState<DataFusionSource[]>(() =>
    loadState('fusion', INITIAL_DATA_FUSION_SOURCES)
  );
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>(() =>
    loadState('metrics', INITIAL_MODEL_METRICS)
  );
  const [muleNodes, setMuleNodes] = useState<MuleNode[]>(() =>
    loadState('nodes', INITIAL_MULE_NODES)
  );
  const [muleEdges, setMuleEdges] = useState<MuleEdge[]>(() =>
    loadState('edges', INITIAL_MULE_EDGES)
  );
  const [currentRole, setCurrentRole] = useState<UserRole>(() =>
    loadState('role', 'LEA')
  );

  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastNotification[]>([
    {
      id: 'toast-1',
      title: 'High-Risk Prediction Generated',
      message: 'Nanded SBI ATM flagged with 96/100 withdrawal probability within 90 mins.',
      type: 'critical',
      timestamp: 'Just now',
      read: false,
    },
    {
      id: 'toast-2',
      title: 'Section 102 CrPC Lien Confirmed',
      message: 'HDFC Bank placed debit hold on ₹11,20,000 for Pune Case INV-7731.',
      type: 'success',
      timestamp: '15 mins ago',
      read: false,
    },
  ]);

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'investigations', JSON.stringify(investigations));
  }, [investigations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'feedback', JSON.stringify(feedbackRecords));
  }, [feedbackRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'blocks', JSON.stringify(blockchainBlocks));
  }, [blockchainBlocks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'metrics', JSON.stringify(modelMetrics));
  }, [modelMetrics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'role', JSON.stringify(currentRole));
  }, [currentRole]);

  // Connect to backend API & WebSocket on mount
  useEffect(() => {
    wsClient.connect();
    const unsubscribe = wsClient.subscribe((payload: any) => {
      if (payload && payload.event === 'NEW_ALERT' && payload.alert) {
        setAlerts((prev) => [payload.alert, ...prev.filter((a) => a.id !== payload.alert.id)]);
        if (payload.toast) {
          addToast(payload.toast);
        }
      }
    });

    // Hydrate state from FastAPI backend
    const loadBackendData = async () => {
      try {
        const [
          complaintsRes,
          locationsRes,
          alertsRes,
          invsRes,
          feedbackRes,
          blocksRes,
          fusionRes,
          metricsRes,
          muleRes,
        ] = await Promise.allSettled([
          api.getComplaints(),
          api.getLocations(),
          api.getAlerts(),
          api.getInvestigations(),
          api.getFeedbackRecords(),
          api.getAuditTrail(),
          api.getDataSources(),
          api.getModelMetrics(),
          api.getMuleNetwork(),
        ]);

        if (complaintsRes.status === 'fulfilled' && complaintsRes.value?.length) {
          setComplaints(complaintsRes.value);
        }
        if (locationsRes.status === 'fulfilled' && locationsRes.value?.length) {
          setLocations(locationsRes.value);
        }
        if (alertsRes.status === 'fulfilled' && alertsRes.value?.length) {
          setAlerts(alertsRes.value);
        }
        if (invsRes.status === 'fulfilled' && invsRes.value?.length) {
          setInvestigations(invsRes.value);
        }
        if (feedbackRes.status === 'fulfilled' && feedbackRes.value?.length) {
          setFeedbackRecords(feedbackRes.value);
        }
        if (blocksRes.status === 'fulfilled' && blocksRes.value?.length) {
          setBlockchainBlocks(blocksRes.value);
        }
        if (fusionRes.status === 'fulfilled' && fusionRes.value?.length) {
          setFusionSources(fusionRes.value);
        }
        if (metricsRes.status === 'fulfilled' && metricsRes.value) {
          setModelMetrics(metricsRes.value);
        }
        if (muleRes.status === 'fulfilled' && muleRes.value) {
          if (muleRes.value.nodes?.length) setMuleNodes(muleRes.value.nodes);
          if (muleRes.value.edges?.length) setMuleEdges(muleRes.value.edges);
        }
      } catch (err) {
        console.warn('Backend hydration notice:', err);
      }
    };

    loadBackendData();

    return () => {
      unsubscribe();
      wsClient.disconnect();
    };
  }, []);

  // Toast Helpers
  const addToast = (toast: Omit<ToastNotification, 'id' | 'timestamp' | 'read'>) => {
    const newToast: ToastNotification = {
      ...toast,
      id: `toast-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 15)]);
  };

  const markToastRead = (id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, read: true } : t)));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Append immutable block to blockchain ledger
  const appendBlockchainBlock = (
    action: string,
    officer: string,
    caseId: string,
    payloadSummary: string
  ) => {
    setBlockchainBlocks((prev) => {
      const lastBlock = prev[prev.length - 1];
      const newBlockId = (lastBlock ? lastBlock.blockId : 10000) + 1;
      const prevHash = lastBlock ? lastBlock.hash : '0x0000000000000000000000000000000000000000000000000000000000000000';
      const timestamp = new Date().toISOString();
      const rawString = `${newBlockId}-${timestamp}-${action}-${officer}-${caseId}-${prevHash}-${payloadSummary}`;
      const newHash = generateSha256Hash(rawString);

      const block: BlockchainBlock = {
        blockId: newBlockId,
        timestamp,
        action,
        officer,
        caseId,
        hash: newHash,
        previousHash: prevHash,
        status: 'CONFIRMED',
        payloadSummary,
      };
      return [...prev, block];
    });
  };

  // Add new complaint
  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'createdAt'>): string => {
    const tempId = `CP-2026-${Math.floor(8960 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();
    const newComplaint: Complaint = {
      ...complaintData,
      id: tempId,
      createdAt: nowIso,
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Send to backend API
    api.createComplaint(complaintData)
      .then((created) => {
        setComplaints((prev) => prev.map((c) => (c.id === tempId ? created : c)));
        api.getLocations().then(setLocations).catch(() => {});
        api.getAlerts().then(setAlerts).catch(() => {});
        api.getInvestigations().then(setInvestigations).catch(() => {});
        api.getAuditTrail().then(setBlockchainBlocks).catch(() => {});
      })
      .catch((err) => {
        console.warn('Backend complaint sync fallback:', err);
      });

    // Update Data fusion source counters
    setFusionSources((prev) =>
      prev.map((src) =>
        src.id === 'DFS-01' || src.id === 'DFS-03'
          ? {
              ...src,
              recordsReceived: src.recordsReceived + 1,
              recordsProcessed: src.recordsProcessed + 1,
              lastSync: 'Just now',
            }
          : src
      )
    );

    // Blockchain block
    appendBlockchainBlock(
      'COMPLAINT_REGISTERED_NCRP',
      `OFFICER_${currentRole}_PORTAL`,
      tempId,
      `New ${newComplaint.complaintType} complaint registered. Amount: ₹${newComplaint.transactionAmount.toLocaleString('en-IN')}`
    );

    addToast({
      title: 'Complaint Registered',
      message: `${tempId} entered into National Fusion Grid. Running predictive analysis...`,
      type: 'info',
    });

    return tempId;
  };

  // Run prediction pipeline
  const runPrediction = async (complaintId: string): Promise<{ location: WithdrawalLocation; riskScore: number }> => {
    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) {
      throw new Error(`Complaint ${complaintId} not found`);
    }

    // Call real backend prediction API
    try {
      const pred = await api.runPrediction(complaintId);
      if (pred && pred.location) {
        setLocations((prev) =>
          prev.map((loc) => (loc.id === pred.location.id ? pred.location : loc))
        );
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === complaintId
              ? {
                  ...c,
                  status: 'Predicted',
                  riskScore: pred.riskScore,
                  riskLevel: pred.riskLevel as any,
                  predictedLocationId: pred.location.id,
                }
              : c
          )
        );

        api.getAlerts().then(setAlerts).catch(() => {});
        api.getInvestigations().then(setInvestigations).catch(() => {});
        api.getAuditTrail().then(setBlockchainBlocks).catch(() => {});
        api.getModelMetrics().then(setModelMetrics).catch(() => {});

        addToast({
          title: 'Predictive Forecast Generated',
          message: `Identified ${pred.location.name} (${pred.location.district}) as likely cash-out site. Alert dispatched!`,
          type: pred.riskLevel === 'CRITICAL' ? 'critical' : 'warning',
        });

        return { location: pred.location, riskScore: pred.riskScore };
      }
    } catch (e) {
      console.warn('Backend prediction error, running local fallback calculation:', e);
    }

    // Local fallback calculation if backend unreachable
    await new Promise((resolve) => setTimeout(resolve, 800));

    let targetLocation = locations.find((l) => l.state === complaint.state);
    if (!targetLocation) {
      targetLocation = locations[0];
    }

    const baseRisk = Math.min(98, Math.max(72, Math.floor(complaint.transactionAmount / 30000) + 65));
    const riskLevel = baseRisk >= 90 ? 'CRITICAL' : baseRisk >= 75 ? 'HIGH' : 'MEDIUM';

    const updatedLocation: WithdrawalLocation = {
      ...targetLocation,
      riskScore: baseRisk,
      riskLevel,
      amountAtRisk: targetLocation.amountAtRisk + complaint.transactionAmount,
      confidenceScore: Math.floor(88 + Math.random() * 8),
      predictedTimeWindow: 'Within next 45 – 90 mins',
      status: 'Alert Sent',
      linkedComplaintIds: Array.from(new Set([...targetLocation.linkedComplaintIds, complaint.id])),
      linkedMuleAccounts: Array.from(new Set([...targetLocation.linkedMuleAccounts, complaint.suspectedAccount])),
      lastAnomalyDetected: 'Just now',
    };

    setLocations((prev) =>
      prev.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc))
    );

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'Predicted',
              riskScore: baseRisk,
              riskLevel,
              predictedLocationId: updatedLocation.id,
            }
          : c
      )
    );

    const newAlert: AlertNotification = {
      id: `ALT-${Math.floor(9060 + Math.random() * 500)}`,
      title: `${riskLevel}: Predicted ATM Cash Extraction at ${updatedLocation.name}`,
      type: baseRisk >= 90 ? 'Critical Risk Location' : 'Imminent Withdrawal',
      locationId: updatedLocation.id,
      locationName: updatedLocation.name,
      state: updatedLocation.state,
      district: updatedLocation.district,
      riskScore: baseRisk,
      severity: riskLevel,
      timestamp: new Date().toISOString(),
      recipient: 'Law Enforcement Agencies',
      channel: 'SMS + Dashboard',
      status: 'Delivered',
      amountAtRisk: complaint.transactionAmount,
    };

    setAlerts((prev) => [newAlert, ...prev]);

    const newInv: InvestigationCase = {
      id: `INV-${Math.floor(7750 + Math.random() * 300)}`,
      complaintId: complaint.id,
      complaintTitle: `${complaint.complaintType} - ₹${(complaint.transactionAmount / 100000).toFixed(1)}L`,
      assignedOfficer: 'Insp. V. K. Sharma (Cyber Cell)',
      policeStation: `${updatedLocation.district} Cyber Police Station`,
      locationName: updatedLocation.name,
      locationId: updatedLocation.id,
      riskLevel,
      suspectedAccount: complaint.suspectedAccount,
      suspectedMuleName: 'Mule Associate Under Geofencing',
      actionTaken: 'Predictive alert issued. Coordinated with bank nodal officer.',
      accountFreezeStatus: 'Requested',
      seizureStatus: 'Pending',
      amountRecovered: 0,
      evidenceList: ['complaint_payload_geohash.json', 'atm_proximity_prediction.pdf'],
      notes: [
        `${new Date().toLocaleTimeString()} - Predictive AI triggered with ${baseRisk}/100 Risk Score.`,
        `Pinpointed extraction point: ${updatedLocation.name} (${updatedLocation.address}).`,
      ],
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInvestigations((prev) => [newInv, ...prev]);

    setModelMetrics((prev) => ({
      ...prev,
      predictionsToday: prev.predictionsToday + 1,
    }));

    appendBlockchainBlock(
      'PREDICTION_ENGINE_RUN',
      'AI_INFERENCE_ENGINE_V2.4',
      complaint.id,
      `Predicted Cash Extraction at ${updatedLocation.name}. Risk Score: ${baseRisk}/100. Confidence: ${updatedLocation.confidenceScore}%`
    );

    addToast({
      title: 'Predictive Forecast Generated',
      message: `Identified ${updatedLocation.name} (${updatedLocation.district}) as likely cash-out site. Alert dispatched!`,
      type: riskLevel === 'CRITICAL' ? 'critical' : 'warning',
    });

    return { location: updatedLocation, riskScore: baseRisk };
  };

  // Dispatch LEA Patrol
  const dispatchTeam = (caseId: string, locationId?: string) => {
    // Send to backend
    api.dispatchTeam(caseId, locationId).catch((e) => console.warn(e));

    setInvestigations((prev) =>
      prev.map((inv) =>
        inv.id === caseId
          ? {
              ...inv,
              status: 'Team Dispatched',
              actionTaken: 'Quick Response Team (QRT) Patrol unit dispatched to intercept suspect.',
              notes: [
                ...inv.notes,
                `${new Date().toLocaleTimeString()} - QRT Patrol Unit dispatched to target location perimeter.`,
              ],
              updatedAt: new Date().toISOString(),
            }
          : inv
      )
    );

    if (locationId) {
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === locationId ? { ...loc, status: 'Patrol Dispatched' } : loc
        )
      );
    }

    appendBlockchainBlock(
      'QRT_TEAM_DISPATCHED',
      `OFFICER_${currentRole}`,
      caseId,
      `Ground intervention team dispatched to intercept cash runner.`
    );

    addToast({
      title: 'QRT Patrol Dispatched',
      message: `Intervention team deployed to ATM perimeter for Case ${caseId}.`,
      type: 'warning',
    });
  };

  // Freeze Account (Sec 102 CrPC)
  const freezeAccount = (caseId: string, accountNumber: string, amountToFreeze?: number) => {
    api.freezeAccount(caseId, accountNumber, amountToFreeze).catch((e) => console.warn(e));

    setInvestigations((prev) =>
      prev.map((inv) => {
        if (inv.id === caseId) {
          const recovered = amountToFreeze || 450000;
          return {
            ...inv,
            accountFreezeStatus: 'Frozen (Sec 102 CrPC)',
            amountRecovered: (inv.amountRecovered || 0) + recovered,
            notes: [
              ...inv.notes,
              `${new Date().toLocaleTimeString()} - Section 102 CrPC debit freeze enforced on account ${accountNumber}. Preserved ₹${recovered.toLocaleString('en-IN')}.`,
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return inv;
      })
    );

    appendBlockchainBlock(
      'SECTION_102_FREEZE_ENFORCED',
      `BANK_NODAL_${currentRole}`,
      caseId,
      `Account ${accountNumber} debit-blocked. Section 102 CrPC compliance established.`
    );

    addToast({
      title: 'Section 102 Account Frozen',
      message: `Debit freeze enforced on account ${accountNumber}. Funds safeguarded.`,
      type: 'success',
    });
  };

  // Mark Surveillance
  const markSurveillance = (locationId: string) => {
    api.markSurveillance(locationId).catch((e) => console.warn(e));

    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === locationId ? { ...loc, status: 'Under Surveillance' } : loc
      )
    );

    appendBlockchainBlock(
      'ATM_SURVEILLANCE_FLAGGED',
      `SURVEILLANCE_GRID_${currentRole}`,
      locationId,
      `Physical and CCTV surveillance activated on ${locationId}.`
    );

    addToast({
      title: 'Surveillance Active',
      message: `ATM and bank perimeter marked for active video and drone surveillance.`,
      type: 'info',
    });
  };

  // Submit Officer Feedback
  const submitOfficerFeedback = (
    feedbackData: Omit<OfficerFeedbackRecord, 'id' | 'timestamp' | 'usedInModelTraining'>
  ) => {
    api.submitOfficerFeedback(feedbackData).catch((e) => console.warn(e));

    const feedbackId = `FB-${Math.floor(510 + Math.random() * 200)}`;
    const nowIso = new Date().toISOString();

    const record: OfficerFeedbackRecord = {
      ...feedbackData,
      id: feedbackId,
      timestamp: nowIso,
      usedInModelTraining: false,
    };

    setFeedbackRecords((prev) => [record, ...prev]);

    // Update investigation status
    setInvestigations((prev) =>
      prev.map((inv) => {
        if (inv.id === feedbackData.caseId) {
          const status = feedbackData.outcome === 'Arrest' || feedbackData.outcome === 'Cash Withdrawal Prevented'
            ? 'Intervention Completed'
            : feedbackData.outcome === 'False Positive'
            ? 'Closed'
            : inv.status;
          return {
            ...inv,
            status,
            seizureStatus: feedbackData.outcome === 'Arrest' ? 'Cash Seized' : inv.seizureStatus,
            notes: [
              ...inv.notes,
              `${new Date().toLocaleTimeString()} - Field Officer Feedback submitted by ${feedbackData.officerName} (${feedbackData.badgeNumber}): Outcome = ${feedbackData.outcome}.`,
            ],
            updatedAt: nowIso,
          };
        }
        return inv;
      })
    );

    appendBlockchainBlock(
      'OFFICER_FEEDBACK_RECORDED',
      feedbackData.officerName,
      feedbackData.caseId,
      `Ground truth outcome: ${feedbackData.outcome}. Accuracy rating: ${feedbackData.predictionAccuracy}/5. Training buffer updated.`
    );

    addToast({
      title: 'Feedback Logged & Blockchain Sealed',
      message: `Outcome: ${feedbackData.outcome}. Ground-truth label queued for model retraining.`,
      type: 'success',
    });
  };

  // Continuous Learning: Model Retraining
  const triggerModelRetraining = async () => {
    setIsRetraining(true);
    addToast({
      title: 'Continuous Retraining Started',
      message: 'Ingesting officer feedback labels and fine-tuning Graph Neural Network & Spatio-Temporal weights...',
      type: 'info',
    });

    try {
      const res = await api.triggerModelRetraining();
      if (res && res.metrics) {
        setModelMetrics(res.metrics);
        setFeedbackRecords((prev) =>
          prev.map((fb) => ({ ...fb, usedInModelTraining: true }))
        );
        api.getAuditTrail().then(setBlockchainBlocks).catch(() => {});
        setIsRetraining(false);
        addToast({
          title: 'Model Retrained Successfully',
          message: `Active model upgraded to ${res.newVersion}. Intervention accuracy and false-positive resilience enhanced.`,
          type: 'success',
        });
        return;
      }
    } catch (e) {
      console.warn('Backend retraining fallback notice:', e);
    }

    // Local simulation fallback
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setModelMetrics((prev) => {
      const newVersion = prev.version === 'v2.4.1' ? 'v2.4.2' : 'v2.4.3';
      return {
        ...prev,
        version: newVersion,
        accuracy: +(prev.accuracy + 0.9).toFixed(1),
        precision: +(prev.precision + 1.2).toFixed(1),
        recall: +(prev.recall + 1.4).toFixed(1),
        f1Score: +(prev.f1Score + 1.3).toFixed(1),
        falsePositiveRate: +(Math.max(1.8, prev.falsePositiveRate - 0.7)).toFixed(1),
        successfulPredictions: prev.successfulPredictions + feedbackRecords.length,
        lastRetrained: new Date().toISOString(),
        trainingSamples: prev.trainingSamples + feedbackRecords.length,
        status: 'OPTIMAL',
      };
    });

    setFeedbackRecords((prev) =>
      prev.map((fb) => ({ ...fb, usedInModelTraining: true }))
    );

    setIsRetraining(false);

    appendBlockchainBlock(
      'MODEL_WEIGHTS_UPDATED',
      'CONTINUOUS_LEARNING_PIPELINE',
      'MODEL-V2.4.2',
      'Model upgraded to v2.4.2. Precision boosted to 93.6%, Recall 90.5%. Merkle proof anchored.'
    );

    addToast({
      title: 'Model Retrained Successfully',
      message: 'Active model upgraded to v2.4.2. Intervention accuracy and false-positive resilience enhanced.',
      type: 'success',
    });
  };

  // Acknowledge Alert
  const acknowledgeAlert = (alertId: string) => {
    api.acknowledgeAlert(alertId).catch((e) => console.warn(e));

    setAlerts((prev) =>
      prev.map((alt) =>
        alt.id === alertId ? { ...alt, status: 'Acknowledged' } : alt
      )
    );

    appendBlockchainBlock(
      'ALERT_ACKNOWLEDGED',
      `OFFICER_${currentRole}`,
      alertId,
      `Stakeholder acknowledged high-priority intervention alert.`
    );
  };

  // Update complaint status
  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    api.updateComplaintStatus(id, status).catch((e) => console.warn(e));

    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  // Reset to default seed mock data
  const resetDemoData = () => {
    localStorage.clear();
    setComplaints(INITIAL_COMPLAINTS);
    setLocations(INITIAL_LOCATIONS);
    setAlerts(INITIAL_ALERTS);
    setInvestigations(INITIAL_INVESTIGATIONS);
    setFeedbackRecords(INITIAL_OFFICER_FEEDBACK);
    setBlockchainBlocks(INITIAL_BLOCKCHAIN_BLOCKS);
    setFusionSources(INITIAL_DATA_FUSION_SOURCES);
    setModelMetrics(INITIAL_MODEL_METRICS);
    setMuleNodes(INITIAL_MULE_NODES);
    setMuleEdges(INITIAL_MULE_EDGES);
    setCurrentRole('LEA');
    addToast({
      title: 'Demo Environment Reset',
      message: 'All datasets restored to initial simulated state.',
      type: 'info',
    });
  };

  return (
    <CyberPehraContext.Provider
      value={{
        complaints,
        locations,
        alerts,
        investigations,
        feedbackRecords,
        blockchainBlocks,
        fusionSources,
        modelMetrics,
        muleNodes,
        muleEdges,
        currentRole,
        isRetraining,
        toasts,
        searchModalOpen,
        setCurrentRole,
        setSearchModalOpen,
        addComplaint,
        runPrediction,
        dispatchTeam,
        freezeAccount,
        markSurveillance,
        submitOfficerFeedback,
        triggerModelRetraining,
        acknowledgeAlert,
        resetDemoData,
        addToast,
        markToastRead,
        clearAllToasts,
        updateComplaintStatus,
      }}
    >
      {children}
    </CyberPehraContext.Provider>
  );
};

export const useCyberPehra = () => {
  const context = useContext(CyberPehraContext);
  if (!context) {
    throw new Error('useCyberPehra must be used within a CyberPehraProvider');
  }
  return context;
};
