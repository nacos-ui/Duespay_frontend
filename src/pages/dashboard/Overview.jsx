import { useEffect, useState } from "react";
import MainLayout from "../../layouts/mainLayout";
import DashboardStats from "./components/DashboardStats";
import RecentTransactions from "./components/RecentTransactions";
import PaymentCompletionChart from "./components/PaymentCompletionChart";
import { API_ENDPOINTS } from "../../apiConfig";
import { usePageTitle } from "../../hooks/usePageTitle";
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils';
import { useSession } from "../../contexts/SessionContext";

export default function Overview() {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [dataInitialized, setDataInitialized] = useState(false);
  
  const { 
    currentSession, 
    profile, 
    loading: sessionLoading, 
    initialized: sessionInitialized 
  } = useSession();

  usePageTitle("Dashboard - DuesPay");

  // Debug logging
  console.log('Overview render:', { 
    currentSession: currentSession?.id, 
    sessionTitle: currentSession?.title,
    sessionLoading,
    sessionInitialized,
    dashboardLoading,
    dataInitialized,
    profileLoaded: !!profile 
  });

  // Reset dashboard data when session changes
  useEffect(() => {
    if (currentSession?.id) {
      setDataInitialized(false);
      setTransactions([]);
      setMeta(null);
      setDashboardError(null);
    }
  }, [currentSession?.id]);

  useEffect(() => {
    const fetchTransactions = async () => {
      // Only fetch if we have a session and SessionContext is fully initialized
      if (!sessionInitialized || !currentSession?.id) {
        console.log('Session not ready or no current session:', { 
          sessionInitialized, 
          currentSessionId: currentSession?.id 
        });
        return;
      }

      // Avoid duplicate fetches
      if (dataInitialized && !dashboardLoading) {
        console.log('Data already initialized, skipping fetch');
        return;
      }

      console.log('Fetching dashboard data for session:', currentSession.id);
      setDashboardLoading(true);
      setDashboardError(null);

      try {
        // const token = localStorage.getItem("access_token");
        
        // if (!token) {
        //   throw new Error('No authentication token');
        // }

        const url = new URL(API_ENDPOINTS.GET_TRANSACTIONS);
        url.searchParams.append('session_id', currentSession.id);

        const res = await fetchWithTimeout(url.toString(), {}, 20000); // Increased timeout to 20 seconds

        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        
        const responseData = await res.json();
        const data = responseData.data;
        
        console.log('Dashboard data fetched successfully:', {
          transactionsCount: data.results?.length || 0,
          meta: data.meta
        });
        
        setTransactions(data.results || []);
        setMeta(data.meta || {});
        setDataInitialized(true);
        setDashboardError(null);
        
      } catch (err) {
        const errorInfo = handleFetchError(err);
        console.error('Failed to fetch dashboard data:', errorInfo.message);
        setDashboardError(errorInfo.message);
        setTransactions([]);
        setMeta({});
        setDataInitialized(true); // Mark as initialized even on error to stop loading
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchTransactions();

    // Listen for session changes
    const handleSessionChange = () => {
      console.log('Session change event received, refreshing dashboard');
      setDataInitialized(false);
      setDashboardLoading(true);
      // Small delay to ensure session context is updated
      setTimeout(() => {
        fetchTransactions();
      }, 100);
    };

    window.addEventListener('sessionChanged', handleSessionChange);
    return () => window.removeEventListener('sessionChanged', handleSessionChange);
  }, [currentSession?.id, sessionInitialized, dataInitialized]);

  const getWelcomeMessage = () => {
    const adminName = profile?.first_name || profile?.admin?.first_name || 'Admin';
    const sessionInfo = currentSession ? ` - ${currentSession.title}` : '';
    return `Welcome back, ${adminName}!${sessionInfo}`;
  };

  // 🔥 IMPROVED LOADING STATES
  
  // Show loading spinner while SessionContext is initializing
  if (!sessionInitialized || sessionLoading) {
    return (
      <MainLayout>
        <div className="bg-[#0F111F] min-h-screen pt-16 sm:px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading session data...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your session information</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show "No Session" only after SessionContext is fully loaded and there's actually no session
  if (sessionInitialized && !sessionLoading && !currentSession) {
    return (
      <MainLayout>
        <div className="bg-[#0F111F] min-h-screen pt-16 sm:px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-calendar-times text-purple-400 text-2xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">No Active Session</h1>
              <p className="text-gray-400 mb-6 max-w-md">
                You don't have any active sessions yet. Create a new session to start managing payments and collections.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard/sessions/new'}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                <i className="fas fa-plus mr-2"></i>
                Create New Session
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show loading for dashboard data (when we have session but data is still loading)
  if (currentSession && (dashboardLoading || !dataInitialized)) {
    return (
      <MainLayout>
        <div className="bg-[#0F111F] min-h-screen pt-16 sm:px-4">
          {/* Header with session info */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              {getWelcomeMessage()}
            </h1>
            <p className="text-gray-400">
              Monitor and manage university payment collections
            </p>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-900/20 text-purple-300">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Current Session: {currentSession.title}
            </div>
          </div>

          {/* Loading content */}
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading dashboard data...</p>
              <p className="text-gray-500 text-sm mt-2">Fetching transactions and analytics for {currentSession.title}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state if data fetch failed
  if (dashboardError && dataInitialized) {
    return (
      <MainLayout>
        <div className="bg-[#0F111F] min-h-screen pt-16 sm:px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              {getWelcomeMessage()}
            </h1>
            <p className="text-gray-400">Monitor and manage university payment collections</p>
          </div>

          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Failed to Load Dashboard</h2>
              <p className="text-gray-400 mb-6 max-w-md">{dashboardError}</p>
              <button
                onClick={() => {
                  setDataInitialized(false);
                  setDashboardLoading(true);
                  setDashboardError(null);
                }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                <i className="fas fa-redo mr-2"></i>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // MAIN DASHBOARD VIEW - Only show when everything is loaded
  return (
    <MainLayout>
      <div className="bg-[#0F111F] min-h-screen pt-16 sm:px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            {getWelcomeMessage()}
          </h1>
          <p className="text-gray-400">
            Monitor and manage university payment collections
          </p>
          {currentSession && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-900/20 text-purple-300">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Current Session: {currentSession.title}
            </div>
          )}
        </div>
        
        {/* Stats - Pass actual loading state (false since we're only showing when data is ready) */}
        <DashboardStats meta={meta} loading={false} />
        
        {/* Responsive grid for table and chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 flex flex-col h-full">
            <RecentTransactions transactions={transactions} loading={false} />
          </div>
          <div className="flex flex-col h-full">
            <PaymentCompletionChart transactions={transactions} loading={false} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}