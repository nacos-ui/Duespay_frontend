import { useSession } from '../contexts/SessionContext';
import { useEffect } from "react";

// Create a global reference to the refresh function
let globalRefreshFunction = null;

// Hook to register the refresh function
export const useRegisterRefresh = () => {
  const { refreshData } = useSession();
  
  // Register the refresh function globally
  useEffect(() => {
    globalRefreshFunction = refreshData;
    return () => {
      globalRefreshFunction = null;
    };
  }, [refreshData]);
};

// Public function to trigger refresh from anywhere
export const triggerContextRefresh = async () => {
  if (globalRefreshFunction) {
    console.log('🔄 Triggering context refresh...');
    try {
      await globalRefreshFunction();
      console.log('✅ Context refresh completed');
      return true;
    } catch (error) {
      console.error('❌ Context refresh failed:', error);
      return false;
    }
  } else {
    console.warn('⚠️ Refresh function not available');
    return false;
  }
};