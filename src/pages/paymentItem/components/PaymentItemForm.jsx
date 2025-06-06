import { X } from "lucide-react";
import { useEffect, useState } from "react";
import StatusMessage from "../../../appComponents/StatusMessage";
import SubmitButton from "../../../appComponents/SubmitButton";

const PaymentItemForm = ({ initial, onClose, onSubmit, loading, success, error }) => {
  const [form, setForm] = useState(
    initial || {
      title: "",
      amount: "",
      status: "compulsory",
      is_active: true,
    }
  );
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setForm(
      initial || {
        title: "",
        amount: "",
        status: "compulsory",
        is_active: true,
      }
    );
    setLocalError("");
  }, [initial, loading]);

  useEffect(() => {
    if (localError || success || error) {
      const timer = setTimeout(() => {
        setLocalError("");
        if (typeof onClose === "function" && (success || error)) {
          onClose();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [localError, success, error, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!form.title || !form.amount) {
      setLocalError("Title and amount are required.");
      return;
    }
    if (isNaN(Number(form.amount))) {
      setLocalError("Amount must be a number.");
      return;
    }
    await onSubmit(form, setLocalError);
  };

  return (
    <div className="fixed inset-0 bg-[#0f111fbe] z-50 flex items-center justify-center backdrop-blur-lg">
      <div className="bg-[#181B2A] border border-[#23263A] rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
          onClick={onClose}
          type="button"
        >
          <X />
        </button>
        <h2 className="text-xl font-bold text-white mb-6">
          {initial ? "Edit Payment Item" : "Add Payment Item"}
        </h2>
        {localError && <StatusMessage type="error">{localError}</StatusMessage>}
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {success && <StatusMessage type="success">{success}</StatusMessage>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#23263A] border border-[#23263A] rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Payment item title"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Amount</label>
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#23263A] border border-[#23263A] rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Amount"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#23263A] border border-[#23263A] rounded text-white focus:outline-none focus:border-purple-500"
              required
              disabled={loading}
            >
              <option value="compulsory">Compulsory</option>
              <option value="optional">Optional</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              id="is_active"
              className="accent-purple-600"
              disabled={loading}
            />
            <label htmlFor="is_active" className="text-gray-300 text-sm">
              Active
            </label>
          </div>
          <SubmitButton loading={loading} loadingText={initial ? "Updating..." : "Adding..."}>
            {initial ? "Update Item" : "Add Item"}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default PaymentItemForm;