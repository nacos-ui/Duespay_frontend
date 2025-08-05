import React, { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import ProfileModal from './ProfileModal';

export default function ProfileAvatar() {
  const { profile, association, loading, initialized } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Show loading state until context is initialized
  if (!initialized || loading) {
    return (
      <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white cursor-pointer animate-pulse">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white cursor-pointer">
        A
      </div>
    );
  }

  const logoUrl = association?.logo_url;
  const associationName = association?.association_name || 'Association';
  const shortName = association?.association_short_name || profile?.admin?.first_name?.charAt(0) || 'A';
  
  console.log('ProfileAvatar: Association from context:', association);
  console.log('ProfileAvatar: Logo URL:', logoUrl);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all duration-200 overflow-hidden bg-white"
        title={`${associationName} Profile`}
      >
        {logoUrl && !imageError ? (
          <img
            src={logoUrl}
            alt={`${associationName} logo`}
            className="w-full h-full rounded-full object-cover"
            onError={() => {
              console.log('ProfileAvatar: Image failed to load:', logoUrl);
              setImageError(true);
            }}
            onLoad={() => {
              console.log('ProfileAvatar: Image loaded successfully:', logoUrl);
              setImageError(false);
            }}
          />
        ) : (
          <div className="bg-purple-600 w-full h-full rounded-full flex items-center justify-center font-bold text-white">
            {shortName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {showModal && (
        <ProfileModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}