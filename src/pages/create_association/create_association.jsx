import React, { useState } from 'react';
import { Eye, EyeOff, Upload, ShoppingCart, Loader2 } from 'lucide-react';
import StatusMessage from '../../appComponents/StatusMessage';
import SubmitButton from '../../appComponents/SubmitButton';

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

// File Upload Component
const FileUpload = ({
  label,
  onChange,
  accept = "image/*",
  name
}) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(e);
    }
  };

  const inputId = `${name}-upload`;

  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
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
    logo: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const associationTypes = [
    { value: 'hall', label: 'Hall' },
    { value: 'department', label: 'Department' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'other', label: 'Other' }
  ];

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

      if (formData.logo) {
        submitData.append('logo', formData.logo);
      }

      // Make POST request to backend
      const token = localStorage.getItem("access_token");
      const response = await fetch('http://localhost:8000/association/1/', {
        method: 'PUT',
        body: submitData,
        headers: {
            "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess('Association created successfully!');
        setError('');
        // Optionally reset form
        window.location.href = '/dashboard'
      } else {
        const err = await response.json();
        setError(err.detail || 'Failed to create association');
        setSuccess('');
      }
    } catch (error) {
      setError('Error creating association. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Association</h1>
          <p className="text-gray-300">Set up your association details for DuesPay</p>
        </div>

        {/* Success/Error Messages */}
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {success && <StatusMessage type="success">{success}</StatusMessage>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
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

          <FileUpload
            label="Logo"
            name="logo"
            onChange={handleFileChange}
          />

          <SubmitButton loading={loading} loadingText="Creating Association...">
            Create Association
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