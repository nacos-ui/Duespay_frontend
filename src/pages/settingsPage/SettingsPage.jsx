import { useEffect, useState } from "react";
import MainLayout from "../../layouts/mainLayout";
import BankInfoCard from "./components/BankInfoCard";
import AdminProfileCard from "./components/AdminProfileCard";
import AssociationInfoCard from "./components/AssociationInfoCard"

export default function SettingsPage() {
  const [bankInfo, setBankInfo] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [association, setAssociation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all settings data
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8000/bank-account/", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch("http://localhost:8000/adminuser/", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch("http://localhost:8000/association/", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([bank, admin, assoc]) => {
      setBankInfo(bank);
      setAdmin(admin);
      setAssociation(assoc);
    }).finally(() => setLoading(false));
  }, []);

  // Optionally, add update handlers for each card to refresh data after edits

  return (
    <MainLayout>
      <div className="pt-16 p-6 min-h-screen bg-[#0F111F]">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-gray-400 mb-8">Manage your account settings and preferences</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BankInfoCard
            data={bankInfo}
            loading={loading}
            onUpdated={updated => setBankInfo(updated)}
          />
          <AdminProfileCard
            data={admin}
            loading={loading}
            onUpdated={updated => setAdmin(updated)}
          />
          <AssociationInfoCard
            data={association}
            loading={loading}
            onUpdated={updated => setAssociation(updated)}
          />
        </div>
      </div>
    </MainLayout>
  );
}