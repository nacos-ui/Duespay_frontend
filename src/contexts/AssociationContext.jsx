import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../apiConfig';
import { fetchWithTimeout } from '../utils/fetchUtils';

const AssociationContext = createContext();

export const useAssociation = () => {
  const context = useContext(AssociationContext);
  if (!context) {
    throw new Error('useAssociation must be used within an AssociationProvider');
  }
  return context;
};

export const AssociationProvider = ({ children }) => {
  const [association, setAssociation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssociation = async () => {
    try {
      const response = await fetchWithTimeout(API_ENDPOINTS.CREATE_ASSOCIATION, {
      }, 20000);

      const responseData = await response.json();
      if (response.ok) {
        const data = responseData.data;
        setAssociation(data);
      }
    } catch (error) {
      console.error('Failed to fetch association:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAssociation = (updatedData) => {
    setAssociation(updatedData);
  };

  const refreshAssociation = () => {
    setLoading(true);
    fetchAssociation();
  };

  useEffect(() => {
    fetchAssociation();
  }, []);

  return (
    <AssociationContext.Provider value={{
      association,
      loading,
      updateAssociation,
      refreshAssociation
    }}>
      {children}
    </AssociationContext.Provider>
  );
};