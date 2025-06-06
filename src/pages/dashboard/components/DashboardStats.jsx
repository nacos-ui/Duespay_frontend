import { CheckCircle, Clock, DollarSign } from "lucide-react";

export default function DashboardStats({ meta, loading }) {
  const stats = [
    {
      label: "Total Collections",
      value: loading ? "..." : `₦${meta?.total_collections?.toLocaleString() || "0"}`,
      icon: <DollarSign className="text-purple-400" />,
      info: loading ? "" : meta?.percent_collections || "",
      infoColor: "text-green-400"
    },
    {
      label: "Completed Payments",
      value: loading ? "..." : meta?.completed_payments ?? "0",
      icon: <CheckCircle className="text-purple-400" />,
      info: loading ? "" : meta?.percent_completed || "",
      infoColor: "text-green-400"
    },
    {
      label: "Pending Payments",
      value: loading ? "..." : meta?.pending_payments ?? "0",
      icon: <Clock className="text-purple-400" />,
      info: loading ? "" : meta?.percent_pending || "",
      infoColor: "text-red-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-gray-900 rounded-xl p-6 flex flex-col gap-2 shadow">
          <div className="flex items-center gap-2">
            {stat.icon}
            <span className="text-gray-300 text-sm">{stat.label}</span>
          </div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className={`text-xs ${stat.infoColor}`}>{stat.info}</div>
        </div>
      ))}
    </div>
  );
}