import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Inventory from './pages/inventory';
import POS from './pages/pos';
import Orders from './pages/orders';
import UserManagement from './pages/users';
import SalesAnalytics from './pages/sales';
import Reports from './pages/reports';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Admin-only routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute role="admin">
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute role="admin">
              <Layout><Inventory /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/sales" element={
            <ProtectedRoute role="admin">
              <Layout><SalesAnalytics /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute role="admin">
              <Layout><Orders /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute role="admin">
              <Layout><UserManagement /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute role="admin">
              <Layout><Reports /></Layout>
            </ProtectedRoute>
          } />

          {/* Cashier-accessible routes */}
          <Route path="/pos" element={
            <ProtectedRoute>
              <Layout><POS /></Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
