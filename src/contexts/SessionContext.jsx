import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../apiConfig';
import { fetchWithTimeout, handleFetchError } from '../utils/fetchUtils';

const SessionContext = createContext(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [association, setAssociation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Fetch profile and current session
  const fetchProfile = async () => {
    try {
      console.log('SessionContext: Fetching profile...');
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log('SessionContext: No token found');
        return null;
      }

      const res = await fetchWithTimeout(API_ENDPOINTS.GET_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }, 15000);
      
      const responseData = await res.json();
      if (res.ok) {
        const data = responseData.data;
        console.log('SessionContext: Profile fetched successfully:', data);
        setProfile(data);
        
        // Check different possible locations for current session
        let currentSessionFromProfile = null;
        
        // Check various possible paths
        if (data.association?.current_session) {
          currentSessionFromProfile = data.association.current_session;
          console.log('SessionContext: Found current session in association.current_session:', currentSessionFromProfile);
        } else if (data.current_session) {
          currentSessionFromProfile = data.current_session;
          console.log('SessionContext: Found current session in root.current_session:', currentSessionFromProfile);
        } else if (data.sessions && data.sessions.length > 0) {
          // Find the active session from the sessions array
          const activeSession = data.sessions.find(session => session.is_active);
          if (activeSession) {
            currentSessionFromProfile = activeSession;
            console.log('SessionContext: Found active session in sessions array:', currentSessionFromProfile);
          } else {
            // If no active session, use the first session as fallback
            currentSessionFromProfile = data.sessions[0];
            console.log('SessionContext: Using first session as fallback:', currentSessionFromProfile);
          }
        }
        
        if (currentSessionFromProfile) {
          console.log('SessionContext: Setting current session from profile:', currentSessionFromProfile);
          setCurrentSession(currentSessionFromProfile);
        }
        
        return data;
      } else {
        console.error('SessionContext: Failed to fetch profile:', res.status, res.statusText);
        if (res.status === 401) {
          console.log('SessionContext: Unauthorized - clearing profile');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        setProfile(null);
      }
    } catch (err) {
      const errorInfo = handleFetchError(err);
      console.error('SessionContext: Failed to fetch profile:', errorInfo.message);
      setProfile(null);
    }
    return null;
  };

  // Fetch association data
  const fetchAssociation = async () => {
    try {
      console.log('SessionContext: Fetching association...');
      const token = localStorage.getItem("access_token");
      if (!token) return null;

      const res = await fetchWithTimeout(API_ENDPOINTS.GET_ASSOCIATION, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }, 15000);
      
      const responseData = await res.json();
      if (res.ok) {
        const data = responseData.data;
        const associationData = data.results?.[0] || null;
        console.log('SessionContext: Association fetched successfully:', associationData);
        setAssociation(associationData);
        return associationData;
      } else {
        console.error('SessionContext: Failed to fetch association:', res.status, res.statusText);
        setAssociation(null);
      }
    } catch (err) {
      const errorInfo = handleFetchError(err);
      console.error('SessionContext: Failed to fetch association:', errorInfo.message);
      setAssociation(null);
    }
    return null;
  };

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      console.log('SessionContext: Fetching sessions...');
      const token = localStorage.getItem("access_token");
      if (!token) return [];

      const res = await fetchWithTimeout(API_ENDPOINTS.GET_SESSIONS, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }, 15000);
      
      const responseData = await res.json();
      if (res.ok) {
        const data = responseData.data;
        console.log('SessionContext: Sessions fetched successfully:', data.results?.length || 0);
        const sessionsList = data.results || [];
        setSessions(sessionsList);
        
        // If we don't have a current session but have sessions available, set the first active one
        if (!currentSession && sessionsList.length > 0) {
          const activeSession = sessionsList.find(session => session.is_active);
          const sessionToSet = activeSession || sessionsList[0];
          if (sessionToSet) {
            console.log('SessionContext: Setting session from sessions list:', sessionToSet);
            setCurrentSession(sessionToSet);
          }
        }
        
        return sessionsList;
      } else {
        console.error('SessionContext: Failed to fetch sessions:', res.status, res.statusText);
        setSessions([]);
      }
    } catch (err) {
      const errorInfo = handleFetchError(err);
      console.error('SessionContext: Failed to fetch sessions:', errorInfo.message);
      setSessions([]);
    }
    return [];
  };

  // Set current session
  const setCurrentSessionById = async (sessionId) => {
    try {
      console.log('SessionContext: Setting current session to:', sessionId);
      const token = localStorage.getItem("access_token");
      const res = await fetchWithTimeout(API_ENDPOINTS.SET_CURRENT_SESSION(sessionId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }, 15000);

      const responseData = await res.json();
      if (res.ok) {
        const data = responseData.data;
        console.log('SessionContext: Set session response:', data);
        
        // Update current session
        const newSession = sessions.find(s => s.id === sessionId);
        if (newSession) {
          console.log('SessionContext: Found session in local sessions:', newSession);
          setCurrentSession(newSession);
          
          // Update profile with new current session
          setProfile(prev => ({
            ...prev,
            association: {
              ...prev?.association,
              current_session: newSession
            }
          }));
          
          // Trigger a custom event to notify other components
          window.dispatchEvent(new CustomEvent('sessionChanged', { 
            detail: { session: newSession }
          }));
          
          console.log('SessionContext: Session successfully updated');
          return true;
        }
      } else {
        console.error('SessionContext: Failed to set session:', res.status, res.statusText);
      }
    } catch (err) {
      const errorInfo = handleFetchError(err);
      console.error('SessionContext: Failed to set current session:', errorInfo.message);
    }
    return false;
  };

  // Create new session
  const createSession = async (sessionData) => {
    try {
      console.log('SessionContext: Creating session:', sessionData);
      const token = localStorage.getItem("access_token");
      const res = await fetchWithTimeout(API_ENDPOINTS.CREATE_SESSION, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      }, 20000);
      const responseData = await res.json();
      if (res.ok) {
        console.log('SessionContext: Session created successfully');
        // Refresh sessions list
        await fetchSessions();
        return { success: true, data: responseData.data };
      }
      console.error('SessionContext: Failed to create session:', responseData);
      return { success: false, error: responseData.message || responseData.detail || 'Failed to create session' };
    } catch (err) {
      const errorInfo = handleFetchError(err);
      console.error('SessionContext: Failed to create session:', errorInfo.message);
      return { success: false, error: errorInfo.message };
    }
  };

  // Public method to refresh all data
  const refreshData = async () => {
    console.log('SessionContext: Refreshing all data...');
    setLoading(true);
    
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log('SessionContext: No token for refresh');
      setLoading(false);
      return false;
    }

    try {
      // Fetch all data concurrently
      const [profileData, associationData, sessionsData] = await Promise.all([
        fetchProfile(),
        fetchAssociation(), 
        fetchSessions()
      ]);
      
      console.log('SessionContext: Data refresh complete:', { 
        profileLoaded: !!profileData, 
        associationLoaded: !!associationData,
        sessionsCount: sessionsData?.length || 0 
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('SessionContext: Error during data refresh:', error);
      setLoading(false);
      return false;
    }
  };

  // Initialize context
  useEffect(() => {
    const initializeSession = async () => {
      if (initialized) return; // Prevent double initialization
      
      console.log('SessionContext: Initializing session context...');
      setLoading(true);
      
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          // Small delay to ensure token refresh interceptor is ready
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Fetch all data concurrently
          const [profileData, associationData, sessionsData] = await Promise.all([
            fetchProfile(),
            fetchAssociation(),
            fetchSessions()
          ]);
          
          console.log('SessionContext: Initialization complete:', { 
            profileLoaded: !!profileData, 
            associationLoaded: !!associationData,
            sessionsCount: sessionsData?.length || 0 
          });
        } catch (error) {
          console.error('SessionContext: Error during initialization:', error);
        }
      } else {
        console.log('SessionContext: No access token found');
      }
      
      setLoading(false);
      setInitialized(true);
      console.log('SessionContext: Session context initialized');
    };

    initializeSession();
  }, []); // Remove dependencies to prevent re-initialization

  // Listen for storage changes (token updates)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        console.log('SessionContext: Token changed, refreshing data...');
        if (e.newValue && !loading) {
          refreshData();
        } else if (!e.newValue) {
          // Token was removed
          console.log('SessionContext: Token removed, clearing data');
          setProfile(null);
          setAssociation(null);
          setSessions([]);
          setCurrentSession(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loading]);

  const value = {
    currentSession,
    sessions,
    profile,
    association,
    loading,
    initialized,
    setCurrentSessionById,
    createSession,
    fetchProfile,
    fetchAssociation,
    fetchSessions,
    refreshData
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};