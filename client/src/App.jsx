import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
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
import RegisterUserPage from './pages/RegisterUser.jsx';
import TeamsPage from './pages/Teams.jsx';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/leads" element={<PrivateRoute><LeadsPage /></PrivateRoute>} />
          <Route path="/deals" element={<PrivateRoute><DealsPage /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TasksPage /></PrivateRoute>} />
          <Route path="/executive" element={<PrivateRoute><ExecutiveDashboardPage /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
          <Route path="/customers/:id" element={<PrivateRoute><CustomerDetailPage /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/register-user" element={<PrivateRoute><RegisterUserPage /></PrivateRoute>} />
          <Route path="/teams" element={<PrivateRoute><TeamsPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
