export default function RecentTransactions() {
  // Dummy data, replace with real data as needed
  const transactions = [
    {
      name: "John Doe",
      ref: "PAY-2023-001",
      amount: "₦50,000",
      status: "Completed",
      date: "2025-05-19"
    },
    {
      name: "Jane Smith",
      ref: "PAY-2023-002",
      amount: "₦35,000",
      status: "Pending",
      date: "2025-05-19"
    },
    {
      name: "Jane Smith",
      ref: "PAY-2023-002",
      amount: "₦35,000",
      status: "Pending",
      date: "2025-05-19"
    },
    {
      name: "Jane Smith",
      ref: "PAY-2023-002",
      amount: "₦35,000",
      status: "Pending",
      date: "2025-05-19"
    },
    {
      name: "Jane Smith",
      ref: "PAY-2023-002",
      amount: "₦35,000",
      status: "Pending",
      date: "2025-05-19"
    },
    {
      name: "Jane Smith",
      ref: "PAY-2023-002",
      amount: "₦35,000",
      status: "Pending",
      date: "2025-05-19"
    },
    {
      name: "Jane Smith",
      ref: "PAY-2023-002",
      amount: "₦35,000",
      status: "Pending",
      date: "2025-05-19"
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="py-2">Student/Reference</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} className="border-t border-gray-800">
                <td className="py-2">
                  <div className="font-medium text-white">{tx.name}</div>
                  <div className="text-xs text-gray-400">{tx.ref}</div>
                </td>
                <td className="py-2 text-white">{tx.amount}</td>
                <td className="py-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tx.status === "Completed"
                      ? "bg-green-800 text-green-300"
                      : "bg-yellow-800 text-yellow-300"
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-2 text-gray-300">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}