import { Edit } from "lucide-react";

export default function PaymentItemCard({
  title,
  amount,
  status,
  is_active,
  created_at,
  onEdit,
  compulsory_for,
}) {
  const formattedDate = new Date(created_at).toLocaleTimeString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  
  return (
    <div className={`bg-gray-900 rounded-lg p-5 shadow-md min-w-[200px] relative transition-opacity ${!is_active ? 'opacity-50' : ''}`}>
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
      
      {/* Show compulsory levels only if status is compulsory */}
      {status === "compulsory" && compulsory_for && compulsory_for.length > 0 && (
        <div className="mt-3 mb-3">
          <p className="text-xs text-gray-400 mb-1">Compulsory for:</p>
          <div className="flex flex-wrap gap-1">
            {compulsory_for.includes("All Levels") ? (
              <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded">
                All Levels
              </span>
            ) : (
              compulsory_for.map((level) => (
                <span key={level} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                  {level} Level
                </span>
              ))
            )}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-400 mb-4">Created on {formattedDate}</div>
      <div className="flex justify-end">
        <button className="text-blue-400 hover:text-blue-600" onClick={onEdit}>
          <Edit size={16} />
        </button>
      </div>
    </div>
  );
}