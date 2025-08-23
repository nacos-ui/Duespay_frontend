import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { User, CreditCard, Loader2, ArrowRight, ArrowLeft, CheckCircle, Mail, Phone, MessageCircle, Receipt, ExternalLink } from 'lucide-react';
import Header from './components/Header';
import RegistrationStep from './components/RegistrationStep';
import PaymentSelectionStep from './components/PaymentSelectionStep';
import PaymentStatusStep from './components/PaymentStatusStep';
import ErrorModal from '../../components/ErrorModal';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils';
import { API_ENDPOINTS } from '../../apiConfig';
import { usePageBranding } from "../../hooks/usePageBranding";
import { isColorDark } from "./utils/colorUtils";
import NotFoundPage from '../404_page';
import { extractShortName } from '../../utils/getShortname';

// Helper: returns id if object, or the value if it's already a number/string
const pickId = (val) => {
  if (val == null) return null;
  return typeof val === 'object' ? (val.id ?? null) : val;
};

// Theme CSS vars with gradients
const generateThemeStyles = (themeColor) => {
  if (!themeColor) return {};
  
  // Create lighter and darker variations
  const lightColor = `${themeColor}20`;
  const darkColor = `${themeColor}80`;
  
  return { 
    '--theme-color': themeColor,
    '--theme-light': lightColor,
    '--theme-dark': darkColor,
  };
};

// Minimal sanitizer to avoid HTML special chars Korapay rejects
const sanitizeName = (name) => {
  if (!name) return '';
  return String(name).replace(/[<>&"']/g, '').replace(/\s+/g, ' ').trim();
};

const DuesPayPaymentFlow = ({ shortName: propShortName }) => {
  const { shortName: pathShortName } = useParams();
  const shortName = propShortName || extractShortName({ pathShortName });
  
  // Get URL search params without using useSearchParams hook
  const urlParams = new URLSearchParams(window.location.search);
  const paymentReference = urlParams.get('reference');
  const paymentStatus = urlParams.get('status');

  const [currentStep, setCurrentStep] = useState(paymentReference ? 3 : 1);
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
  const [referenceId, setReferenceId] = useState(paymentReference || null);

  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const [modalError, setModalError] = useState({ open: false, title: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [paymentStatusData, setPaymentStatusData] = useState(null);

  const themeColor = associationData?.theme_color || '#9810fa';
  const isDarkTheme = isColorDark(themeColor);

  // Dynamic page branding with favicon
  usePageBranding({
    title: currentStep === 1 ? "Registration" : 
           currentStep === 2 ? "Payment Selection" : 
           "Payment Status",
    faviconUrl: associationData?.logo_url,
    associationName: associationData?.association_name
  });

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

  // Fetch payment status if we have a reference
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!referenceId) return;
      
      setStatusLoading(true);
      try {
        const res = await fetchWithTimeout(
          API_ENDPOINTS.PAYMENT_STATUS(referenceId),
          {},
          15000
        );
        if (res.ok) {
          const data = await res.json();
          setPaymentStatusData(data);
        } else {
          throw new Error('Failed to fetch payment status');
        }
      } catch (err) {
        const { message } = handleFetchError(err);
        setModalError({
          open: true,
          title: "Status Error",
          message: message || "Could not fetch payment status"
        });
      } finally {
        setStatusLoading(false);
      }
    };

    if (currentStep === 3) {
      fetchPaymentStatus();
    }
  }, [referenceId, currentStep]);

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

  // STEP 2: Initiate payment → redirect to checkout_url
  const initiatePayment = async () => {
    try {
      setPayLoading(true);
      if (!payerId) throw new Error("Missing payer identifier.");

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

      let data;
      try { data = await res.json(); } catch { data = null; }

      if (!res.ok || !data?.checkout_url || !data?.reference_id) {
        const backendMsg = data?.message || data?.detail || data?.error;
        throw new Error(backendMsg || "Failed to initiate payment.");
      }

      setReferenceId(data.reference_id);
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
    if (currentStep > 1 && currentStep < 3) setCurrentStep(currentStep - 1);
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
        return false;
    }
  };

  const formatTotal = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const viewReceipt = () => {
    if (referenceId) {
      window.open(`/receipt/${referenceId}`, '_blank');
    }
  };

  const steps = [
    { number: 1, title: "Payer Information", icon: User },
    { number: 2, title: "Payment Selection", icon: CreditCard },
    { number: 3, title: "Payment Status", icon: Receipt },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: themeColor }} />
          <p>Loading association details...</p>
        </div>
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
        className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-blue-900"
        style={dynamicStyles}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-white via-purple-50 to-blue-50 dark:from-slate-800 dark:via-purple-900 dark:to-blue-900 shadow-sm border-b border-gray-200/50 dark:border-slate-700/50">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(45deg, ${themeColor}20, transparent 50%, ${themeColor}20)`
          }}></div>
          <div className="relative max-w-6xl mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={associationData.logo_url}
                    alt={associationData.association_name + " logo"}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 sm:border-2 shadow-sm"
                    style={{ borderColor: themeColor }}
                  />
                  {/* <div className="absolute -inset-1 rounded-full opacity-20 blur-sm" 
                       style={{ backgroundColor: themeColor }}></div> */}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {associationData.association_name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 capitalize truncate">
                    {associationData.association_type} • {associationData.association_short_name || shortName}
                  </p>
                </div>
              </div>
              
              {/* Support Links - Desktop only */}
              <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                <a
                  href="mailto:support@duespay.com"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-800/80 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-all hover:shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  Support
                </a>
                <a
                  href="tel:+2349034049655"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-800/80 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-all hover:shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          {/* Conditional layout: 2-column for steps 1&2, single column for step 3 */}
          <div className={`grid gap-6 sm:gap-8 ${currentStep < 3 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
            
            {/* Main Content */}
            <div className={`space-y-6 sm:space-y-8 ${currentStep < 3 ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'}`}>
              {/* Progress Steps with enhanced design */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 dark:border-slate-700/50 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Payment Process
                  </h2>
                  <div className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white font-medium" style={{ backgroundColor: themeColor }}>
                    Step {currentStep} of {steps.length}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep >= step.number;
                    const isCurrent = currentStep === step.number;
                    const isCompleted = currentStep > step.number;
                    
                    return (
                      <div key={step.number} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div 
                            className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 sm:border-3 transition-all duration-500 ${
                              isActive 
                                ? 'border-current text-white shadow-md' 
                                : 'border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500'
                            }`}
                            style={isActive ? { 
                              backgroundColor: themeColor, 
                              borderColor: themeColor,
                              boxShadow: `0 8px 25px ${themeColor}40`
                            } : {}}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                            ) : (
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                            )}
                            {isCurrent && (
                              <div className="absolute -inset-2 rounded-full opacity-30 animate-pulse" 
                                   style={{ backgroundColor: themeColor }}></div>
                            )}
                          </div>
                          <div className="mt-2 sm:mt-3 text-center">
                            <p className={`text-xs sm:text-sm font-semibold ${
                              isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400'
                            }`}>
                              <span className="hidden sm:inline">{step.title}</span>
                              <span className="sm:hidden">{step.title.split(' ')[0]}</span>
                            </p>
                          </div>
                        </div>
                        
                        {index < steps.length - 1 && (
                          <div className="flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 lg:mx-6 mt-5 sm:mt-6 lg:mt-7 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-600">
                            <div 
                              className={`h-full transition-all duration-700 ${
                                currentStep > step.number 
                                  ? 'w-full' 
                                  : 'w-0'
                              }`}
                              style={currentStep > step.number ? { backgroundColor: themeColor } : {}}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content with gradient background */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
                <div className="h-2" style={{ 
                  background: `linear-gradient(90deg, ${themeColor}, ${themeColor}80, ${themeColor})` 
                }}></div>
                <div className="p-4 sm:p-6 lg:p-8">
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
                      hideBankDetails
                    />
                  )}
                  {currentStep === 3 && (
                    <PaymentStatusStep
                      referenceId={referenceId}
                      paymentStatus={paymentStatus}
                      statusData={paymentStatusData}
                      loading={statusLoading}
                      themeColor={themeColor}
                      onViewReceipt={viewReceipt}
                    />
                  )}
                </div>
              </div>

              {/* Navigation - only show for steps 1 and 2 */}
              {currentStep < 3 && (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 dark:border-slate-700/50 p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    {currentStep > 1 ? (
                      <button
                        onClick={prevStep}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-all hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl"
                      >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        Previous
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      onClick={nextStep}
                      disabled={!canProceed() || regLoading || payLoading}
                      className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                        canProceed() && !regLoading && !payLoading
                          ? 'text-white shadow-xl hover:shadow-2xl transform hover:scale-105'
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed'
                      }`}
                      style={
                        canProceed() && !regLoading && !payLoading
                          ? {
                              background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                              boxShadow: `0 10px 30px ${themeColor}40`,
                            }
                          : {}
                      }
                    >
                      {payLoading && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />}
                      {currentStep === 1 ? (
                        <>
                          {regLoading ? 'Checking...' : (
                            <>
                              <span className="hidden sm:inline">Continue to Payment</span>
                              <span className="sm:hidden">Continue</span>
                            </>
                          )}
                          {!regLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </>
                      ) : (
                        <>
                          {payLoading ? 'Redirecting...' : (
                            <>
                              <span className="hidden sm:inline">Proceed to Payment</span>
                              <span className="sm:hidden">Pay Now</span>
                            </>
                          )}
                          {!payLoading && <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - only show for steps 1 and 2 */}
            {currentStep < 3 && (
              <div className="space-y-6">
                {/* Payment Summary with gradient */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
                  <div className="h-1" style={{ 
                    background: `linear-gradient(90deg, ${themeColor}, ${themeColor}60)` 
                  }}></div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: themeColor }} />
                      Payment Summary
                    </h3>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {selectedItems.map(itemId => {
                        const item = paymentItems.find(p => p.id === itemId);
                        if (!item) return null;
                        return (
                          <div key={itemId} className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-600 border border-gray-100 dark:border-slate-600">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                                {item.title}
                              </p>
                              <p className="text-xs px-2 py-1 rounded-full text-white capitalize text-center mt-1 inline-block" 
                                 style={{ backgroundColor: item.status === 'compulsory' ? '#ef4444' : themeColor }}>
                                {item.status}
                              </p>
                            </div>
                            <p className="text-lg sm:text-xl font-bold ml-2" style={{ color: themeColor }}>
                              ₦{item.amount.toLocaleString()}
                            </p>
                          </div>
                        );
                      })}
                      
                      {selectedItems.length === 0 && (
                        <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-slate-400">
                          <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-30" />
                          <p className="text-base sm:text-lg">No items selected</p>
                          <p className="text-xs sm:text-sm">Please select payment items to continue</p>
                        </div>
                      )}
                    </div>

                    {selectedItems.length > 0 && (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-dashed border-gray-200 dark:border-slate-600">
                        <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl" 
                             style={{ backgroundColor: `${themeColor}10` }}>
                          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            Total Amount
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold" style={{ color: themeColor }}>
                            {formatTotal(getTotalAmount())}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 sm:mt-3 text-center">
                          * Gateway processing fees may be added at checkout
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Support Links - Show on mobile and tablet, hide on desktop */}
                <div className="lg:hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 dark:border-slate-700/50 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: themeColor }} />
                    Need Help?
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="mailto:support@duespay.com"
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 hover:shadow-md transition-all"
                    >
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: themeColor }} />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Email Support</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate">support@duespay.com</p>
                      </div>
                    </a>
                    <a
                      href="tel:+2349034049655"
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 hover:shadow-md transition-all"
                    >
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: themeColor }} />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Phone Support</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate">+234 903 404 9655</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DuesPayPaymentFlow;