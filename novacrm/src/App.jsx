import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import DashboardPage from './pages/Dashboard.jsx';
import LoginPage from './pages/Login.jsx';
import LeadsPage from './pages/Leads.jsx';
import TasksPage from './pages/Tasks.jsx';
import ExecutiveDashboardPage from './pages/ExecutiveDashboard.jsx';
import CustomersPage from './pages/Customers.jsx';
import DealsPage from './pages/Deals.jsx';
import ReportsPage from './pages/Reports.jsx';
import SettingsPage from './pages/Settings.jsx';
import CustomerDetailPage from './pages/CustomerDetail.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/executive" element={<ExecutiveDashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
