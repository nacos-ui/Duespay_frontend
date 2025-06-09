import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { API_ENDPOINTS } from "../../../apiConfig";

export default function AdminProfileCard({ data, loading, onUpdated }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(data || {}), [data]);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("access_token");
    const res = await fetch(API_ENDPOINTS.GET_ADMIN_USER, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setSaving(false);
    setEdit(false);
    onUpdated(updated);
  };

  if (loading && !data) return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] animate-pulse" />
  );

  return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] min-w-[350px] relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-purple-400"><i className="fa fa-user" /></span>
          Admin Profile
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
            <label className="text-gray-400 text-sm">Username</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.username || ""}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.email || ""}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-gray-400 text-sm">First Name</label>
              <input
                className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
                value={form.first_name || ""}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-sm">Last Name</label>
              <input
                className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
                value={form.last_name || ""}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Phone Number</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.phone_number || ""}
              onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Password</label>
            <input
              type="password"
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.password || ""}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Leave blank to keep current password"
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
            <span className="text-gray-400 text-sm">Username:</span>
            <span className="ml-2 text-white">{data?.username || "—"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Full Name:</span>
            <span className="ml-2 text-white">{(data?.first_name || "—") + " " + (data?.last_name || "")}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Email:</span>
            <span className="ml-2 text-white">{data?.email || "—"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Phone:</span>
            <span className="ml-2 text-white">{data?.phone_number || "—"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Password:</span>
            <span className="ml-2 text-white">••••••••</span>
          </div>
        </div>
      )}
    </div>
  );
}