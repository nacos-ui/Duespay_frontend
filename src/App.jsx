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
import PasswordResetConfirm from './pages/auth/passwordResetConfirm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="/auth" element={
          <ThemeProvider>
            <Auth />
          </ThemeProvider>
        } />
        <Route path="/reset-password" element={<PasswordResetConfirm />} />
        <Route path="/:shortName" element={
          <ErrorBoundaryWithModal>
            <DuesPayPaymentFlow />
          </ErrorBoundaryWithModal>
        } />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/overview" element={
            <ThemeProvider>
              <Overview />
            </ThemeProvider>
          } />
          <Route path="/dashboard/payment-items" element={
            <ThemeProvider>
              <PaymentItems />
            </ThemeProvider>
          } />
          <Route path="/dashboard/transactions" element={
            <ThemeProvider>
              <TransactionsPage />
            </ThemeProvider>
          } />
          <Route path="/create-association" element={
            <ThemeProvider>
              <AssociationForm />
            </ThemeProvider>
          } />
          <Route path="/dashboard/students" element={
            <ThemeProvider>
              <PayersPage />
            </ThemeProvider>
          } />
          <Route path="/settings" element={
            <ThemeProvider>
              <SettingsPage />
            </ThemeProvider>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;