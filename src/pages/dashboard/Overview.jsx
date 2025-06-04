import MainLayout from "../../layouts/mainLayout";
import DashboardStats from "./components/DashboardStats";
import RecentTransactions from "./components/RecentTransactions";
import PaymentCompletionChart from "./components/PaymentCompletionChart";
import TopDepartments from "./components/TopDepartments";

export default function Overview() {
  return (
    <MainLayout>
      <div className="bg-[#0F111F] min-h-screen pt-16 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back, Admin!</h1>
          <p className="text-gray-400">Monitor and manage university payment collections</p>
        </div>
        <DashboardStats />
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="flex-1 flex flex-col gap-6">
            <RecentTransactions />
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <PaymentCompletionChart />
            {/* <TopDepartments /> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}