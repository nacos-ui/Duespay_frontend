export default function RecentTransactions({ transactions = [], loading }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="py-2">Reference</th>
              <th className="py-2">Items</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">No transactions found.</td>
              </tr>
            ) : (
              transactions.slice(0, 7).map((tx, idx) => (
                <tr key={tx.id || idx} className="border-t border-gray-800">
                  <td className="py-2">
                    <div className="font-medium text-white">{tx.reference_id}</div>
                  </td>
                  <td className="py-2 text-white">
                    {tx.payment_item_titles?.join(", ")}
                  </td>
                  <td className="py-2 text-white">₦{Number(tx.amount_paid).toLocaleString()}</td>
                  <td className="py-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tx.is_verified
                        ? "bg-green-800 text-green-300"
                        : "bg-yellow-800 text-yellow-300"
                    }`}>
                      {tx.is_verified ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300">
                    {new Date(tx.submitted_at).toLocaleDateString()}
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