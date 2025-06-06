export default function PaymentCompletionChart({ transactions = [], loading }) {
  // Group transactions by day of week
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayData = Array(7).fill(0);
  transactions.forEach(tx => {
    const day = new Date(tx.submitted_at).getDay();
    dayData[day]++;
  });

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Payment Completion</h2>
      <div className="flex items-end gap-2 h-32">
        {days.map((label, idx) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className="w-4 rounded-t bg-purple-700 mb-1"
              style={{ height: `${dayData[idx] * 15}px` }}
              title={`Transactions: ${dayData[idx]}`}
            />
            <span className="text-xs text-gray-400 mt-1">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Transactions per Day</span>
      </div>
    </div>
  );
}