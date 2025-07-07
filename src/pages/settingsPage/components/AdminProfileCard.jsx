import { useState, useEffect } from "react";
import { Edit, Eye, EyeOff } from "lucide-react";
import { API_ENDPOINTS } from "../../../apiConfig";
import StatusMessage from "../../../appComponents/StatusMessage";

export default function AdminProfileCard({ data, loading, onUpdated }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    new_password: "",
    confirm_password: ""
  });

  useEffect(() => setForm(data || {}), [data]);

  // Auto-clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem("access_token");
    
    // Prepare data to send
    const updateData = { ...form };
    
    // Check password fields
    if (passwordData.new_password || passwordData.confirm_password) {
      if (!passwordData.new_password) {
        setMessage({ type: 'error', text: 'Please enter a new password.' });
        setSaving(false);
        return;
      }
      if (!passwordData.confirm_password) {
        setMessage({ type: 'error', text: 'Please confirm your new password.' });
        setSaving(false);
        return;
      }
      if (passwordData.new_password !== passwordData.confirm_password) {
        setMessage({ type: 'error', text: "Passwords don't match!" });
        setSaving(false);
        return;
      }
      updateData.password = passwordData.new_password;
    }

    try {
      const res = await fetch(API_ENDPOINTS.GET_ADMIN_USER, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData),
      });
      
      if (res.ok) {
        const updated = await res.json();
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setSaving(false);
        setEdit(false);
        setPasswordData({ new_password: "", confirm_password: "" });
        onUpdated(updated);
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.message || 'Update failed' });
        setSaving(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading && !data) return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] animate-pulse" />
  );

  return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] min-w-auto flex-wrap wrap-break-word relative">
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
          {message.text && (
            <StatusMessage type={message.type}>
              {message.text}
            </StatusMessage>
          )}
          
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
          
          {/* Password Change Section */}
          <div>
            <label className="text-gray-400 text-sm">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                className="w-full bg-[#23263A] text-white rounded px-3 py-2 pr-10 mt-1"
                value={passwordData.new_password}
                onChange={e => setPasswordData(p => ({ ...p, new_password: e.target.value }))}
                placeholder="Enter new password (optional)"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                className="w-full bg-[#23263A] text-white rounded px-3 py-2 pr-10 mt-1"
                value={passwordData.confirm_password}
                onChange={e => setPasswordData(p => ({ ...p, confirm_password: e.target.value }))}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
              onClick={() => {
                setEdit(false);
                setPasswordData({ new_password: "", confirm_password: "" });
                setMessage({ type: '', text: '' });
              }}
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
        </div>
      )}
    </div>
  );
}