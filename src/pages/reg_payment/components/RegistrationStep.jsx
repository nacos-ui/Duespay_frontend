import React, { useState, forwardRef, useImperativeHandle } from 'react';
import FormInput from './FormInput';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+234|234|0)[789]\d{9}$/; // Nigerian phone number format

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

  const type = associationData?.Association_type || associationData?.association_type || "";

  // Helper to trim and validate input
  const handleFieldChange = (key, value) => {
    let processedValue = value;
    
    // Clear field error when user starts typing
    if (fieldErrors[key]) {
      setFieldErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
    
    // Process specific fields
    if (key === "phoneNumber") {
      // Allow numbers, spaces, +, and - for phone formatting
      processedValue = value.replace(/[^\d+\-\s]/g, '');
    }
    
    handleInputChange(key, processedValue);
  };

  // Parse backend errors (field-specific validation errors)
  const parseBackendErrors = (error) => {
    if (typeof error === 'object' && error !== null && !error.error) {
      const errors = {};
      Object.keys(error).forEach(field => {
        if (Array.isArray(error[field]) && error[field].length > 0) {
          errors[field] = error[field][0]; // Take first error message
        }
      });
      return errors;
    }
    return {};
  };

  // Frontend validation (only field format and required validation)
  const validateFields = () => {
    const errors = {};
    
    // Required fields validation
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
    
    // Conditional fields based on association type
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

  // Expose validation to parent component
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

  // Define fields based on association type
  const getFieldsForType = () => {
    const baseFields = [
      { key: 'firstName', label: 'First Name', required: true },
      { key: 'lastName', label: 'Last Name', required: true },
      { key: 'matricNumber', label: 'Matric Number', required: true, type: 'text' },
      { key: 'email', label: 'Email', required: true, type: 'email' },
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
    // Clear frontend validation errors when data changes
    setValidationError("");
    setFieldErrors({});
  }, [payerData, type]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payer Registration</h2>
        <p className="text-gray-600 dark:text-slate-300">Please fill in your details to continue</p>
      </div>

      {/* Frontend validation error */}
      {validationError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="text-red-700 dark:text-red-300 text-sm font-medium">{validationError}</div>
        </div>
      )}

      {/* Backend general error (like "Phone number already belongs to another user") */}
      {error && !validationError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</div>
        </div>
      )}

      {loading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <div className="text-blue-700 dark:text-blue-300 text-sm font-medium">Checking details...</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <FormInput
              label={field.label}
              type={field.type || 'text'}
              value={payerData[field.key] || ""}
              onChange={value => handleFieldChange(field.key, value)}
              placeholder={field.placeholder}
              required={field.required}
              themeColor={themeColor}
              error={fieldErrors[field.key]}
            />
            {fieldErrors[field.key] && (
              <div className="text-red-500 dark:text-red-400 text-xs mt-1">
                {fieldErrors[field.key]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

RegistrationStep.displayName = 'RegistrationStep';

export default RegistrationStep;