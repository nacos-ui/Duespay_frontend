import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { API_ENDPOINTS } from "../../../apiConfig";

export default function BankInfoCard({ data, loading, onUpdated }) {
  // Extract the first result or null
  const bank = data?.results?.[0] || null;

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(bank || {});
  const [saving, setSaving] = useState(false);

  // Keep form in sync with latest bank info
  useEffect(() => setForm(bank || {}), [bank]);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("access_token");
    const method = bank && bank.id ? "PATCH" : "POST";
    const url = bank && bank.id
      ? API_ENDPOINTS.UPDATE_DETAIL_BANK_ACCOUNT(bank.id)
      : API_ENDPOINTS.GET_CREATE_BANK_ACCOUNT;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    // Expect the API to return the new/updated object (not the full list)
    const updated = await res.json();
    setSaving(false);
    setEdit(false);
    // Wrap in results array to keep parent logic consistent
    onUpdated({ results: [updated] });
  };

  if (loading && !bank) return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] animate-pulse" />
  );

  return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] min-w-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-purple-400"><i className="fa fa-bank" /></span>
          Bank Information
        </h2>
        {!edit && (
          <button className="text-purple-400" onClick={() => setEdit(true)}>
            <Edit size={18} />
          </button>
        )}
      </div>
      {edit ? (
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm">Bank Name</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.bank_name || ""}
              onChange={e => setForm(f => ({ ...f, bank_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Account Name</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.account_name || ""}
              onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Account Number</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.account_number || ""}
              onChange={e => setForm(f => ({ ...f, account_number: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded"
              onClick={() => setEdit(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <span className="text-gray-400 text-sm">Bank Name:</span>
            <span className="ml-2 text-white">{bank?.bank_name || "—"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Account Name:</span>
            <span className="ml-2 text-white">{bank?.account_name || "—"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Account Number:</span>
            <span className="ml-2 text-white">{bank?.account_number ? `••••${bank.account_number.slice(-4)}` : "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
}