import React, { useState } from 'react';
import { X, Calendar, Mail, Settings, Plus, FileText } from 'lucide-react';
import { useSession } from '../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileModal({ isOpen, onClose }) {
  const { profile, association, currentSession, sessions, setCurrentSessionById, loading } = useSession();
  const [switchingSession, setSwitchingSession] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  if (!isOpen || !profile) return null;

  const handleSessionChange = async (sessionId) => {
    if (sessionId === currentSession?.id) return;
    
    setSwitchingSession(true);
    const success = await setCurrentSessionById(sessionId);
    setSwitchingSession(false);
    
    if (success) {
      // Brief delay to show success, then close modal
      setTimeout(() => {
        onClose();
        // Force page reload to refresh all data
        window.location.reload();
      }, 500);
    }
  };

  const handleNewSession = () => {
    navigate('/dashboard/sessions/new');
    onClose();
  };

  const handleGenerateReport = () => {
    navigate('/dashboard/reports');
    onClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    onClose();
  };

  const logoUrl = association?.logo_url;
  const associationName = association?.association_name || 'Association';
  const shortName = association?.association_short_name || 'A';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#23263A] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white">Association Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Association Info */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-white overflow-hidden">
              {logoUrl && !imageError ? (
                <img
                  src={logoUrl}
                  alt={`${associationName} logo`}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => {
                    console.log('ProfileModal: Image failed to load:', logoUrl);
                    setImageError(true);
                  }}
                  onLoad={() => setImageError(false)}
                />
              ) : (
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full w-full h-full flex items-center justify-center font-bold text-2xl">
                  {shortName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {associationName}
            </h3>
            <p className="text-sm text-gray-400">
              {shortName} • {association?.Association_type || 'Association'}
            </p>
          </div>

          {/* Current Session */}
          <div className="bg-[#0F111F] rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-300">Current Session</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {currentSession?.title || 'No active session'}
            </p>
            {currentSession?.start_date && (
              <p className="text-sm text-gray-400 mt-1">
                Started: {new Date(currentSession.start_date).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Admin Details */}
          <div className="bg-[#0F111F] rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Mail className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-300">Admin Email</span>
            </div>
            <p className="text-white">{profile?.admin?.email}</p>
          </div>

          {/* Session Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Switch Session
            </label>
            <select
              value={currentSession?.id || ''}
              onChange={(e) => handleSessionChange(parseInt(e.target.value))}
              disabled={switchingSession || loading}
              className="w-full px-3 py-2 bg-[#0F111F] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a session</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} {session.is_active ? '(Active)' : ''}
                </option>
              ))}
            </select>
            {switchingSession && (
              <p className="text-sm text-purple-400 mt-1">Switching session...</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleNewSession}
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Session
            </button>

            <button
              onClick={handleGenerateReport}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </button>

            <button
              onClick={handleSettings}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}