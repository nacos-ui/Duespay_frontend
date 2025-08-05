export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading, 
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default" // "default", "danger", "success"
}) {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-purple-600 hover:bg-purple-700";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur bg-[#1e20320f]">
      <div className="bg-[#1a1d2e] border border-[#23263A] rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded transition-colors disabled:opacity-50 flex items-center gap-2 ${getButtonStyles()}`}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}