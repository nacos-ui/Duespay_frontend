import React, { useState, useEffect, useCallback } from "react";
import { Edit, Search, Check, X, Loader2 } from "lucide-react";
import { API_ENDPOINTS } from "../../../apiConfig";
import StatusMessage from "../../../components/StatusMessage";
import { fetchWithTimeout, handleFetchError } from "../../../utils/fetchUtils";
import SettingsCardSkeleton from "./SettingsCardSkeleton";

export default function BankInfoCard({ data, loading, onUpdated }) {
  // Handle the updated API response structure
  const bank = data?.data || null;

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(''); // 'success', 'error', or ''
  const [verifiedData, setVerifiedData] = useState(null);
  
  // Search states
  const [bankSearch, setBankSearch] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [filteredBanks, setFilteredBanks] = useState([]);

  // Initialize form when bank data changes
  useEffect(() => {
    if (bank) {
      setForm({
        account_number: bank.account_number || '',
        account_name: bank.account_name || '',
        bank_name: bank.bank_name || '',
        bank_code: bank.bank_code || ''
      });
      setBankSearch(bank.bank_name || '');
      setVerificationStatus(bank.is_verified ? 'success' : '');
    } else {
      setForm({
        account_number: '',
        account_name: '',
        bank_name: '',
        bank_code: ''
      });
      setBankSearch('');
      setVerificationStatus('');
    }
  }, [bank]);

  // Auto-clear messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  // Fetch banks list from the all-banks endpoint
  useEffect(() => {
    const fetchBanks = async () => {
      setBanksLoading(true);
      try {
        const res = await fetchWithTimeout(API_ENDPOINTS.GET_BANKS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBanks(data.banks || []);
          setFilteredBanks(data.banks || []);
        } else {
          setMessage({ type: "error", text: "Failed to fetch banks." });
        }
      } catch (error) {
        const errorInfo = handleFetchError(error);
        setMessage({ type: "error", text: errorInfo.message });
      } finally {
        setBanksLoading(false);
      }
    };
    fetchBanks();
  }, []);

  // Filter banks based on search
  useEffect(() => {
    if (bankSearch.trim() === '') {
      setFilteredBanks(banks);
    } else {
      const filtered = banks.filter(bank =>
        bank.name.toLowerCase().includes(bankSearch.toLowerCase())
      );
      setFilteredBanks(filtered);
    }
  }, [bankSearch, banks]);

  // Verify account when account number and bank code are available
  const verifyAccount = useCallback(async () => {
    if (form.account_number?.length === 10 && form.bank_code) {
      setVerifying(true);
      setVerificationStatus('');
      setMessage({ type: "", text: "" });
      
      try {
        const res = await fetchWithTimeout(API_ENDPOINTS.VERIFY_BANK, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            account_number: form.account_number,
            bank_code: form.bank_code,
          }),
        }, 15000);
        
        const responseData = await res.json();
        
        if (res.ok && responseData.success) {
          const verified = responseData.data;
          setVerifiedData(verified);
          setForm((f) => ({ 
            ...f, 
            account_name: verified.account_name,
            bank_name: verified.bank_name,
            account_number: verified.account_number,
            bank_code: verified.bank_code
          }));
          setVerificationStatus('success');
          setMessage({
            type: "success",
            text: "Account verified successfully.",
          });
        } else {
          setForm((f) => ({ ...f, account_name: "" }));
          setVerificationStatus('error');
          setVerifiedData(null);
          setMessage({
            type: "error",
            text: responseData.message || "Failed to verify account.",
          });
        }
      } catch (error) {
        const errorInfo = handleFetchError(error);
        setForm((f) => ({ ...f, account_name: "" }));
        setVerificationStatus('error');
        setVerifiedData(null);
        setMessage({ type: "error", text: errorInfo.message });
      } finally {
        setVerifying(false);
      }
    } else {
      // Clear account name if conditions aren't met
      setForm((f) => ({ ...f, account_name: "" }));
      setVerificationStatus('');
      setVerifiedData(null);
    }
  }, [form.account_number, form.bank_code]);

  // Auto-verify when account number or bank code changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (form.account_number && form.bank_code && edit) {
        verifyAccount();
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(debounceTimer);
  }, [form.account_number, form.bank_code, edit, verifyAccount]);

  const handleBankSelect = (selectedBank) => {
    setForm((f) => ({
      ...f,
      bank_code: selectedBank.code,
      bank_name: selectedBank.name,
      account_name: "" // Clear account name when bank changes
    }));
    setBankSearch(selectedBank.name);
    setShowBankDropdown(false);
    setVerificationStatus('');
    setVerifiedData(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (!form.bank_name?.trim()) {
      setMessage({ type: "error", text: "Bank name is required." });
      setSaving(false);
      return;
    }
    if (!form.account_name?.trim()) {
      setMessage({ type: "error", text: "Account name is required. Please verify your account details." });
      setSaving(false);
      return;
    }
    if (!form.account_number?.trim()) {
      setMessage({ type: "error", text: "Account number is required." });
      setSaving(false);
      return;
    }
    if (form.account_number.length !== 10) {
      setMessage({
        type: "error",
        text: "Account number must be 10 digits.",
      });
      setSaving(false);
      return;
    }
    if (verificationStatus !== 'success' || !verifiedData) {
      setMessage({
        type: "error",
        text: "Please verify your account details before saving.",
      });
      setSaving(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    const method = bank && bank.id ? "PATCH" : "POST";
    const url = bank && bank.id
      ? API_ENDPOINTS.UPDATE_DETAIL_BANK_ACCOUNT(bank.id)
      : API_ENDPOINTS.GET_CREATE_BANK_ACCOUNT;

    try {
      // Use the verified data structure
      const saveData = {
        account_number: verifiedData.account_number,
        account_name: verifiedData.account_name,
        bank_name: verifiedData.bank_name,
        bank_code: verifiedData.bank_code
      };

      const res = await fetchWithTimeout(
        url,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(saveData),
        },
        15000
      );

      if (res.ok) {
        const updated = await res.json();
        setMessage({
          type: "success",
          text: "Bank information saved successfully!",
        });
        setEdit(false);
        // Update with the new response structure
        onUpdated(updated);
      } else {
        const error = await res.json();
        setMessage({
          type: "error",
          text:
            error.message ||
            error.detail ||
            "Failed to save bank information.",
        });
      }
    } catch (error) {
      const errorInfo = handleFetchError(error);
      setMessage({ type: "error", text: errorInfo.message });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
    // Reset form to original bank data
    if (bank) {
      setForm({
        account_number: bank.account_number || '',
        account_name: bank.account_name || '',
        bank_name: bank.bank_name || '',
        bank_code: bank.bank_code || ''
      });
      setBankSearch(bank.bank_name || '');
      setVerificationStatus(bank.is_verified ? 'success' : '');
    } else {
      setForm({
        account_number: '',
        account_name: '',
        bank_name: '',
        bank_code: ''
      });
      setBankSearch('');
      setVerificationStatus('');
    }
    setMessage({ type: "", text: "" });
    setShowBankDropdown(false);
    setVerifiedData(null);
  };

  if (loading && !bank) return <SettingsCardSkeleton />;

  return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] min-w-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-purple-400">
            <i className="fa fa-bank" />
          </span>
          Bank Information
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

      {message.text && (
        <StatusMessage type={message.type}>{message.text}</StatusMessage>
      )}

      {edit ? (
        <div className="space-y-4">
          {/* Bank Name with Search */}
          <div className="relative">
            <label className="text-gray-400 text-sm block mb-1">Bank Name</label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full bg-[#23263A] text-white rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={bankSearch}
                  onChange={(e) => {
                    setBankSearch(e.target.value);
                    setShowBankDropdown(true);
                  }}
                  onFocus={() => setShowBankDropdown(true)}
                  placeholder="Search and select a bank"
                />
                {banksLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                )}
              </div>
              
              {/* Dropdown */}
              {showBankDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-[#23263A] border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredBanks.length > 0 ? (
                    filteredBanks.map((bankItem) => (
                      <button
                        key={bankItem.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-[#2D3142] text-white transition-colors"
                        onClick={() => handleBankSelect(bankItem)}
                      >
                        {bankItem.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-400">
                      {banksLoading ? 'Loading banks...' : 'No banks found'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Account Number</label>
            <input
              className="w-full bg-[#23263A] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={form.account_number || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                if (value.length <= 10) {
                  setForm((f) => ({ ...f, account_number: value }));
                }
              }}
              placeholder="Enter 10-digit account number"
              maxLength="10"
            />
          </div>

          {/* Account Name with Verification Status */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Account Name</label>
            <div className="relative">
              <input
                className="w-full bg-[#23263A] text-white rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-60"
                value={form.account_name || ""}
                placeholder={verifying ? "Verifying..." : "Account name will appear after verification"}
                readOnly
                disabled
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {verifying && (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                )}
                {verificationStatus === 'success' && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
                {verificationStatus === 'error' && (
                  <X className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
            {verifying && (
              <p className="text-xs text-blue-400 mt-1">Verifying account details...</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
              onClick={handleSave}
              disabled={saving || verifying || verificationStatus !== 'success'}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-gray-400 text-sm w-28">Bank Name:</span>
            <span className="ml-2 text-white">{bank?.bank_name || "—"}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 text-sm w-28">Account Name:</span>
            <span className="ml-2 text-white">
              {bank?.account_name || "—"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 text-sm w-28">Account Number:</span>
            <span className="ml-2 text-white">
              {bank?.account_number
                ? `••••••${bank.account_number.slice(-4)}`
                : "—"}
            </span>
          </div>
          {/* {bank?.bank_code && (
            <div className="flex items-center">
              <span className="text-gray-400 text-sm w-28">Bank Code:</span>
              <span className="ml-2 text-white">{bank.bank_code}</span>
            </div>
          )} */}
          {/* {bank?.is_verified && (
            <div className="flex items-center">
              <span className="text-gray-400 text-sm w-28">Status:</span>
              <span className="ml-2 flex items-center gap-1 text-green-400">
                <Check className="w-4 h-4" />
                Verified
              </span>
            </div>
          )} */}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showBankDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowBankDropdown(false)}
        />
      )}
    </div>
  );
}