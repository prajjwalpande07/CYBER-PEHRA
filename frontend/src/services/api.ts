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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper for HTTP requests
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject token if stored
  const token = localStorage.getItem('CYBER_PEHRA_AUTH_TOKEN');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.detail) errorDetail = parsed.detail;
    } catch {
      if (errorText) errorDetail = errorText;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Auth
  async login(credentials: { username?: string; email?: string; password: string }) {
    const res = await request<{ access_token: string; token_type: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.access_token) {
      localStorage.setItem('CYBER_PEHRA_AUTH_TOKEN', res.access_token);
    }
    return res;
  },

  async getCurrentUser() {
    return request<any>('/auth/me');
  },

  // Dashboard
  async getDashboardOverview() {
    return request<any>('/dashboard/overview');
  },

  // Complaints
  async getComplaints(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return request<Complaint[]>(`/complaints${query ? `?${query}` : ''}`);
  },

  async getComplaint(id: string) {
    return request<Complaint>(`/complaints/${id}`);
  },

  async createComplaint(data: Omit<Complaint, 'id' | 'createdAt'>) {
    return request<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateComplaintStatus(id: string, status: Complaint['status']) {
    return request<Complaint>(`/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Predictions
  async runPrediction(complaintId: string) {
    return request<{
      complaintId: string;
      riskScore: number;
      riskLevel: string;
      confidenceScore: number;
      location: WithdrawalLocation;
      predictedTimeWindow: string;
      amountAtRisk: number;
      modelVersion: string;
      factors: any[];
      explanation: string;
    }>(`/predictions/run/${complaintId}`, {
      method: 'POST',
    });
  },

  async getPredictionExplanation(predictionId: string) {
    return request<any>(`/predictions/${predictionId}/explanation`);
  },

  // Locations & Heatmap
  async getLocations(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return request<WithdrawalLocation[]>(`/locations${query ? `?${query}` : ''}`);
  },

  async getLocation(id: string) {
    return request<WithdrawalLocation>(`/locations/${id}`);
  },

  async markSurveillance(locationId: string) {
    return request<WithdrawalLocation>(`/locations/${locationId}/surveillance`, {
      method: 'POST',
    });
  },

  async getHeatmapGeoJSON(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return request<any>(`/heatmap${query ? `?${query}` : ''}`);
  },

  // Mule Network
  async getMuleNetwork(accountId?: string) {
    const path = accountId ? `/mule-network/${accountId}` : '/mule-network';
    return request<{ nodes: MuleNode[]; edges: MuleEdge[] }>(path);
  },

  // Alerts
  async getAlerts(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return request<AlertNotification[]>(`/alerts${query ? `?${query}` : ''}`);
  },

  async createAlert(data: Omit<AlertNotification, 'id' | 'timestamp'>) {
    return request<AlertNotification>('/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async acknowledgeAlert(alertId: string) {
    return request<AlertNotification>(`/alerts/${alertId}/acknowledge`, {
      method: 'PATCH',
    });
  },

  // Investigations
  async getInvestigations(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return request<InvestigationCase[]>(`/investigations${query ? `?${query}` : ''}`);
  },

  async getInvestigation(caseId: string) {
    return request<InvestigationCase>(`/investigations/${caseId}`);
  },

  async dispatchTeam(caseId: string, locationId?: string, notes?: string) {
    return request<InvestigationCase>(`/investigations/${caseId}/dispatch`, {
      method: 'POST',
      body: JSON.stringify({ locationId, notes }),
    });
  },

  async freezeAccount(caseId: string, accountNumber: string, amountToFreeze?: number, notes?: string) {
    return request<InvestigationCase>(`/investigations/${caseId}/freeze-account`, {
      method: 'POST',
      body: JSON.stringify({ accountNumber, amountToFreeze, notes }),
    });
  },

  async recordSeizure(caseId: string, amountSeized: number, notes?: string) {
    return request<InvestigationCase>(`/investigations/${caseId}/seizure`, {
      method: 'POST',
      body: JSON.stringify({ amountSeized, notes }),
    });
  },

  async completeInvestigation(caseId: string) {
    return request<InvestigationCase>(`/investigations/${caseId}/complete`, {
      method: 'POST',
    });
  },

  async uploadEvidence(caseId: string, file: File, uploader: string = 'Insp. V. K. Sharma') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploader', uploader);
    return request<any>(`/investigations/${caseId}/evidence`, {
      method: 'POST',
      body: formData,
    });
  },

  // Banks & FIs
  async getBankFreezeRequests() {
    return request<InvestigationCase[]>('/banks/freeze-requests');
  },

  async updateBankFreeze(caseId: string, amountFrozen?: number, notes?: string) {
    return request<InvestigationCase>(`/banks/freeze-requests/${caseId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Frozen (Sec 102 CrPC)', amount_frozen: amountFrozen, notes }),
    });
  },

  // I4C
  async getI4COverview() {
    return request<any>('/i4c/overview');
  },

  async getI4CStateSummary() {
    return request<any[]>('/i4c/state-summary');
  },

  async getI4CCrossJurisdiction() {
    return request<any[]>('/i4c/cross-jurisdiction');
  },

  // Feedback
  async getFeedbackRecords() {
    return request<OfficerFeedbackRecord[]>('/feedback');
  },

  async submitOfficerFeedback(feedback: Omit<OfficerFeedbackRecord, 'id' | 'timestamp' | 'usedInModelTraining'>) {
    return request<OfficerFeedbackRecord>('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  },

  // Model Monitoring & Retraining
  async getModelMetrics() {
    return request<ModelMetrics>('/models/current');
  },

  async triggerModelRetraining() {
    return request<{ status: string; previousVersion: string; newVersion: string; metrics: ModelMetrics; message: string }>('/models/retrain', {
      method: 'POST',
    });
  },

  // Data Fusion
  async getDataSources() {
    return request<DataFusionSource[]>('/data-sources');
  },

  async runDataFusion() {
    return request<any>('/data-fusion/run', {
      method: 'POST',
    });
  },

  // Audit Trail
  async getAuditTrail() {
    return request<BlockchainBlock[]>('/audit');
  },

  async verifyAuditTrail() {
    return request<any>('/audit/verify');
  },

  // Global Search
  async searchGlobal(q: string) {
    return request<{
      query: string;
      totalMatches: number;
      complaints: Complaint[];
      locations: WithdrawalLocation[];
      investigations: InvestigationCase[];
    }>(`/search?q=${encodeURIComponent(q)}`);
  },
};
