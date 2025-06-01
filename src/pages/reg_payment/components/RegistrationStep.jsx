import React from 'react';
import FormInput from './FormInput';

const RegistrationStep = ({ payerData, handleInputChange }) => {
  const formFields = [
    { key: 'firstName', label: 'First Name', placeholder: 'Enter your first name', required: true },
    { key: 'lastName', label: 'Last Name', placeholder: 'Enter your last name', required: true },
    { key: 'matricNumber', label: 'Matric Number', placeholder: 'e.g., 234567', required: true },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email', required: true },
    { key: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number' },
    { key: 'faculty', label: 'Faculty', placeholder: 'Enter your faculty' },
    { key: 'department', label: 'Department', placeholder: 'Enter your department' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Payer Registration</h2>
        <p className="text-slate-300">Please fill in your details to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((field) => (
          <FormInput
            key={field.key}
            label={field.label}
            type={field.type || 'text'}
            value={payerData[field.key]}
            onChange={(value) => handleInputChange(field.key, value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        ))}
      </div>
    </div>
  );
};

export default RegistrationStep;