import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { User, CreditCard, Loader2 } from 'lucide-react';
import Header from './components/Header';
import RegistrationStep from './components/RegistrationStep';
import PaymentSelectionStep from './components/PaymentSelectionStep';
import ErrorModal from '../../components/ErrorModal';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils';
import { API_ENDPOINTS } from '../../apiConfig';
import { usePageTitle } from "../../hooks/usePageTitle";
import { isColorDark } from "./utils/colorUtils";
import NotFoundPage from '../404_page';
import { extractShortName } from '../../utils/getShortname';

// Helper: returns id if object, or the value if it's already a number/string
const pickId = (val) => {
  if (val == null) return null;
  return typeof val === 'object' ? (val.id ?? null) : val;
};

// Theme CSS vars
const generateThemeStyles = (themeColor) => {
  if (!themeColor) return {};
  return { '--theme-color': themeColor };
};

// Minimal sanitizer to avoid HTML special chars Korapay rejects
const sanitizeName = (name) => {
  if (!name) return '';
  // remove < > & " ' and collapse whitespace
  return String(name).replace(/[<>&"']/g, '').replace(/\s+/g, ' ').trim();
};

const DuesPayPaymentFlow = ({ shortName: propShortName }) => {
  const { shortName: pathShortName } = useParams();
  const shortName = propShortName || extractShortName({ pathShortName });

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

  const [payerId, setPayerId] = useState(null);
  const [referenceId, setReferenceId] = useState(null);

  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const [modalError, setModalError] = useState({ open: false, title: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  // Add loading for Pay Now
  const [payLoading, setPayLoading] = useState(false);

  const themeColor = associationData?.theme_color || '#9810fa';
  const isDarkTheme = isColorDark(themeColor);

  useEffect(() => {
    const fetchAssociation = async () => {
      setIsLoading(true);
      try {
        const res = await fetchWithTimeout(
          API_ENDPOINTS.GET_PAYMENT_ASSOCIATION(shortName),
          {},
          20000
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

  const handleItemSelection = (itemId) => {
    const item = paymentItems.find(i => i.id === itemId);
    if (item && item.status === 'compulsory') return;
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = paymentItems.find(p => p.id === itemId);
      return total + (item ? Number(item.amount) : 0);
    }, 0);
  };

  const registrationStepRef = useRef();

  // STEP 1: Payer check → save payer_id
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
            association_short_name: associationData?.association_short_name || shortName,
            matric_number: payerData.matricNumber,
            email: payerData.email,
            phone_number: payerData.phoneNumber,
            first_name: sanitizeName(payerData.firstName),
            last_name: sanitizeName(payerData.lastName),
            faculty: payerData.faculty,
            department: payerData.department,
          }),
        },
        30000
      );
      const data = await res.json();

      if (!res.ok || !data?.success) {
        if (data && typeof data === 'object' && !data.success && !data.error) {
          registrationStepRef.current?.setBackendErrors?.(data);
          setRegError("Please fix the errors below.");
        } else {
          setRegError(data?.error || "Registration error. Please check your details.");
        }
        setRegLoading(false);
        return false;
      }

      if (data?.payer_id) setPayerId(data.payer_id);
      if (!data?.payer_id && data?.data?.payer_id) setPayerId(data.data.payer_id);

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

  // STEP 3: Initiate payment → redirect to checkout_url
  const initiatePayment = async () => {
    try {
      setPayLoading(true);
      if (!payerId) throw new Error("Missing payer identifier.");

      // Use previous-style extraction + numeric support + fallback to first item
      const association_id =
        associationData?.association?.id ??
        associationData?.id ??
        associationData?.association_id ??
        (paymentItems?.[0]?.association ?? null);

      const session_id =
        pickId(associationData?.association?.current_session) ??
        pickId(associationData?.association?.active_session) ??
        pickId(associationData?.current_session) ??
        pickId(associationData?.active_session) ??
        pickId(associationData?.session) ??
        associationData?.session_id ??
        (paymentItems?.[0]?.session ?? null);

      if (!association_id || !session_id) {
        throw new Error("Missing association/session information.");
      }
      if (!selectedItems.length) {
        throw new Error("Please select at least one item.");
      }

      const endpoint = API_ENDPOINTS.PAYMENT_INITIATE;
      if (!endpoint || typeof endpoint !== 'string') {
        throw new Error("PAYMENT_INITIATE endpoint is not configured.");
      }

      // Build Korapay-friendly customer fields
      const payer_name = sanitizeName(
        `${payerData.firstName || ''} ${payerData.lastName || ''}`.trim()
      );
      const payer_email = String(payerData.email || '').trim();

      const res = await fetchWithTimeout(
        endpoint,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payer_id: payerId,
            association_id,
            session_id,
            payment_item_ids: selectedItems,
            payer_name,
            payer_email,
          }),
        },
        30000
      );

      // Try to parse any backend error payload for better context
      let data;
      try { data = await res.json(); } catch { data = null; }

      if (!res.ok || !data?.checkout_url || !data?.reference_id) {
        const backendMsg = data?.message || data?.detail || data?.error;
        throw new Error(backendMsg || "Failed to initiate payment.");
      }

      setReferenceId(data.reference_id);
      // Redirect to Korapay checkout
      window.location.href = data.checkout_url;
    } catch (err) {
      const { message } = handleFetchError(err);
      setModalError({
        open: true,
        title: "Payment Error",
        message,
      });
      setPayLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const validationError = registrationStepRef.current?.validate?.();
      if (validationError) return;
      if (!(await checkPayer())) return;
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      await initiatePayment();
      return;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          payerData.firstName &&
          payerData.lastName &&
          payerData.email &&
          payerData.matricNumber &&
          payerData.phoneNumber
        );
      case 2:
        return selectedItems.length > 0;
      default:
        return true;
    }
  };

  usePageTitle("Payment Flow - DuesPay");
  const steps = [
    { number: 1, title: "Registration", icon: User },
    { number: 2, title: "Payment Selection", icon: CreditCard },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
        Loading...
      </div>
    );
  }

  if (!associationData) {
    return <NotFoundPage message="This association does not exist or is not available." />;
  }

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
          <Header associationData={associationData} steps={steps} currentStep={currentStep} themeColor={themeColor} />
          <div className="sm:p-8 p-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
            {currentStep === 1 && (
              <RegistrationStep
                ref={registrationStepRef}
                payerData={payerData}
                handleInputChange={(f, v) => setPayerData(prev => ({ ...prev, [f]: v }))}
                error={regError}
                loading={regLoading}
                associationData={associationData}
                themeColor={themeColor}
              />
            )}
            {currentStep === 2 && (
              <PaymentSelectionStep
                paymentItems={paymentItems}
                selectedItems={selectedItems}
                handleItemSelection={handleItemSelection}
                associationData={associationData}
                getTotalAmount={getTotalAmount}
                themeColor={themeColor}
                // Hide any bank account details; using Korapay now
                hideBankDetails
              />
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium border border-gray-300 dark:border-slate-600"
                >
                  Previous
                </button>
              )}
              <button
                onClick={nextStep}
                disabled={!canProceed() || regLoading || payLoading}
                className={`px-8 py-3 rounded-xl font-medium transition-all ml-auto ${
                  canProceed() && !regLoading && !payLoading
                    ? 'text-white hover:shadow-lg transition-all'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed border border-gray-300 dark:border-slate-600'
                }`}
                style={
                  canProceed() && !regLoading && !payLoading
                    ? {
                        backgroundColor: themeColor,
                        color: isDarkTheme ? '#ffffff' : '#000000',
                        boxShadow: `0 10px 25px ${themeColor}25`,
                      }
                    : {}
                }
              >
                {currentStep === 1 ? (
                  'Continue'
                ) : (
                  <span className="inline-flex items-center gap-2">
                    {payLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {payLoading ? 'Redirecting…' : 'Pay Now'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DuesPayPaymentFlow;