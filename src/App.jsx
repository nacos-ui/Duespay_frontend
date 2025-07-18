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
import SETTINGS from './settings';
import { getShortNameFromUrl } from './utils/getShortname';

function App() {
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  const pathShortName = pathParts[0] || null;
  const shortName = getShortNameFromUrl(pathShortName);
  console.log('Short Name:', shortName);

  const host = window.location.hostname;
  const parts = host.split('.');

  // Subdomain detection for both localhost and production
  const isLocalhostSubdomain =
    SETTINGS.BASE_DOMAIN === 'localhost' &&
    parts.length === 2 &&
    parts[1] === 'localhost';

  const isProdSubdomain =
    SETTINGS.BASE_DOMAIN === 'duespay.app' &&
    parts.length === 3 &&
    parts[1] + '.' + parts[2] === 'duespay.app';

  const isSubdomain = isLocalhostSubdomain || isProdSubdomain;

  // If subdomain and path are both present, show custom 404
  if (isSubdomain && pathParts.length > 0) {
    return <NotFoundPage message="Requested URL not found on this server." />;
  }

  // If subdomain is present, show payment flow for that association
  if (isSubdomain) {
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
        {/* Catch-all 404 for unregistered routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;