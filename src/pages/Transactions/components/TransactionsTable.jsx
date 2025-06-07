export default function TransactionsTable({ transactions, loading, onViewDetails }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold text-white mb-4">Transactions List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="py-2">NAME</th>
              <th className="py-2">REFERENCE</th>
              <th className="py-2">ITEMS</th>
              <th className="py-2">AMOUNT</th>
              <th className="py-2">STATUS</th>
              <th className="py-2">DATE</th>
              <th className="py-2">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6">Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((tx, idx) => (
                <tr key={tx.id || idx} className="border-t border-gray-800">
                  <td className="py-4 text-white font-medium">{tx.payer_name || `${tx.payer_first_name} ${tx.payer_last_name}`}</td>
                  <td className="py-4 text-white">{tx.reference_id}</td>
                  <td className="py-4 text-white">{tx.payment_item_titles?.join(", ")}</td>
                  <td className="py-4 text-white">₦{Number(tx.amount_paid).toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tx.is_verified
                        ? "bg-green-800 text-green-300"
                        : "bg-yellow-800 text-yellow-300"
                    }`}>
                      {tx.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300">{new Date(tx.submitted_at).toLocaleDateString()}</td>
                  <td className="py-2">
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