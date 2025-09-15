import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Palette, Upload, ArrowRight, Check, ArrowLeft, Sparkles } from 'lucide-react';
import StatusMessage from '../../components/StatusMessage';
import SubmitButton from '../../components/SubmitButton';
import { API_ENDPOINTS } from '../../apiConfig';
import { usePageTitle } from '../../hooks/usePageTitle';
import FormInput from './components/FormInput';
import FileUpload from './components/FileUpload';
import ColorPicker from './components/ColorPicker';
import FormSelect from './components/FormSelect';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils';

const AssociationForm = () => {
  const [formData, setFormData] = useState({
    association_name: '',
    association_short_name: '',
    association_type: '',
    logo: null,
    theme_color: '#8200db'
  });
  
  usePageTitle('Create Association - DuesPay');
  
  const [associationId, setAssociationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const associationTypes = [
    { value: 'hall', label: 'Hall of Residence', icon: Building2, description: 'Hostel/Hall of Residence' },
    { value: 'department', label: 'Department', icon: Users, description: 'Department' },
    { value: 'faculty', label: 'Faculty', icon: Building2, description: 'Faculty' },
    { value: 'other', label: 'Other Organization', icon: Sparkles, description: 'Other Groups or Associations' }
  ];

  const steps = [
    { number: 1, title: 'Basic Info', icon: Building2, description: 'Tell us about your organization' },
    { number: 2, title: 'Branding', icon: Palette, description: 'Choose your colors and logo' },
    { number: 3, title: 'Review', icon: Check, description: 'Confirm and create' }
  ];

  // Fetch association on mount (but don't prefill form)
  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetchWithTimeout(API_ENDPOINTS.CREATE_ASSOCIATION, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }, 20000);
        
        const responseData = await response.json();
        if (response.ok && responseData.data) {
          const data = responseData.data;
          // Store association ID quietly for the update call, but don't prefill form
          if (Array.isArray(data.results) && data.results.length > 0) {
            const assoc = data.results[0];
            setAssociationId(assoc.id);
            // Don't prefill - user thinks they're creating fresh
          }
        }
      } catch (err) {
        console.log('No existing association found - will create new');
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
      }, 3000);
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

  const handleFileChange = (file) => {
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      theme_color: color
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.association_name && formData.association_short_name && formData.association_type;
      case 2:
        return formData.theme_color;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('association_name', formData.association_name);
      submitData.append('association_short_name', formData.association_short_name);
      submitData.append('association_type', formData.association_type);
      submitData.append('theme_color', formData.theme_color);

      if (formData.logo) {
        submitData.append('logo', formData.logo);
      }

      const token = localStorage.getItem("access_token");
      let url = API_ENDPOINTS.CREATE_ASSOCIATION;
      let method = "POST";
      
      // Use update endpoint if we have existing association
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
      }, 30000);

      if (response.ok) {
        setSuccess('Association created successfully!');
        setTimeout(() => {
          window.location.href = '/dashboard/overview';
        }, 1500);
      } else {
        const err = await response.json();
        setError(err.detail || err.message || 'Failed to create association');
      }
    } catch (error) {
      const errorInfo = handleFetchError(error);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111f] sm:p-4 sm:py-6 px-3 py-6 overflow-auto">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center flex-col justify-center mb-4">
            <img
              src="/Duespay_logo.png"
              alt="DuesPay"
              className="h-8 w-8 rounded-lg mr-2 mb-0.5 shadow-lg"
            />
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Create Your Association</h1>
          </div>
          <p className="text-gray-400 text-sm lg:text-base max-w-xl mx-auto">
            Set up your association
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Progress Steps (Desktop) / Top Section (Mobile) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Progress Steps */}
            <div className="bg-[#23263a] rounded-xl p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-4 text-sm">Setup Progress</h3>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep >= step.number;
                  const isCurrent = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  
                  return (
                    <div key={step.number} className="flex items-center">
                      <div 
                        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                          isActive 
                            ? 'bg-[#8200db] border-[#8200db] text-white' 
                            : 'border-gray-600 text-gray-400 bg-[#101828]'
                        } ${isCurrent ? 'ring-2 ring-[#8200db]/30' : ''}`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {step.title}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                          {step.description}
                        </p>
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div className="absolute left-4 mt-8 w-px h-4 bg-gray-700" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preview Card (for step 3) */}
            {currentStep === 3 && (
              <div className="bg-[#101828] rounded-xl p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white mb-1">Preview</h4>
                    <p className="text-xs text-gray-400">How it will appear</p>
                  </div>
                  {formData.logo && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-600 ml-2">
                      <img
                        src={URL.createObjectURL(formData.logo)}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-[#23263a] rounded-lg">
                    <span className="text-gray-400 text-sm">Name:</span>
                    <span className="text-white text-sm font-medium truncate ml-2">{formData.association_name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#23263a] rounded-lg">
                    <span className="text-gray-400 text-sm">Short:</span>
                    <span className="text-white text-sm font-medium">{formData.association_short_name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#23263a] rounded-lg">
                    <span className="text-gray-400 text-sm">Type:</span>
                    <span className="text-white text-sm font-medium capitalize">
                      {associationTypes.find(type => type.value === formData.association_type)?.label || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-[#23263a] rounded-lg">
                    <span className="text-gray-400 text-sm">Color:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-600" 
                        style={{ backgroundColor: formData.theme_color }}
                      />
                      <span className="text-white text-sm font-mono">{formData.theme_color}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {error && <StatusMessage type="error">{error}</StatusMessage>}
            {success && <StatusMessage type="success">{success}</StatusMessage>}
          </div>

          {/* Right Column - Form Content */}
          <div className="lg:col-span-2">
            <div className="bg-[#23263a] rounded-xl sm:p-6 py-6 px-3 border border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-[#8200db] rounded-full mb-3">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">Basic Information</h3>
                      <p className="text-gray-400 text-sm">Let's start with the essentials about your association</p>
                    </div>

                    <div className="space-y-4">
                      <FormInput
                        label="Association Name"
                        name="association_name"
                        placeholder="e.g., Nigeria Association of Computing Students"
                        value={formData.association_name}
                        onChange={handleInputChange}
                        required
                        description="The full official name of your association"
                      />

                      <FormInput
                        label="Short Name / Abbreviation"
                        name="association_short_name"
                        placeholder="e.g., NACOS"
                        value={formData.association_short_name}
                        onChange={handleInputChange}
                        required
                        description="A short abbreviation or acronym for easy reference"
                      />

                      <FormSelect
                        label="Association Type"
                        name="association_type"
                        options={associationTypes}
                        value={formData.association_type}
                        onChange={handleInputChange}
                        required
                        description="Choose the category that best describes your organization"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Branding */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-[#8200db] rounded-full mb-3">
                        <Palette className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">Brand Your Association</h3>
                      <p className="text-gray-400 text-sm">Make your association unique with custom colors and logo</p>
                    </div>

                    <div className="grid gap-4">
                      <ColorPicker
                        label="Theme Color"
                        name="theme_color"
                        value={formData.theme_color}
                        onChange={handleColorChange}
                        description="This color will be used throughout your association's payment pages"
                      />

                      <FileUpload
                        label="Association Logo"
                        name="logo"
                        onChange={handleFileChange}
                        file={formData.logo}
                        description="Upload your association's logo (optional). Recommended: square image, 512x512px"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-3">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">Review & Create</h3>
                      <p className="text-gray-400 text-sm">Everything looks perfect? Let's bring your association to life!</p>
                    </div>

                    {/* Detailed Review for Mobile/Small Screens */}
                    <div className="lg:hidden bg-[#101828] rounded-xl p-4 border border-gray-700">
                      <h4 className="text-base font-semibold text-white mb-3">Association Details</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-start p-3 bg-[#23263a] rounded-lg">
                          <span className="text-gray-400 text-sm">Full Name:</span>
                          <span className="text-white text-sm font-medium text-right ml-2">{formData.association_name || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#23263a] rounded-lg">
                          <span className="text-gray-400 text-sm">Short Name:</span>
                          <span className="text-white text-sm font-medium">{formData.association_short_name || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#23263a] rounded-lg">
                          <span className="text-gray-400 text-sm">Type:</span>
                          <span className="text-white text-sm font-medium capitalize">
                            {associationTypes.find(type => type.value === formData.association_type)?.label || 'Not selected'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#23263a] rounded-lg">
                          <span className="text-gray-400 text-sm">Theme Color:</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border border-gray-600" 
                              style={{ backgroundColor: formData.theme_color }}
                            />
                            <span className="text-white text-sm font-mono">{formData.theme_color}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[#23263a] rounded-lg">
                          <span className="text-gray-400 text-sm">Logo:</span>
                          <span className="text-white text-sm font-medium">
                            {formData.logo ? formData.logo.name : 'No logo uploaded'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#101828] rounded-lg transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                        validateStep(currentStep)
                          ? 'bg-[#8200db] hover:bg-purple-700 text-white shadow-lg hover:scale-105'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <SubmitButton 
                      loading={loading} 
                      loadingText="Creating..."
                      className="bg-green-600 hover:bg-green-700 px-0 py-1 rounded-lg font-small text-white shadow-lg hover:scale-100 transition-all"
                    >
                      Create Association
                    </SubmitButton>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Need assistance? <a href="mailto:support@duespay.com" className="text-[#8200db] hover:text-purple-400 transition-colors underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssociationForm;