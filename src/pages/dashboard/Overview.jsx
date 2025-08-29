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
  const [loading, setLoading] = useState(true);
  const { currentSession, profile, loading: sessionLoading } = useSession();

  usePageTitle("Dashboard - DuesPay");

  // Debug logging
  console.log('Overview render:', { 
    currentSession: currentSession?.id, 
    sessionTitle: currentSession?.title,
    sessionLoading,
    profileLoaded: !!profile 
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentSession?.id) {
        console.log('No current session, skipping fetch');
        setLoading(false);
        return;
      }

      console.log('Fetching transactions for session:', currentSession.id);

      try {
        const token = localStorage.getItem("access_token");
        const url = new URL(API_ENDPOINTS.GET_TRANSACTIONS);
        url.searchParams.append('session_id', currentSession.id);
        
        const res = await fetchWithTimeout(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }, 10000);
        
        const responseData = await res.json();
        const data = responseData.data;
        console.log('Transactions fetched:', data.results?.length || 0);
        setTransactions(data.results || []);
        setMeta(data.meta || {});
      } catch (err) {
        const errorInfo = handleFetchError(err);
        console.error('Failed to fetch dashboard data:', errorInfo.message);
        setTransactions([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Listen for session changes
    const handleSessionChange = () => {
      console.log('Session change event received');
      setLoading(true);
      fetchTransactions();
    };

    window.addEventListener('sessionChanged', handleSessionChange);
    return () => window.removeEventListener('sessionChanged', handleSessionChange);
  }, [currentSession?.id]);

  const getWelcomeMessage = () => {
    const adminName = profile?.admin?.first_name || 'Admin';
    const sessionInfo = currentSession ? ` - ${currentSession.title}` : '';
    return `Welcome back, ${adminName}!${sessionInfo}`;
  };

  // Don't show "No Active Session" if we're still loading the session context
  if (sessionLoading) {
    return (
      <MainLayout>
        <div className="bg-[#0F111F] min-h-screen pt-16 sm:px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading session...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentSession) {
    return (
      <MainLayout>
        <div className="bg-[#0F111F] min-h-screen pt-16 sm:px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">No Active Session</h1>
            <p className="text-gray-400 mb-6">
              Please create or select a session to view dashboard data.
            </p>
            <button
              onClick={() => window.location.href = '/dashboard/sessions/new'}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Create New Session
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

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
        
        {/* Stats */}
        <DashboardStats meta={meta} loading={loading} />
        
        {/* Responsive grid for table and chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 flex flex-col h-full">
            <RecentTransactions transactions={transactions} loading={loading} />
          </div>
          <div className="flex flex-col h-full">
            <PaymentCompletionChart transactions={transactions} loading={loading} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}