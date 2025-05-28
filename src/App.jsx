// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import Auth from './pages/auth/auth';
import ProtectedRoute from './ProtectedRoute';
import PaymentItems from './pages/paymentItem/paymentItem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
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
