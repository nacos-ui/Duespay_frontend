import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Overview from './pages/dashboard/Overview';
import Auth from './pages/auth/auth';
import ProtectedRoute from './appComponents/ProtectedRoute';
import PaymentItems from './pages/paymentItem/paymentItem';
import DuesPayPaymentFlow from './pages/reg_payment/reg_payment';
import AssociationForm from './pages/create_association/create_association';
import TransactionsPage from './pages/Transactions/TransactionsPage';
import PayersPage from './pages/Payers/PayersPage';
import SettingsPage from './pages/settingsPage/SettingsPage';
import ErrorBoundaryWithModal from './appComponents/ErrorBoundaryWithModal';
import { ThemeProvider } from './appComponents/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/:shortName" element={
            <ErrorBoundaryWithModal>
              <DuesPayPaymentFlow />
            </ErrorBoundaryWithModal>
          } />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/overview" element={<Overview />} />
            <Route path="/dashboard/payment-items" element={<PaymentItems />} />
            <Route path="/dashboard/transactions" element={<TransactionsPage />} />
            <Route path="/create-association" element={<AssociationForm />} />
            <Route path="/dashboard/students" element={<PayersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;