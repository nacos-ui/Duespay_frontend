import React, { createContext, useContext, useState } from 'react';
import ErrorModal from '../components/ErrorModal';

const ErrorContext = createContext();

export const useGlobalError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useGlobalError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [modalError, setModalError] = useState({
    open: false,
    title: '',
    message: '',
    buttonText: 'OK',
    onClose: null,
  });

  return (
    <ErrorContext.Provider value={{ setModalError }}>
      {children}
      <ErrorModal
        open={modalError.open}
        onClose={
          modalError.onClose
            ? modalError.onClose
            : () => setModalError({ ...modalError, open: false })
        }
        title={modalError.title}
        message={modalError.message}
        buttonText={modalError.buttonText}
      />
    </ErrorContext.Provider>
  );
};