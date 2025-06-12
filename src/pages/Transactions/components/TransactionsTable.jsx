export default function TransactionsTable({ transactions, loading, onViewDetails }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold text-white mb-4">Transactions List</h2>
      <div className="overflow-x-auto hide-scrollbar w-full">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="text-gray-400 text-sm">
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
                <td colSpan={7} className="text-center text-gray-400 py-6">Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((tx, idx) => (
                <tr key={tx.id || idx} className="border-t border-gray-800">
                  <td className="py-4 text-white font-medium min-w-[10rem]">{tx.payer_name || `${tx.payer_first_name} ${tx.payer_last_name}`}</td>
                  <td className="py-4 text-white min-w-[10rem]">{tx.reference_id}</td>
                  <td className="py-4 pr-3 text-white min-w-[12rem]">{tx.payment_item_titles?.join(", ")}</td>
                  <td className="py-4 text-white min-w-[8rem]">₦{Number(tx.amount_paid).toLocaleString()}</td>
                  <td className="py-4 min-w-[8rem]">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tx.is_verified
                        ? "bg-green-800 text-green-300"
                        : "bg-yellow-800 text-yellow-300"
                    }`}>
                      {tx.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300 min-w-[10rem]">{new Date(tx.submitted_at).toLocaleDateString()}</td>
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