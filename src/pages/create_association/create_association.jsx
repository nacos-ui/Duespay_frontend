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
    { value: 'hall', label: 'Hall of Residence', icon: Building2, description: 'Student residential hall' },
    { value: 'department', label: 'Academic Department', icon: Users, description: 'Academic department or school' },
    { value: 'faculty', label: 'Faculty', icon: Building2, description: 'Faculty or college' },
    { value: 'other', label: 'Other Organization', icon: Sparkles, description: 'Club, society, or other group' }
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
        }, 10000);
        
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
        setSuccess('🎉 Association created successfully!');
        setTimeout(() => {
          navigate('/dashboard/overview');
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
    <div className="min-h-screen bg-[#0f111f] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/Duespay_logo.png"
              alt="DuesPay"
              className="h-10 w-10 rounded-xl mr-3 shadow-lg"
            />
            <h1 className="text-4xl font-bold text-white">Create Your Association</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Welcome to DuesPay! Let's set up your organization and start collecting payments seamlessly.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.number;
              const isCurrent = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-500 ${
                        isActive 
                          ? 'bg-[#8200db] border-[#8200db] text-white shadow-lg' 
                          : 'border-gray-600 text-gray-400 bg-[#23263a]'
                      } ${isCurrent ? 'ring-4 ring-[#8200db]/30 scale-110' : ''}`}
                    >
                      {isCompleted ? (
                        <Check className="w-7 h-7" />
                      ) : (
                        <Icon className="w-7 h-7" />
                      )}
                      {isCurrent && (
                        <div className="absolute -inset-2 rounded-full bg-[#8200db] opacity-20 animate-pulse" />
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                      <p className={`text-xs mt-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-6 mt-8 rounded-full bg-gray-700 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 bg-[#8200db] ${
                          currentStep > step.number ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {success && <StatusMessage type="success">{success}</StatusMessage>}

        {/* Form Card */}
        <div className="bg-[#23263a] rounded-2xl p-8 shadow-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8200db] rounded-full mb-4 shadow-lg">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Basic Information</h3>
                  <p className="text-gray-400">Let's start with the essentials about your association</p>
                </div>

                <div className="grid gap-6">
                  <FormInput
                    label="Association Name"
                    name="association_name"
                    placeholder="e.g., Computer Science Students Association"
                    value={formData.association_name}
                    onChange={handleInputChange}
                    required
                    description="The full official name of your association"
                  />

                  <FormInput
                    label="Short Name / Abbreviation"
                    name="association_short_name"
                    placeholder="e.g., CSSA"
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
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8200db] rounded-full mb-4 shadow-lg">
                    <Palette className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Brand Your Association</h3>
                  <p className="text-gray-400">Make your association unique with custom colors and logo</p>
                </div>

                <div className="grid gap-6">
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
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4 shadow-lg">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Review & Create</h3>
                  <p className="text-gray-400">Everything looks perfect? Let's bring your association to life!</p>
                </div>

                {/* Review Card */}
                <div className="bg-[#101828] rounded-2xl p-8 border border-gray-700">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">Association Preview</h4>
                      <p className="text-gray-400">This is how your association will appear</p>
                    </div>
                    {formData.logo && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-600 shadow-lg ml-4">
                        <img
                          src={URL.createObjectURL(formData.logo)}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-[#23263a] rounded-xl border border-gray-700">
                      <span className="text-gray-400 font-medium">Full Name:</span>
                      <span className="text-white font-semibold">{formData.association_name || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#23263a] rounded-xl border border-gray-700">
                      <span className="text-gray-400 font-medium">Short Name:</span>
                      <span className="text-white font-semibold">{formData.association_short_name || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#23263a] rounded-xl border border-gray-700">
                      <span className="text-gray-400 font-medium">Type:</span>
                      <span className="text-white font-semibold capitalize">
                        {associationTypes.find(type => type.value === formData.association_type)?.label || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#23263a] rounded-xl border border-gray-700">
                      <span className="text-gray-400 font-medium">Theme Color:</span>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-600 shadow-md" 
                          style={{ backgroundColor: formData.theme_color }}
                        />
                        <span className="text-white font-semibold font-mono text-sm">{formData.theme_color}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#23263a] rounded-xl border border-gray-700">
                      <span className="text-gray-400 font-medium">Logo:</span>
                      <span className="text-white font-semibold">
                        {formData.logo ? formData.logo.name : 'No logo uploaded'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-700">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white hover:bg-[#101828] rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
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
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    validateStep(currentStep)
                      ? 'bg-[#8200db] hover:bg-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transform'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <SubmitButton 
                  loading={loading} 
                  loadingText="Creating Your Association..."
                  className="bg-green-600 hover:bg-green-700 px-10 py-4 rounded-xl font-bold text-lg text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🚀 Create Association
                </SubmitButton>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Need assistance? <a href="mailto:support@duespay.com" className="text-[#8200db] hover:text-purple-400 transition-colors underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssociationForm;