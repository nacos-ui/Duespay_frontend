import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Upload, ShoppingCart } from 'lucide-react';
import StatusMessage from '../../appComponents/StatusMessage';
import SubmitButton from '../../appComponents/SubmitButton';
import { API_ENDPOINTS } from '../../apiConfig';
import { usePageTitle } from '../../hooks/usePageTitle';

// Form Input Component
const FormInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  name
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

// Select Input Component
const FormSelect = ({
  label,
  options,
  value,
  onChange,
  required = false,
  name
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
      >
        <option value="">Select association type</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Color Picker Component with Preview
const ColorPicker = ({
  label,
  value,
  onChange,
  name
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="color"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full h-12 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-12 h-12 rounded-lg border border-gray-600 shadow-lg"
            style={{ backgroundColor: value }}
          ></div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange({ target: { name, value: e.target.value } })}
            className="w-24 px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
};

// File Upload Component with Preview
const FileUpload = ({
  label,
  onChange,
  accept = "image/*",
  name,
  file
}) => {
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      
      onChange(e);
    }
  };

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const inputId = `${name}-upload`;

  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      
      {/* Preview */}
      {preview && (
        <div className="mb-3 flex justify-center">
          <img
            src={preview}
            alt="Logo preview"
            className="w-20 h-20 object-cover rounded-lg border border-gray-600"
          />
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
        />
        <label
          htmlFor={inputId}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 flex items-center justify-between"
        >
          <span>{fileName || 'Choose logo file'}</span>
          <Upload size={20} />
        </label>
      </div>
    </div>
  );
};

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
        const response = await fetch(API_ENDPOINTS.CREATE_ASSOCIATION, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
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
        // Optionally handle error
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

      const response = await fetch(url, {
        method,
        body: submitData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

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
      setError('Error Creating association. Please try again.');
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