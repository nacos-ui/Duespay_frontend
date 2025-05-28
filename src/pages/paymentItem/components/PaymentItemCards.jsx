import { Edit, Trash2 } from "lucide-react";

export default function PaymentItemCard({
  title,
  amount,
  status,
  is_active,
  created_at,
}) {
  const formattedDate = new Date(created_at).toLocaleTimeString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return (
    <div className="bg-gray-900 rounded-lg p-5 shadow-md relative">
      <input type="checkbox" className="absolute top-4 right-4 accent-purple-600" />
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span className={`text-xl font-bold ${!is_active ? "text-gray-400" : "text-purple-400"}`}>
          ₦{Number(amount).toLocaleString()}
        </span>
      </div>
      <div className="flex gap-2 mb-1">
        <span className={`px-2 py-1 rounded-2xl text-xs font-semibold ${is_active ? "bg-green-700 text-green-200" : "bg-yellow-700 text-yellow-200"}`}>
          {is_active ? "Active" : "Inactive"}
        </span>
        <span className={`px-2 py-1 rounded-2xl text-xs font-semibold ${status === "compulsory" ? "bg-blue-700 text-blue-200" : "bg-purple-700 text-purple-200"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="text-xs text-gray-400 mb-4">Created on {formattedDate}</div>
      <div className="flex gap-3 justify-end">
        <button className="text-blue-400 hover:text-blue-600">
          <Edit size={16} />
        </button>
        <button className="text-red-400 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}