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
import NotFoundPage from './pages/404_page';
import { extractShortName } from './utils/getShortname';
import ReceiptPage from './pages/receipt/receipt';

function App() {
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  const pathShortName = pathParts[0] || null;
  const host = window.location.hostname;
  const hostParts = host.split('.');

  // Get shortname from subdomain or path
  const subdomainShortName =
    (hostParts.length === 2 && hostParts[1] === 'localhost') ||
    (hostParts.length === 3 && hostParts[1] + '.' + hostParts[2] === 'duespay.app')
      ? hostParts[0]
      : null;

  const shortName = extractShortName({ pathShortName });

  // If subdomain is www or empty, treat as home (not a payment flow)
  if (subdomainShortName === 'www' || subdomainShortName === '') {
    // Continue to normal routing (not payment flow)
  } else if (subdomainShortName && pathParts.length > 0) {
    // If both subdomain and path are present (except www), show 404
    return <NotFoundPage message="Requested URL not found on this server." />;
  } else if (subdomainShortName) {
    // Only subdomain present, show payment flow
    return (
      <ErrorBoundaryWithModal>
        <DuesPayPaymentFlow shortName={shortName} />
      </ErrorBoundaryWithModal>
    );
  }

  // Otherwise, use router for normal routes
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="/auth" element={
          <ErrorBoundaryWithModal>
            <ThemeProvider>
              <Auth />
            </ThemeProvider>
          </ErrorBoundaryWithModal>
        } />
        <Route path="/reset-password" element={
          <ErrorBoundaryWithModal>
            <PasswordResetConfirm />
          </ErrorBoundaryWithModal>
        } />
        <Route path="/transactions/receipt/:receipt_id" element={
          <ErrorBoundaryWithModal>
            <ReceiptPage />
          </ErrorBoundaryWithModal>
        } />
        <Route path="/:shortName" element={
          <ErrorBoundaryWithModal>
            <DuesPayPaymentFlow />
          </ErrorBoundaryWithModal>
        } />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/overview" element={
            <ErrorBoundaryWithModal>
              <ThemeProvider>
                <Overview />
              </ThemeProvider>
            </ErrorBoundaryWithModal>
          } />
          <Route path="/dashboard/payment-items" element={
            <ErrorBoundaryWithModal>
              <ThemeProvider>
                <PaymentItems />
              </ThemeProvider>
            </ErrorBoundaryWithModal>
          } />
          <Route path="/dashboard/transactions" element={
            <ErrorBoundaryWithModal>
              <ThemeProvider>
                <TransactionsPage />
              </ThemeProvider>
            </ErrorBoundaryWithModal>
          } />
          <Route path="/create-association" element={
            <ErrorBoundaryWithModal>
              <ThemeProvider>
                <AssociationForm />
              </ThemeProvider>
            </ErrorBoundaryWithModal>
          } />
          <Route path="/dashboard/students" element={
            <ErrorBoundaryWithModal>
              <ThemeProvider>
                <PayersPage />
              </ThemeProvider>
            </ErrorBoundaryWithModal>
          } />
          <Route path="/settings" element={
            <ErrorBoundaryWithModal>
              <ThemeProvider>
                <SettingsPage />
              </ThemeProvider>
            </ErrorBoundaryWithModal>
          } />
        </Route>
        {/* Catch-all 404 for unregistered routes */}
        <Route path="*" element={
          <ErrorBoundaryWithModal>
            <NotFoundPage />
          </ErrorBoundaryWithModal>
        } />
      </Routes>
    </Router>
  );
}

export default App;