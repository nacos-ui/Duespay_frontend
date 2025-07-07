import React, { useState } from 'react';
import FormInput from './FormInput';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d+$/;

const RegistrationStep = ({
  payerData,
  handleInputChange,
  error,
  loading,
  associationData,
  themeColor
}) => {
  const [validationError, setValidationError] = useState("");

  const type = associationData?.Association_type || associationData?.association_type || "";

  // Helper to trim and validate input
  const handleFieldChange = (key, value) => {
    let trimmed = value.trim();
    if (key === "phoneNumber") trimmed = trimmed.replace(/\s+/g, "");
    if (key === "matricNumber") trimmed = trimmed.replace(/\D/g, "");
    handleInputChange(key, trimmed);
  };

  // Validation logic
  const validate = () => {
    if (!payerData.firstName || !payerData.lastName) return "First and last name are required.";
    if (!payerData.email || !emailRegex.test(payerData.email)) return "Enter a valid email address.";
    if (!payerData.phoneNumber || !phoneRegex.test(payerData.phoneNumber)) return "Enter a valid phone number (numbers and + only).";
    if (!payerData.matricNumber) return "Matric number is required.";
    if (type === "hall") {
      if (!payerData.faculty) return "Faculty is required for Hall.";
      if (!payerData.department) return "Department is required for Hall.";
    }
    return "";
  };

  // Start with all fields
  let fields = [
    { key: 'firstName', label: 'First Name', required: true },
    { key: 'lastName', label: 'Last Name', required: true },
    { key: 'matricNumber', label: 'Matric Number', required: true, type: 'text', inputMode: 'numeric', pattern: '[0-9]*' },
    { key: 'email', label: 'Email', required: true, type: 'email' },
    { key: 'phoneNumber', label: 'Phone Number', required: true, type: 'tel', pattern: '^\\+?\\d+$' },
    { key: 'faculty', label: 'Faculty', required: type === "hall" },
    { key: 'department', label: 'Department', required: type === "hall" },
  ];

  // Remove fields based on type
  if (type === "faculty") {
    // Remove faculty only
    fields = fields.filter(f => f.key !== "faculty");
  } else if (type === "department") {
    // Remove both faculty and department
    fields = fields.filter(f => f.key !== "faculty" && f.key !== "department");
  }
  // For "other" and "hall", show all fields

  React.useEffect(() => {
    setValidationError("");
  }, [payerData, type]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payer Registration</h2>
        <p className="text-gray-600 dark:text-slate-300">Please fill in your details to continue</p>
      </div>

      {error && <div className="text-red-500 dark:text-red-400 text-sm mb-2 text-center">{error}</div>}
      {loading && <div className="text-gray-500 dark:text-slate-400 text-sm mb-2 text-center">Checking details...</div>}
      {validationError && <div className="text-red-500 dark:text-red-400 text-sm mb-2 text-center">{validationError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <FormInput
            key={field.key}
            label={field.label}
            type={field.type || 'text'}
            inputMode={field.inputMode}
            pattern={field.pattern}
            value={payerData[field.key] || ""}
            onChange={value => handleFieldChange(field.key, value)}
            placeholder={field.placeholder}
            required={field.required}
            themeColor={themeColor}
          />
        ))}
      </div>
    </div>
  );
};

export default RegistrationStep;