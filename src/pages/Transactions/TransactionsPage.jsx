import { useEffect, useState } from "react";
import MainLayout from "../../layouts/mainLayout";
import TransactionsTable from "./components/TransactionsTable";
import TransactionDetailsModal from "./components/TransactionDetailsModal";
import Pagination from "./components/Pagination";
import { API_ENDPOINTS } from "../../apiConfig";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      // Add query params for filters
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (type) params.append("type", type);
      params.append("page", page);

      const res = await fetch(`${API_ENDPOINTS.GET_TRANSACTIONS}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setTransactions(data.results || []);
      setCount(data.count || 0);
    } catch {
      setTransactions([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
    // eslint-disable-next-line
  }, [page, search, status, type]);

  return (
    <MainLayout>
      <div className="bg-[#0F111F] min-h-screen pt-16 sm:p-6 sm:pt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Transactions</h1>
          <p className="text-gray-400">A list of all transactions and payment proofs.</p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Search by name, reference, etc..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded w-64 focus:outline-none"
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded"
          >
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded"
          >
            <option value="">All Types</option>
            <option value="compulsory">Compulsory</option>
            <option value="optional">Optional</option>
          </select>
          <button className="flex items-center gap-2 bg-[#23263A] text-white px-4 py-2 rounded">
            Export
          </button>
        </div>
        <TransactionsTable
          transactions={transactions}
          loading={loading}
          onViewDetails={setSelected}
        />
        <Pagination
          count={count}
          page={page}
          setPage={setPage}
          pageSize={7}
        />
        {selected && (
          <TransactionDetailsModal
            transaction={selected}
            onClose={() => setSelected(null)}
            onStatusChange={() => fetchTransactions(page)}
            />
        )}
      </div>
    </MainLayout>
  );
}