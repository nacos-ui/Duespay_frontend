// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Overview from './pages/dashboard/Overview';
import Auth from './pages/auth/auth';
import ProtectedRoute from './ProtectedRoute';
import PaymentItems from './pages/paymentItem/paymentItem';
import DuesPayPaymentFlow from './pages/reg_payment/reg_payment';
import AssociationForm from './pages/create_association/create_association';
import TransactionsPage from './pages/Transactions/TransactionsPage';
import PayersPage from './pages/Payers/PayersPage';
import SettingsPage from './pages/Settings/SettingsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/dashboard/overview" replace/>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/:shortName" element={<DuesPayPaymentFlow />} />
        <Route path="/dashboard/overview" element={
          <ProtectedRoute><Overview /></ProtectedRoute>
          } />
        <Route path="/dashboard/payment-items" element={
          <ProtectedRoute><PaymentItems /></ProtectedRoute>
          } />
        <Route path="/dashboard/transactions" element={
          <ProtectedRoute><TransactionsPage /></ProtectedRoute>
          } />
        <Route path="/create-association" element={
          <ProtectedRoute><AssociationForm /></ProtectedRoute>
          } />
        <Route path="/dashboard/students" element={
          <ProtectedRoute><PayersPage /></ProtectedRoute>
          } />
        <Route path="/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
