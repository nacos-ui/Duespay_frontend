import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { API_ENDPOINTS } from "../../../apiConfig";
import StatusMessage from "../../../appComponents/StatusMessage";
import SETTINGS from "../../../settings";

export default function AssociationInfoCard({ data, loading, onUpdated }) {
  const assoc = data?.results?.[0] || null;
  const domain = SETTINGS.BASE_DOMAIN;

  const initialForm = assoc
    ? {
        id: assoc.id,
        association_name: assoc.association_name || "",
        association_short_name: assoc.association_short_name || "",
        Association_type: assoc.Association_type || "",
        theme_color: assoc.theme_color || "#9810fa",
        logo: "", // for upload only
      }
    : {};

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setForm(initialForm);
    setLogoFile(null);
  }, [data]);

  // Auto-clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file.' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB.' });
        return;
      }
      
      setLogoFile(file);
      setForm(f => ({ ...f, logo: file }));
      setMessage({ type: '', text: '' }); // Clear any previous errors
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    // Validate required fields
    if (!form.association_name.trim()) {
      setMessage({ type: 'error', text: 'Association name is required.' });
      setSaving(false);
      return;
    }
    
    if (!form.association_short_name.trim()) {
      setMessage({ type: 'error', text: 'Short name is required.' });
      setSaving(false);
      return;
    }
    
    if (!form.Association_type) {
      setMessage({ type: 'error', text: 'Association type is required.' });
      setSaving(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    const method = assoc && assoc.id ? "PATCH" : "POST";
    const url = assoc && assoc.id
      ? API_ENDPOINTS.UPDATE_ASSOCIATION(assoc.id)
      : API_ENDPOINTS.CREATE_ASSOCIATION;

    let body, headers;

    try {
      if (logoFile) {
        body = new FormData();
        body.append("association_name", form.association_name);
        body.append("association_short_name", form.association_short_name);
        body.append("Association_type", form.Association_type);
        body.append("theme_color", form.theme_color);
        body.append("logo", logoFile);
        headers = { Authorization: `Bearer ${token}` };
      } else {
        body = JSON.stringify({
          association_name: form.association_name,
          association_short_name: form.association_short_name,
          Association_type: form.Association_type,
          theme_color: form.theme_color,
        });
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await fetch(url, {
        method,
        headers,
        body,
      });

      if (res.ok) {
        const updated = await res.json();
        setMessage({ type: 'success', text: 'Association info updated successfully!' });
        setSaving(false);
        setEdit(false);
        setLogoFile(null);
        onUpdated({ results: [updated] });
      } else {
        const error = await res.json();
        setMessage({ 
          type: 'error', 
          text: error.message || error.detail || 'Failed to update association info.' 
        });
        setSaving(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred. Please try again.' });
      setSaving(false);
    }
  };

  if (loading && !assoc) return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] animate-pulse" />
  );

  // Use logoFile for preview if uploading, else use logo_url from backend
  const logoUrl = logoFile
    ? URL.createObjectURL(logoFile)
    : assoc?.logo_url || null;

  return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] min-w-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-purple-400">
            <i className="fa fa-building" />
          </span>
          Association Info
        </h2>
        {!edit && (
          <button 
            className="text-purple-400 hover:text-purple-300 transition-colors"
            onClick={() => setEdit(true)}
          >
            <Edit size={18} />
          </button>
        )}
      </div>
      {/* Show message regardless of edit state */}
      {message.text && (
        <StatusMessage type={message.type}>
          {message.text}
        </StatusMessage>
      )}
      {edit ? (
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-sm">Logo</label>
            <div className="flex items-center gap-3 mt-1">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo Preview"
                  className="w-12 h-12 rounded bg-[#23263A] object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Theme Color</label>
            <div className="flex items-center gap-3 mt-1">
              <div className="relative flex-1">
                <input
                  type="color"
                  value={form.theme_color || "#9810fa"}
                  onChange={e => setForm(f => ({ ...f, theme_color: e.target.value }))}
                  className="w-full h-12 bg-[#23263A] border border-gray-600 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-12 h-12 rounded border border-gray-600 shadow-lg"
                  style={{ backgroundColor: form.theme_color || "#9810fa" }}
                ></div>
                <input
                  type="text"
                  value={form.theme_color || "#9810fa"}
                  onChange={e => setForm(f => ({ ...f, theme_color: e.target.value }))}
                  className="w-24 px-3 py-3 bg-[#23263A] border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Association Name</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.association_name || ""}
              onChange={e => setForm(f => ({ ...f, association_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Short Name</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.association_short_name || ""}
              onChange={e => setForm(f => ({ ...f, association_short_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Association Type</label>
            <select
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 mt-1"
              value={form.Association_type || ""}
              onChange={e => setForm(f => ({ ...f, Association_type: e.target.value }))}
            >
              <option value="">Select Type</option>
              <option value="hall">Hall</option>
              <option value="department">Department</option>
              <option value="faculty">Faculty</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded"
              onClick={() => {
                setEdit(false);
                setLogoFile(null);
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
            <span className="text-gray-400 text-sm">Logo:</span>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-12 h-12 rounded bg-[#23263A] object-cover inline-block ml-2"
              />
            ) : (
              <span className="ml-2 text-white">—</span>
            )}
          </div>
          <div>
            <span className="text-gray-400 text-sm">Theme Color:</span>
            <div className="inline-flex items-center gap-2 ml-2">
              <div 
                className="w-6 h-6 rounded border border-gray-600"
                style={{ backgroundColor: assoc?.theme_color || '#9810fa' }}
              ></div>
              <span className="text-white">{assoc?.theme_color || '#9810fa'}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Association:</span>
            <span className="ml-2 text-white">{assoc?.association_name || "—"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Short Name:</span>
            <span className="ml-2 text-white">{assoc?.association_short_name || "—"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Type:</span>
            <span className="ml-2 text-white">{assoc?.Association_type || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Payment Link:</span>
            <span className="ml-2 flex items-center gap-2">
              {assoc?.association_short_name ? (
                <>
                  <a
                    href={`https://${assoc.association_short_name}.${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white break-all"
                  >
                    {`https://${assoc.association_short_name}.${domain}`}
                  </a>
                  <button
                    className="ml-1 text-gray-400 hover:text-purple-400"
                    title="Copy payment link"
                    onClick={() => {
                      const link = `https://${assoc.association_short_name}.${domain}`;
                      navigator.clipboard.writeText(link);
                      setMessage({ type: 'success', text: 'Payment link copied!' });
                    }}
                    style={{ lineHeight: 0 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <rect x="2" y="2" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </>
              ) : (
                <span className="text-white">—</span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}