export const triggerSessionRefresh = {
  // Refresh everything
  all: () => {
    console.log('🔄 Triggering full session data refresh');
    window.dispatchEvent(new CustomEvent('refreshSessionData'));
  },
  
  // Refresh specific data
  association: () => {
    console.log('🏢 Triggering association data refresh');
    window.dispatchEvent(new CustomEvent('refreshAssociation'));
  },
  
  sessions: () => {
    console.log('📅 Triggering sessions data refresh');
    window.dispatchEvent(new CustomEvent('refreshSessions'));
  },
  
  profile: () => {
    console.log('👤 Triggering profile data refresh');
    window.dispatchEvent(new CustomEvent('refreshProfile'));
  },
  
  // Special combined events
  associationUpdated: () => {
    console.log('✨ Association updated - refreshing related data');
    window.dispatchEvent(new CustomEvent('associationUpdated'));
  }
};