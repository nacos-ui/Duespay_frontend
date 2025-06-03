// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import Auth from './pages/auth/auth';
import ProtectedRoute from './ProtectedRoute';
import PaymentItems from './pages/paymentItem/paymentItem';
import DuesPayPaymentFlow from './pages/reg_payment/reg_payment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/auth" replace/>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/:shortName" element={<DuesPayPaymentFlow />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
        <Route path="/dashboard/payment-items" element={
          <ProtectedRoute><PaymentItems /></ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
