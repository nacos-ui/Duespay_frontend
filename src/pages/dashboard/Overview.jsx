import { useEffect, useState } from "react";
import MainLayout from "../../layouts/mainLayout";
import DashboardStats from "./components/DashboardStats";
import RecentTransactions from "./components/RecentTransactions";
import PaymentCompletionChart from "./components/PaymentCompletionChart";
import TopDepartments from "./components/TopDepartments";
import { API_ENDPOINTS } from "../../apiConfig";

export default function Overview() {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(API_ENDPOINTS.CREATE_TRANSACTION, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        console.log("Fetched transactions:", data);
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
      <div className="bg-[#0F111F] min-h-screen pt-16 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back, Admin!</h1>
          <p className="text-gray-400">Monitor and manage university payment collections</p>
        </div>
        <DashboardStats meta={meta} loading={loading} />
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="flex-1 flex flex-col gap-6">
            <RecentTransactions transactions={transactions} loading={loading} />
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <PaymentCompletionChart transactions={transactions} loading={loading} />
            {/* <TopDepartments /> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}