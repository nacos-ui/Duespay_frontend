import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";

const LEVEL_OPTIONS = [
  { value: "100", label: "100 Level" },
  { value: "200", label: "200 Level" },
  { value: "300", label: "300 Level" },
  { value: "400", label: "400 Level" },
  { value: "500", label: "500 Level" },
  { value: "600", label: "600 Level" },
  { value: "All Levels", label: "All Levels" },
];

export default function PaymentItemForm({ initial, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    status: "compulsory",
    is_active: true,
    compulsory_for: []
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        amount: initial.amount || "",
        status: initial.status || "compulsory",
        is_active: initial.is_active !== undefined ? initial.is_active : true,
        compulsory_for: initial.compulsory_for || []
      });
    }
  }, [initial]);

  const handleChange = (key, value) => {
    setForm(prev => {
      // Clear compulsory_for when changing to optional
      if (key === "status" && value === "optional") {
        return { ...prev, [key]: value, compulsory_for: [] };
      }
      return { ...prev, [key]: value };
    });
    if (formError) setFormError("");
  };

  // Handle level checkbox changes
  const handleLevelChange = (levelValue, isChecked) => {
    setForm(prev => {
      let newCompulsoryFor = [...prev.compulsory_for];
      
      if (levelValue === "All Levels") {
        // If "All Levels" is checked, select only "All Levels"
        if (isChecked) {
          newCompulsoryFor = ["All Levels"];
        } else {
          newCompulsoryFor = [];
        }
      } else {
        // If any specific level is checked/unchecked
        if (isChecked) {
          // Remove "All Levels" if present and add the specific level
          newCompulsoryFor = newCompulsoryFor.filter(level => level !== "All Levels");
          if (!newCompulsoryFor.includes(levelValue)) {
            newCompulsoryFor.push(levelValue);
          }
        } else {
          // Remove the specific level
          newCompulsoryFor = newCompulsoryFor.filter(level => level !== levelValue);
        }
      }
      
      return { ...prev, compulsory_for: newCompulsoryFor };
    });
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      return "Valid amount is required";
    }
    if (form.status === "compulsory" && form.compulsory_for.length === 0) {
      return "Please select which levels this item is compulsory for";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setFormError(error);
      return;
    }
    onSubmit(form, setFormError);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {initial ? "Edit Payment Item" : "Add Payment Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full bg-[#23263A] border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:border-purple-500"
              placeholder="Enter payment item title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (₦) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className="w-full bg-[#23263A] border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:border-purple-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full bg-[#23263A] border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            >
              <option value="compulsory">Compulsory</option>
              <option value="optional">Optional</option>
            </select>
          </div>

          {/* Show compulsory_for field only if status is compulsory */}
          {form.status === "compulsory" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Compulsory For *
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {LEVEL_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.compulsory_for.includes(option.value)}
                      onChange={(e) => handleLevelChange(option.value, e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-[#23263A] border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-gray-300 text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select "All Levels" or choose specific levels. Selecting "All Levels" will override individual selections.
              </p>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-[#23263A] border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label className="text-sm text-gray-300">Active</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {initial ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}