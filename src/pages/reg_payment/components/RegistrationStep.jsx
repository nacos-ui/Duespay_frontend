import React, { useState, forwardRef, useImperativeHandle } from 'react';
import FormInput from './FormInput';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+234|234|0)[789]\d{9}$/;

const RegistrationStep = forwardRef(({
  payerData,
  handleInputChange,
  error,
  loading,
  associationData,
  themeColor
}, ref) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [validationError, setValidationError] = useState("");

  const type = associationData?.association_type || associationData?.association_type || "";

  const handleFieldChange = (key, value) => {
    let processedValue = value;
    
    if (fieldErrors[key]) {
      setFieldErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
    
    if (key === "phoneNumber") {
      processedValue = value.replace(/[^\d+\-\s]/g, '');
    }
    
    handleInputChange(key, processedValue);
  };

  const parseBackendErrors = (error) => {
    if (typeof error === 'object' && error !== null && !error.error) {
      const errors = {};
      Object.keys(error).forEach(field => {
        if (Array.isArray(error[field]) && error[field].length > 0) {
          errors[field] = error[field][0];
        }
      });
      return errors;
    }
    return {};
  };

  const validateFields = () => {
    const errors = {};
    
    if (!payerData.firstName?.trim()) {
      errors.firstName = "First name is required.";
    }
    
    if (!payerData.lastName?.trim()) {
      errors.lastName = "Last name is required.";
    }
    
    if (!payerData.email?.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(payerData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    
    if (!payerData.phoneNumber?.trim()) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!phoneRegex.test(payerData.phoneNumber.replace(/[\s\-]/g, ''))) {
      errors.phoneNumber = "Please enter a valid Nigerian phone number.";
    }
    
    if (!payerData.matricNumber?.trim()) {
      errors.matricNumber = "Matric number is required.";
    }
    
    // Add level validation
    if (!payerData.level?.trim()) {
      errors.level = "Level is required.";
    }
    
    if (type === "hall" || type === "other") {
      if (!payerData.faculty?.trim()) {
        errors.faculty = "Faculty is required.";
      }
      if (!payerData.department?.trim()) {
        errors.department = "Department is required.";
      }
    } else if (type === "faculty") {
      if (!payerData.department?.trim()) {
        errors.department = "Department is required.";
      }
    }
    
    return errors;
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      const errors = validateFields();
      setFieldErrors(errors);
      
      if (Object.keys(errors).length > 0) {
        setValidationError("Please fix the errors below before continuing.");
        return "Please fix the errors below before continuing.";
      }
      
      setValidationError("");
      return null;
    },
    setBackendErrors: (backendError) => {
      const parsedErrors = parseBackendErrors(backendError);
      setFieldErrors(parsedErrors);
      if (Object.keys(parsedErrors).length > 0) {
        setValidationError("Please fix the errors below.");
      }
    }
  }));

  const getFieldsForType = () => {
    const baseFields = [
      { key: 'firstName', label: 'First Name', required: true },
      { key: 'lastName', label: 'Last Name', required: true },
      { key: 'matricNumber', label: 'Matric Number', required: true, type: 'text' },
      { key: 'level', label: 'Level', required: true, type: 'select', options: ['100', '200', '300', '400', '500', '600'] },
      { key: 'email', label: 'Email Address', required: true, type: 'email' },
      { key: 'phoneNumber', label: 'Phone Number', required: true, type: 'tel', placeholder: '+234 or 0' },
    ];

    switch (type) {
      case "hall":
      case "other":
        return [
          ...baseFields,
          { key: 'faculty', label: 'Faculty', required: true },
          { key: 'department', label: 'Department', required: true },
        ];
      case "faculty":
        return [
          ...baseFields,
          { key: 'department', label: 'Department', required: true },
        ];
      case "department":
        return baseFields;
      default:
        return [
          ...baseFields,
          { key: 'faculty', label: 'Faculty', required: true },
          { key: 'department', label: 'Department', required: true },
        ];
    }
  };

  const fields = getFieldsForType();

  React.useEffect(() => {
    setValidationError("");
    setFieldErrors({});
  }, [payerData, type]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" 
             style={{ backgroundColor: `${themeColor}20` }}>
          <UserPlus className="w-8 h-8" style={{ color: themeColor }} />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
          Payer Registration
        </h2>
        <p className="text-gray-600 dark:text-slate-400">
          Please provide your information to continue with payment
        </p>
      </div>

      {/* Status Messages */}
      {validationError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
          <div className="text-red-700 dark:text-red-300 font-medium">{validationError}</div>
        </div>
      )}

      {error && !validationError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
          <div className="text-red-700 dark:text-red-300 font-medium">{error}</div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: `${themeColor}10` }}>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" 
               style={{ color: themeColor }}></div>
          <div className="font-medium" style={{ color: themeColor }}>
            Checking your details...
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.key} className="">
            <FormInput
              label={field.label}
              type={field.type || 'text'}
              value={payerData[field.key] || ""}
              onChange={value => handleFieldChange(field.key, value)}
              placeholder={field.placeholder}
              required={field.required}
              themeColor={themeColor}
              error={fieldErrors[field.key]}
              options={field.options}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

RegistrationStep.displayName = 'RegistrationStep';

export default RegistrationStep;