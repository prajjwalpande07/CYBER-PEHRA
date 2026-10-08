import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CyberPehraProvider } from './context/CyberPehraContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { NewComplaintPage } from './pages/NewComplaintPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { RiskHeatmapPage } from './pages/RiskHeatmapPage';
import { WithdrawalLocationsPage } from './pages/WithdrawalLocationsPage';
import { LocationDetailPage } from './pages/LocationDetailPage';
import { MuleNetworkPage } from './pages/MuleNetworkPage';
import { AlertsPage } from './pages/AlertsPage';
import { InvestigationsPage } from './pages/InvestigationsPage';
import { BankPortalPage } from './pages/BankPortalPage';
import { I4CCoordinationPage } from './pages/I4CCoordinationPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { ModelMonitoringPage } from './pages/ModelMonitoringPage';
import { DataFusionPage } from './pages/DataFusionPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <CyberPehraProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Operational Command Console Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="complaints" element={<ComplaintsPage />} />
                <Route path="complaints/new" element={<NewComplaintPage />} />
                <Route path="predictions" element={<PredictionsPage />} />
                <Route path="heatmap" element={<RiskHeatmapPage />} />
                <Route path="locations" element={<WithdrawalLocationsPage />} />
                <Route path="locations/:id" element={<LocationDetailPage />} />
                <Route path="mule-network" element={<MuleNetworkPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="investigations" element={<InvestigationsPage />} />
                <Route path="bank-portal" element={<BankPortalPage />} />
                <Route path="i4c-coordination" element={<I4CCoordinationPage />} />
                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="audit-trail" element={<AuditTrailPage />} />
                <Route path="model-monitoring" element={<ModelMonitoringPage />} />
                <Route path="data-fusion" element={<DataFusionPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CyberPehraProvider>
  );
}

export default App;
