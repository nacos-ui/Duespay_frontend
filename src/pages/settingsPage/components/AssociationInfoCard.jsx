import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { API_BASE_URL, API_ENDPOINTS } from "../../../apiConfig";

export default function AssociationInfoCard({ data, loading, onUpdated }) {
  const assoc = data?.results?.[0] || null;

  const initialForm = assoc
    ? {
        id: assoc.id,
        association_name: assoc.association_name || "",
        association_short_name: assoc.association_short_name || "",
        Association_type: assoc.Association_type || "",
        logo: assoc.logo || "",
      }
    : {};

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialForm);
    setLogoFile(null);
  }, [data]);

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setForm(f => ({ ...f, logo: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("access_token");
    const method = assoc && assoc.id ? "PUT" : "POST";
    const url = assoc && assoc.id
      ? API_ENDPOINTS.UPDATE_ASSOCIATION(assoc.id)
      : API_ENDPOINTS.CREATE_ASSOCIATION;

    let body, headers;
    if (logoFile) {
      body = new FormData();
      body.append("association_name", form.association_name);
      body.append("association_short_name", form.association_short_name);
      body.append("Association_type", form.Association_type);
      body.append("logo", logoFile);
      headers = { Authorization: `Bearer ${token}` }; // Let browser set Content-Type
    } else {
      body = JSON.stringify({
        association_name: form.association_name,
        association_short_name: form.association_short_name,
        Association_type: form.Association_type,
        logo: form.logo, // If you want to keep the old logo
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
    const updated = await res.json();
    setSaving(false);
    setEdit(false);
    onUpdated({ results: [updated] });
  };

  if (loading && !assoc) return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] animate-pulse" />
  );

  // Helper to get logo URL (handle file or string)
  const logoUrl = logoFile
    ? URL.createObjectURL(logoFile)
    : assoc?.logo && assoc.logo !== "string"
      ? assoc.logo
      : null;

  return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-purple-400"><i className="fa fa-building" /></span>
          Association Info
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
              <option value="club">Club</option>
            </select>
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
        </div>
      )}
    </div>
  );
}