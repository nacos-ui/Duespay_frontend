export default function PaymentCompletionChart() {
  // Dummy data for chart
  const data = [
    { label: "Mon", transactions: 120, revenue: 80 },
    { label: "Tue", transactions: 150, revenue: 100 },
    { label: "Wed", transactions: 200, revenue: 120 },
    { label: "Thu", transactions: 250, revenue: 180 },
    { label: "Fri", transactions: 300, revenue: 220 },
    { label: "Sat", transactions: 350, revenue: 270 },
    { label: "Sun", transactions: 320, revenue: 250 }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Payment Completion</h2>
      <div className="flex items-end gap-2 h-32">
        {data.map((d, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div
              className="w-4 rounded-t bg-purple-700 mb-1"
              style={{ height: `${d.transactions / 4}px` }}
              title={`Transactions: ${d.transactions}`}
            />
            <div
              className="w-4 rounded-t bg-purple-400 opacity-60"
              style={{ height: `${d.revenue / 4}px` }}
              title={`Revenue: ${d.revenue}`}
            />
            <span className="text-xs text-gray-400 mt-1">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Transactions</span>
        <span>Revenue</span>
      </div>
    </div>
  );
}