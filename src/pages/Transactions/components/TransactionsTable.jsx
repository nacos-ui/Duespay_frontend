import { useState } from "react";

export default function TransactionsTable({ 
  transactions, 
  loading, 
  onViewDetails,
  selectedTransactions,
  setSelectedTransactions
}) {
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTransactions(transactions.map(tx => tx.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleSelectTransaction = (txId, checked) => {
    if (checked) {
      setSelectedTransactions(prev => [...prev, txId]);
    } else {
      setSelectedTransactions(prev => prev.filter(id => id !== txId));
    }
  };

  const isAllSelected = transactions.length > 0 && selectedTransactions.length === transactions.length;
  const isIndeterminate = selectedTransactions.length > 0 && selectedTransactions.length < transactions.length;

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Transactions List</h2>
        {selectedTransactions.length > 0 && (
          <span className="text-sm text-gray-400">
            {selectedTransactions.length} selected
          </span>
        )}
      </div>
      
      <div className="overflow-x-auto hide-scrollbar w-full">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="py-2 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="accent-purple-600"
                />
              </th>
              <th className="py-2 min-w-[10rem]">NAME</th>
              <th className="py-2 min-w-[10rem]">REFERENCE</th>
              <th className="py-2 min-w-[12rem]">ITEMS</th>
              <th className="py-2 min-w-[8rem]">AMOUNT</th>
              <th className="py-2 min-w-[8rem]">STATUS</th>
              <th className="py-2 min-w-[10rem]">DATE</th>
              <th className="py-2 min-w-[8rem]">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-6">Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-6">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((tx, idx) => (
                <tr key={tx.id || idx} className="border-t border-gray-800">
                  <td className="py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(tx.id)}
                      onChange={(e) => handleSelectTransaction(tx.id, e.target.checked)}
                      className="accent-purple-600"
                    />
                  </td>
                  <td className="py-4 text-white font-medium min-w-[10rem]">
                    {tx.payer_name || `${tx.payer_first_name} ${tx.payer_last_name}`}
                  </td>
                  <td className="py-4 text-white min-w-[10rem]">{tx.reference_id}</td>
                  <td className="py-4 pr-3 text-white min-w-[12rem]">
                    {tx.payment_item_titles?.join(", ")}
                  </td>
                  <td className="py-4 text-white min-w-[8rem]">
                    ₦{Number(tx.amount_paid).toLocaleString()}
                  </td>
                  <td className="py-4 min-w-[8rem]">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tx.is_verified
                        ? "bg-green-800 text-green-300"
                        : "bg-yellow-800 text-yellow-300"
                    }`}>
                      {tx.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300 min-w-[10rem]">
                    <div>
                      <div>{new Date(tx.submitted_at).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(tx.submitted_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 min-w-[8rem]">
                    <button
                      className="text-purple-600 hover:underline font-semibold"
                      onClick={() => onViewDetails(tx)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}