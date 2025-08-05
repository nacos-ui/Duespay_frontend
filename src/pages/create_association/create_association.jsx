import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Upload, ShoppingCart } from 'lucide-react';
import StatusMessage from '../../components/StatusMessage';
import SubmitButton from '../../components/SubmitButton';
import { API_ENDPOINTS } from '../../apiConfig';
import { usePageTitle } from '../../hooks/usePageTitle';
import FormInput from './components/FormInput';
import FileUpload from './components/FileUpload';
import ColorPicker from './components/ColorPicker';
import FormSelect from './components/FormSelect';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils'; 


// Main Association Form Component
const AssociationForm = () => {
  const [formData, setFormData] = useState({
    association_name: '',
    association_short_name: '',
    Association_type: '',
    logo: null,
    theme_color: '#9810fa'
  });
  usePageTitle('Create Association - DuesPay')
  const [associationId, setAssociationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const associationTypes = [
    { value: 'hall', label: 'Hall' },
    { value: 'department', label: 'Department' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'other', label: 'Other' }
  ];

  // Fetch association on mount
  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetchWithTimeout(API_ENDPOINTS.CREATE_ASSOCIATION, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }, 10000); // 10 second timeout for fetching association
        
        if (response.ok) {
          const data = await response.json();
          // Use the first association from results array
          if (Array.isArray(data.results) && data.results.length > 0) {
            const assoc = data.results[0];
            setAssociationId(assoc.id);
            setFormData({
              association_name: assoc.association_name || '',
              association_short_name: assoc.association_short_name || '',
              Association_type: assoc.Association_type || '',
              logo: null, // don't prefill file input
              theme_color: assoc.theme_color || '#9810fa'
            });
          }
        }
      } catch (err) {
        // Handle timeout/network errors silently for fetching existing data
        const errorInfo = handleFetchError(err);
        console.log('Failed to fetch existing association:', errorInfo.message);
      }
    };
    fetchAssociation();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('association_name', formData.association_name);
      submitData.append('association_short_name', formData.association_short_name);
      submitData.append('Association_type', formData.Association_type);
      submitData.append('theme_color', formData.theme_color);

      if (formData.logo) {
        submitData.append('logo', formData.logo);
      }

      const token = localStorage.getItem("access_token");
      let url = API_ENDPOINTS.CREATE_ASSOCIATION;
      let method = "POST";
      if (associationId !== null) {
        url = API_ENDPOINTS.UPDATE_ASSOCIATION(associationId);
        method = "PUT";
      }

      const response = await fetchWithTimeout(url, {
        method,
        body: submitData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }, 30000); // 30 second timeout for association creation/update (file upload takes longer)

      if (response.ok) {
        setSuccess('Association Created successfully!');
        setError('');
        setTimeout(() => {
          navigate('/dashboard/overview');
        }, 1200);
      } else {
        const err = await response.json();
        setError(err.detail || 'Failed to Create association');
        setSuccess('');
      }
    } catch (error) {
      // Use the error handler for consistent timeout/network error messages
      const errorInfo = handleFetchError(error);
      setError(errorInfo.message);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-1 sm:p-4 pt-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-1.5">
            <img
              src="/Duespay_logo.png"
              alt="DuesPay Logo"
              className="h-16 w-16 mx-auto mb-4 rounded-xl bg-transparent object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Association</h1>
          <p className="text-gray-300">Set up your association details for DuesPay</p>
        </div>

        {/* Success/Error Messages */}
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {success && <StatusMessage type="success">{success}</StatusMessage>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-[10px] sm:rounded-2xl p-8 shadow-2xl space-y-6">
          <FormInput
            label="Association Name"
            name="association_name"
            placeholder="Enter full association name"
            value={formData.association_name}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Short Name"
            name="association_short_name"
            placeholder="Enter short name/abbreviation"
            value={formData.association_short_name}
            onChange={handleInputChange}
            required
          />

          <FormSelect
            label="Association Type"
            name="Association_type"
            options={associationTypes}
            value={formData.Association_type}
            onChange={handleInputChange}
            required
          />

          <ColorPicker
            label="Theme Color"
            name="theme_color"
            value={formData.theme_color}
            onChange={handleInputChange}
          />

          <FileUpload
            label="Logo"
            name="logo"
            onChange={handleFileChange}
            file={formData.logo}
          />

          <SubmitButton loading={loading} loadingText="Creating Association...">
            {associationId ? "Create Association" : "Create Association"}
          </SubmitButton>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Need help? Contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssociationForm;