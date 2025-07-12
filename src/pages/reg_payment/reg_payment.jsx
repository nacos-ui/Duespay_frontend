import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { User, CreditCard, Upload, CheckCircle } from 'lucide-react';
import Header from './components/Header';
import RegistrationStep from './components/RegistrationStep';
import PaymentSelectionStep from './components/PaymentSelectionStep';
import UploadReceiptStep from './components/UploadReceiptStep';
import ConfirmationStep from './components/ConfirmationStep';
import ErrorModal from '../../appComponents/ErrorModal';
import { fetchWithErrorModal } from '../../appComponents/fetchWithErrorModal';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils';
import { API_ENDPOINTS } from '../../apiConfig';
import { usePageTitle } from "../../hooks/usePageTitle";
import { isColorDark } from "./utils/colorUtils";

// Generate dynamic CSS custom properties
const generateThemeStyles = (themeColor) => {
  if (!themeColor) return {};
  
  const isDark = isColorDark(themeColor);
  
  return {
    '--theme-color': themeColor,
    '--theme-text': isDark ? '#ffffff' : '#000000',
    '--theme-text-secondary': isDark ? '#e5e7eb' : '#374151',
    '--theme-border': themeColor,
    '--theme-hover': `${themeColor}dd`, // Add slight transparency for hover
  };
};

const DuesPayPaymentFlow = () => {
  const { shortName } = useParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [payerData, setPayerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    matricNumber: '',
    faculty: '',
    department: '',
  });
    
  const [associationData, setAssociationData] = useState(null);
  const [paymentItems, setPaymentItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [proofFile, setProofFile] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // Registration error and loading state
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Transaction summary state
  const [transaction, setTransaction] = useState(null);

  // Error modal state
  const [modalError, setModalError] = useState({ open: false, title: "", message: "" });

  // Get theme color from association data
  const themeColor = associationData?.theme_color || '#9810fa';
  const isDarkTheme = isColorDark(themeColor);

  useEffect(() => {
    const fetchAssociation = async () => {
      setIsLoading(true);
      try {
        const res = await fetchWithTimeout(
          API_ENDPOINTS.GET_PAYMENT_ASSOCIATION(shortName),
          {},
          20000 // 20 seconds timeout for initial load
        );
        if (!res.ok) throw new Error('Failed to fetch association');
        const data = await res.json();
        setAssociationData(data);
        setPaymentItems(data.payment_items || []);
        setSelectedItems(
          (data.payment_items || [])
            .filter(item => item.status === 'compulsory')
            .map(item => item.id)
        );
      } catch (err) {
        setAssociationData(null);
        setPaymentItems([]);
        setSelectedItems([]);
        
        const { message } = handleFetchError(err);
        setModalError({
          open: true,
          title: "Error",
          message: message || "Oops! This item is unavailable. Check back later."
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (shortName) fetchAssociation();
  }, [shortName]);

  usePageTitle("Payment Flow - DuesPay");
  const steps = [
    { number: 1, title: "Registration", icon: User },
    { number: 2, title: "Payment Selection", icon: CreditCard },
    { number: 3, title: "Upload Receipt", icon: Upload },
    { number: 4, title: "Confirmation", icon: CheckCircle }
  ];

  const handleInputChange = (field, value) => {
    setPayerData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemSelection = (itemId) => {
    const item = paymentItems.find(i => i.id === itemId);
    if (item && item.status === 'compulsory') return;
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleFileUpload = (file) => {
    setProofFile(file);
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = paymentItems.find(p => p.id === itemId);
      return total + (item ? Number(item.amount) : 0);
    }, 0);
  };

  // --- Proof verification and transaction submission logic ---
  const verifyAndCreate = async () => {
    const formData = new FormData();
    formData.append('proof_file', proofFile);
    formData.append('association_short_name', associationData.association_short_name);
    formData.append('amount_paid', getTotalAmount());
    formData.append('payer', JSON.stringify(payerData));
    selectedItems.forEach(id => {
      formData.append('payment_item_ids', id);
    });

    try {
      const res = await fetchWithErrorModal(
        fetchWithTimeout(
          API_ENDPOINTS.VERIFY_AND_CREATE_TRANSACTION,
          {
            method: 'POST',
            body: formData,
          },
          50000 // 50 seconds timeout for file upload and verification
        ),
        (error) => {
          const { isTimeout, message } = handleFetchError(error);
          setModalError({
            open: true,
            title: isTimeout ? "Request Timeout" : "Error",
            message: message
          });
        }
      );
      return await res.json();
    } catch (err) {
      const { isTimeout, message } = handleFetchError(err);
      setModalError({
        open: true,
        title: isTimeout ? "Request Timeout" : "Error",
        message: message
      });
      return null;
    }
  };

  // --- Payer check logic for registration step ---
  const checkPayer = async () => {
    setRegError("");
    setRegLoading(true);
    try {
      const res = await fetchWithTimeout(
        API_ENDPOINTS.PAYER_CHECK,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            association_short_name: associationData.association_short_name,
            matric_number: payerData.matricNumber,
            email: payerData.email,
            phone_number: payerData.phoneNumber,
            first_name: payerData.firstName,
            last_name: payerData.lastName,
            faculty: payerData.faculty,
            department: payerData.department,
          }),
        },
        30000 // 30 seconds timeout for payer check
      );
      const data = await res.json();
      
      if (!res.ok) {
        // Handle field-specific errors (like validation errors)
        if (data && typeof data === 'object' && !data.success && !data.error) {
          // This is field validation errors like {"email": ["Invalid email"]}
          if (registrationStepRef.current?.setBackendErrors) {
            registrationStepRef.current.setBackendErrors(data);
          }
          setRegError("Please fix the errors below.");
        } else {
          // This is general error messages like "Phone number already belongs to another user"
          setRegError(data.error || "Registration error. Please check your details.");
        }
        setRegLoading(false);
        return false;
      }
      
      if (!data.success) {
        // Show the specific error message from backend
        setRegError(data.error || "Registration error. Please check your details.");
        setRegLoading(false);
        return false;
      }
      
      setRegError("");
      setRegLoading(false);
      return true;
    } catch (err) {
      const { message } = handleFetchError(err);
      setRegError(message);
      setRegLoading(false);
      return false;
    }
  };

  const registrationStepRef = useRef();
  const nextStep = async () => {
    if (currentStep === 1) {
      const validationError = registrationStepRef.current?.validate?.();
      if (validationError) {
        return;
      }
      if (!(await checkPayer())) return;
      setCurrentStep(currentStep + 1);
      return;
    }
    if (currentStep === 3) {
      setIsVerifying(true);
      let result = null;
      try {
        result = await verifyAndCreate();
        if (result && result.success) {
          setIsVerified(true);
          setTransaction({
            reference_id: result.reference_id,
            transaction_id: result.transaction_id,
            payer_name: `${payerData.firstName} ${payerData.lastName}`,
            items_paid: result.items_paid || [],
            total_amount: (result.items_paid || []).reduce(
              (sum, item) => sum + parseFloat(item.amount || 0),
              0
            ),
          });
          setCurrentStep(currentStep + 1);
        } else if (result === null) {
          // ErrorModal already shown, just stop loader
          // Optionally, you can set a custom error here if you want
        } else {
          setModalError({
            open: true,
            title: "Verification Error",
            message: (result && result.error) || "Verification or transaction failed."
          });
        }
      } catch (err) {
        const { isTimeout, message } = handleFetchError(err);
        setModalError({
          open: true,
          title: isTimeout ? "Request Timeout" : "Unknown Error",
          message: message
        });
      } finally {
        setIsVerifying(false);
      }
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return payerData.firstName && payerData.lastName && payerData.email && payerData.matricNumber && payerData.phoneNumber;
      case 2:
        return selectedItems.length > 0;
      case 3:
        return proofFile;
      default:
        return true;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegistrationStep
            ref={registrationStepRef}
            payerData={payerData}
            handleInputChange={handleInputChange}
            error={regError}
            loading={regLoading}
            associationData={associationData}
            themeColor={themeColor}
          />
        );
      case 2:
        return (
          <PaymentSelectionStep
            paymentItems={paymentItems}
            selectedItems={selectedItems}
            handleItemSelection={handleItemSelection}
            associationData={associationData}
            getTotalAmount={getTotalAmount}
            themeColor={themeColor}
          />
        );
      case 3:
        return (
          <UploadReceiptStep
            payerData={payerData}
            proofFile={proofFile}
            handleFileUpload={handleFileUpload}
            getTotalAmount={getTotalAmount}
            themeColor={themeColor}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            isVerified={isVerified}
            transaction={transaction}
            themeColor={themeColor}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
        Loading...
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
        <div className="mb-4">
          <svg 
            className="animate-spin h-12 w-12" 
            style={{ color: themeColor }}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
        <div>Verifying proof of payment...</div>
      </div>
    );
  }

  if (!associationData) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-red-500 dark:text-red-400">
          Page not found. Please check the URL or try again later.
        </div>
      </>
    );
  }

  // Generate dynamic theme styles
  const dynamicStyles = generateThemeStyles(themeColor);

  return (
    <>
      <ErrorModal
        open={modalError.open}
        onClose={() => setModalError({ ...modalError, open: false })}
        title={modalError.title}
        message={modalError.message}
      />

      <div 
        className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-1 sm:p-8 md:p-16"
        style={dynamicStyles}
      >
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl sm:rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 dark:border-slate-700">
          <Header
            associationData={associationData}
            steps={steps}
            currentStep={currentStep}
            themeColor={themeColor}
          />

          {/* Step Content */}
          <div className="sm:p-8 p-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              {currentStep > 1 && currentStep < 4 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium border border-gray-300 dark:border-slate-600"
                >
                  Previous
                </button>
              )}

              {currentStep < 4 && (
                <button
                  onClick={nextStep}
                  disabled={!canProceed() || isVerifying || regLoading}
                  className={`px-8 py-3 rounded-xl font-medium transition-all ml-auto ${
                    canProceed() && !isVerifying && !regLoading
                      ? 'text-white hover:shadow-lg transition-all'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed border border-gray-300 dark:border-slate-600'
                  }`}
                  style={
                    canProceed() && !isVerifying && !regLoading
                      ? {
                          backgroundColor: themeColor,
                          color: isDarkTheme ? '#ffffff' : '#000000',
                          boxShadow: `0 10px 25px ${themeColor}25`,
                        }
                      : {}
                  }
                >
                  {regLoading ? 'Checking...' : currentStep === 3 ? 'Submit' : 'Continue'}
                </button>
              )}

              {currentStep === 4 && isVerified && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 text-white rounded-xl hover:shadow-lg transition-all font-medium mx-auto"
                  style={{
                    backgroundColor: themeColor,
                    color: isDarkTheme ? '#ffffff' : '#000000',
                    boxShadow: `0 10px 25px ${themeColor}25`,
                  }}
                >
                  Make Another Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DuesPayPaymentFlow;