import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, CreditCard, Upload, CheckCircle } from 'lucide-react';
import Header from './components/Header';
import RegistrationStep from './components/RegistrationStep';
import PaymentSelectionStep from './components/PaymentSelectionStep';
import UploadReceiptStep from './components/UploadReceiptStep';
import ConfirmationStep from './components/ConfirmationStep';
import { API_ENDPOINTS } from '../../apiConfig';

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
  const [isVerifying, setIsVerifying] = useState(false); // <-- add this

  // Fetch association and payment items based on shortName
  useEffect(() => {
    const fetchAssociation = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.GET_PAYMENT_ASSOCIATION(shortName));
        if (!res.ok) throw new Error('Failed to fetch association');
        const data = await res.json();
        setAssociationData(data);
        setPaymentItems(data.payment_items || []);
        // Preselect compulsory items
        setSelectedItems(
          (data.payment_items || [])
            .filter(item => item.status === 'compulsory')
            .map(item => item.id)
        );
      } catch (err) {
        setAssociationData(null);
        setPaymentItems([]);
        setSelectedItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (shortName) fetchAssociation();
  }, [shortName]);

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
    if (item && item.status === 'compulsory') return; // Prevent unchecking compulsory
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
  const verifyProof = async (file) => {
    const formData = new FormData();
    formData.append('proof', file);

    const res = await fetch(API_ENDPOINTS.VERIFY_PROOF, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  };

  const submitTransaction = async () => {
    const formData = new FormData();
    formData.append('association_short_name', associationData.association_short_name);
    formData.append('amount_paid', getTotalAmount());
    formData.append('proof_of_payment', proofFile);
    formData.append('payer', JSON.stringify(payerData));
    formData.append('payment_item_ids', JSON.stringify(selectedItems));

    const res = await fetch(API_ENDPOINTS.CREATE_TRANSACTION, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  };

  const nextStep = async () => {
    if (currentStep === 3) {
      setIsVerifying(true); // Show roller
      // 1. Verify proof before submitting transaction
      const verification = await verifyProof(proofFile);
      setIsVerifying(false); // Hide roller
      if (!verification.verified) {
        alert(verification.error || "Verification failed. Please re-upload.");
        return;
      }
      // 2. If verified, submit transaction
      const result = await submitTransaction();
      if (result.success) {
        setIsVerified(true);
        setCurrentStep(currentStep + 1);
      } else {
        alert(result.error || "Transaction failed.");
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
        return payerData.firstName && payerData.lastName && payerData.email && payerData.matricNumber;
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
            payerData={payerData}
            handleInputChange={handleInputChange}
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
          />
        );
      case 3:
        return (
          <UploadReceiptStep
            payerData={payerData}
            proofFile={proofFile}
            handleFileUpload={handleFileUpload}
            getTotalAmount={getTotalAmount}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            isVerified={isVerified}
            getTotalAmount={getTotalAmount}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (isVerifying) {
    // Roller animation
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="mb-4">
          <svg className="animate-spin h-12 w-12 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">
        Page not found. Please check the URL or try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-700">
        <Header
          associationData={associationData}
          steps={steps}
          currentStep={currentStep}
        />

        {/* Step Content */}
        <div className="p-8 bg-slate-800 text-white">
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors font-medium border border-slate-600"
              >
                Previous
              </button>
            )}

            {currentStep < 4 && (
              <button
                onClick={nextStep}
                disabled={!canProceed() || isVerifying}
                className={`px-8 py-3 rounded-xl font-medium transition-all ml-auto ${
                  canProceed() && !isVerifying
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600'
                }`}
              >
                {currentStep === 3 ? 'Submit Payment' : 'Continue'}
              </button>
            )}

            {currentStep === 4 && isVerified && (
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all font-medium mx-auto"
              >
                Make Another Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuesPayPaymentFlow;