import { useEffect, useState } from "react";
import MainLayout from "../../layouts/mainLayout";
import DashboardStats from "./components/DashboardStats";
import RecentTransactions from "./components/RecentTransactions";
import PaymentCompletionChart from "./components/PaymentCompletionChart";
import TopDepartments from "./components/TopDepartments";
import { API_ENDPOINTS } from "../../apiConfig";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function Overview() {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageTitle("Dashboard - DuesPay");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(API_ENDPOINTS.GET_TRANSACTIONS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setTransactions(data.results || []);
        setMeta(data.meta || {});
      } catch (err) {
        setTransactions([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <MainLayout>
      <div className="bg-white dark:bg-[#0F111F] min-h-screen pt-16 sm:px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back, Admin!</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage university payment collections</p>
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
            {/* <TopDepartments /> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}