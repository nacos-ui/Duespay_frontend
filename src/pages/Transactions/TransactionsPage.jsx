import { useEffect, useState } from "react";
import { Trash2, CheckCircle, X } from "lucide-react";
import MainLayout from "../../layouts/mainLayout";
import TransactionsTable from "./components/TransactionsTable";
import TransactionDetailsModal from "./components/TransactionDetailsModal";
import Pagination from "./components/Pagination";
import ConfirmationModal from "../../appComponents/ConfirmationModal";
import { API_ENDPOINTS } from "../../apiConfig";
import { usePageTitle } from "../../hooks/usePageTitle";
import { fetchWithTimeout, handleFetchError } from "../../utils/fetchUtils";
import { exportTransactions } from "../../utils/exportUtils";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Bulk actions
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkActionType, setBulkActionType] = useState(''); // 'verify', 'delete'

  usePageTitle("Transactions - DuesPay");

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (type) params.append("type", type);
      params.append("page", page);

      const res = await fetchWithTimeout(`${API_ENDPOINTS.GET_TRANSACTIONS}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }, 30000);
      
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data.results || []);
      setCount(data.count || 0);
    } catch (err) {
      const { message } = handleFetchError(err);
      console.error("Error fetching transactions:", message);
      setTransactions([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Bulk verify transactions
  const bulkVerifyTransactions = async () => {
    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      
      // Send requests for each selected transaction
      const promises = selectedTransactions.map(txId =>
        fetchWithTimeout(API_ENDPOINTS.VERIFY_EDIT_TRANSACTION(txId), {
          method: "PATCH",
          headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
          },
          body: JSON.stringify({ is_verified: true })
        }, 30000)
      );

      await Promise.all(promises);
      
      setShowBulkModal(false);
      setSelectedTransactions([]);
      fetchTransactions(page);
      
    } catch (err) {
      const { message } = handleFetchError(err);
      alert(`Bulk verify failed: ${message}`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Bulk delete transactions
  const bulkDeleteTransactions = async () => {
    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      
      // Send delete requests for each selected transaction
      const promises = selectedTransactions.map(txId =>
        fetchWithTimeout(API_ENDPOINTS.DELETE_TRANSACTION(txId), {
          method: "DELETE",
          headers: {
        "Authorization": `Bearer ${token}`
          }
        }, 30000)
      );

      await Promise.all(promises);
      
      setShowBulkModal(false);
      setSelectedTransactions([]);
      fetchTransactions(page);
      
    } catch (err) {
      const { message } = handleFetchError(err);
      alert(`Bulk delete failed: ${message}`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Handle bulk action
  const handleBulkAction = (actionType) => {
    setBulkActionType(actionType);
    setShowBulkModal(true);
  };

  // Execute bulk action
  const executeBulkAction = () => {
    if (bulkActionType === 'verify') {
      bulkVerifyTransactions();
    } else if (bulkActionType === 'delete') {
      bulkDeleteTransactions();
    }
  };

  // Handle export using utility function
  const handleExport = () => {
    exportTransactions(search, status, type, setExportLoading);
  };

  // Get bulk modal content
  const getBulkModalContent = () => {
    const count = selectedTransactions.length;
    if (bulkActionType === 'verify') {
      return {
        title: "Verify Transactions",
        message: `Are you sure you want to verify ${count} selected transaction${count > 1 ? 's' : ''}?`,
        confirmText: "Verify",
        type: "success"
      };
    } else if (bulkActionType === 'delete') {
      return {
        title: "Delete Transactions",
        message: `Are you sure you want to delete ${count} selected transaction${count > 1 ? 's' : ''}? This action cannot be undone.`,
        confirmText: "Delete",
        type: "danger"
      };
    }
    return {};
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
          <button 
            onClick={handleExport}
            disabled={exportLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            {exportLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </>
            )}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedTransactions.length > 0 && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-white font-medium">
                {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleBulkAction('verify')}
                  disabled={bulkActionLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Verify All</span>
                  <span className="sm:hidden">Verify</span>
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={bulkActionLoading}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors disabled:opacity-50 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete All</span>
                  <span className="sm:hidden">Delete</span>
                </button>
                <button
                  onClick={() => setSelectedTransactions([])}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <TransactionsTable
          transactions={transactions}
          loading={loading}
          onViewDetails={setSelected}
          selectedTransactions={selectedTransactions}
          setSelectedTransactions={setSelectedTransactions}
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

        {/* Bulk Action Confirmation Modal */}
        <ConfirmationModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onConfirm={executeBulkAction}
          loading={bulkActionLoading}
          {...getBulkModalContent()}
        />
      </div>
    </MainLayout>
  );
}