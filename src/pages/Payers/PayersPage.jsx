import { useEffect, useState } from "react";
import MainLayout from "../../layouts/mainLayout";
import PayersTable from "./components/PayersTable";
import PayerDetailsModal from "./components/PayerDetailsModal"; 
import PayerTransactionsModal from "./components/PayerTransactionsModal";
import TransactionDetailsModal from "../Transactions/components/TransactionDetailsModal";
import Pagination from "../Transactions/components/Pagination";
import { API_ENDPOINTS } from "../../apiConfig";  

export default function PayersPage() {
  const [payers, setPayers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");

  // Modals
  const [selectedPayer, setSelectedPayer] = useState(null);
  const [showPayerDetails, setShowPayerDetails] = useState(false);
  const [showPayerTransactions, setShowPayerTransactions] = useState(false);
  const [selectedMatric, setSelectedMatric] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch payers
  const fetchPayers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (faculty) params.append("faculty", faculty);
      if (department) params.append("department", department);
      params.append("page", page);

      const res = await fetch(`${API_ENDPOINTS.CREATE_PAYER}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPayers(data.results || []);
      setCount(data.count || 0);
    } catch {
      setPayers([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayers();
    // eslint-disable-next-line
  }, [page, search, faculty, department]);

  return (
    <MainLayout>
      <div className="bg-[#0F111F] min-h-screen sm:pt-16 pt-16 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Payers List</h1>
          <p className="text-gray-400">A list of all students who have submitted payment proofs.</p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Search by name, matric number, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded w-64 focus:outline-none"
          />
          <input
            type="text"
            placeholder="All Faculties"
            value={faculty}
            onChange={e => setFaculty(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="All Departments"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded"
          />
        </div>
        <PayersTable
          payers={payers}
          loading={loading}
          onViewDetails={payer => {
            setSelectedPayer(payer);
            setShowPayerDetails(true);
          }}
        />
        <Pagination
          count={count}
          page={page}
          setPage={setPage}
          pageSize={7}
        />
        {showPayerDetails && selectedPayer && (
          <PayerDetailsModal
            payer={selectedPayer}
            onClose={() => setShowPayerDetails(false)}
            onViewTransactions={payer => {
              setSelectedMatric(payer.matric_number);
              setShowPayerTransactions(true);
            }}
          />
        )}
        {showPayerTransactions && selectedMatric && (
          <PayerTransactionsModal
            matricNumber={selectedMatric}
            onClose={() => setShowPayerTransactions(false)}
            onViewTransaction={tx => setSelectedTransaction(tx)}
          />
        )}
        {selectedTransaction && (
          <TransactionDetailsModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}