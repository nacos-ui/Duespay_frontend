import React, { useState, useEffect } from "react";
import { Calendar, Edit, Plus, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "../../../contexts/SessionContext";
import { API_ENDPOINTS } from "../../../apiConfig";
import StatusMessage from "../../../components/StatusMessage";
import { fetchWithTimeout, handleFetchError } from "../../../utils/fetchUtils";
import SettingsCardSkeleton from "./SettingsCardSkeleton";
import { Link } from "react-router-dom";

export default function SessionManagementCard() {
  const { sessions, currentSession, fetchSessions, setCurrentSessionById, loading: contextLoading } = useSession();
  const [cardLoading, setCardLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingSession, setEditingSession] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editForm, setEditForm] = useState({
    title: '',
    start_date: '',
    end_date: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 3;

  // Calculate pagination
  const totalPages = Math.ceil(sessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const endIndex = startIndex + sessionsPerPage;
  const currentSessions = sessions.slice(startIndex, endIndex);

  // Handle initial loading - show skeleton for a brief moment like other cards
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800); // Brief loading time like other cards

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (editingSession) {
      setEditForm({
        title: editingSession.title || '',
        start_date: editingSession.start_date || '',
        end_date: editingSession.end_date || ''
      });
    }
  }, [editingSession]);

  const handleEdit = (session) => {
    setEditingSession(session);
    setMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setEditForm({ title: '', start_date: '', end_date: '' });
  };

  const handleSaveEdit = async () => {
    if (!editForm.title.trim()) {
      setMessage({ type: 'error', text: 'Session title is required.' });
      return;
    }

    setCardLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetchWithTimeout(API_ENDPOINTS.UPDATE_SESSION(editingSession.id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editForm.title.trim(),
          start_date: editForm.start_date || null,
          end_date: editForm.end_date || null
        }),
      }, 15000);

      if (res.ok) {
        setMessage({ type: 'success', text: 'Session updated successfully!' });
        setEditingSession(null);
        await fetchSessions(); // Refresh sessions list
      } else {
        const error = await res.json();
        setMessage({ 
          type: 'error', 
          text: error.title?.[0] || error.detail || 'Failed to update session.' 
        });
      }
    } catch (error) {
      const errorInfo = handleFetchError(error);
      setMessage({ 
        type: 'error', 
        text: errorInfo.message || 'Failed to update session.' 
      });
    } finally {
      setCardLoading(false);
    }
  };

  const handleSetActive = async (sessionId) => {
    setCardLoading(true);
    try {
      const success = await setCurrentSessionById(sessionId);
      if (success) {
        setMessage({ type: 'success', text: 'Current session updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to set current session.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to set current session.' });
    } finally {
      setCardLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setEditingSession(null); // Cancel any editing when changing pages
  };

  // Auto-clear messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Show skeleton loader during initial loading or context loading
  if (initialLoading || contextLoading) {
    return <SettingsCardSkeleton />;
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 min-h-[260px] min-w-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-purple-400">
            <Calendar className="w-5 h-5" />
          </span>
          Session Management
        </h2>
        <Link
          to="/dashboard/sessions/new"
          className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Session
        </Link>
      </div>

      {message.text && (
        <StatusMessage type={message.type}>
          {message.text}
        </StatusMessage>
      )}

      <div className="space-y-4">
        {currentSessions.map((session) => (
          <div key={session.id} className="bg-[#23263A] rounded-lg p-4">
            {editingSession?.id === session.id ? (
              // Edit Mode
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Session Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-3 py-2 bg-[#0F111F] border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editForm.start_date}
                      onChange={(e) => setEditForm({...editForm, start_date: e.target.value})}
                      className="w-full px-3 py-2 bg-[#0F111F] border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editForm.end_date}
                      onChange={(e) => setEditForm({...editForm, end_date: e.target.value})}
                      min={editForm.start_date}
                      className="w-full px-3 py-2 bg-[#0F111F] border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleSaveEdit}
                    disabled={cardLoading}
                    className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {cardLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={cardLoading}
                    className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{session.title}</h3>
                    {session.id === currentSession?.id && (
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    {session.start_date && (
                      <p>Start: {new Date(session.start_date).toLocaleDateString()}</p>
                    )}
                    {session.end_date && (
                      <p>End: {new Date(session.end_date).toLocaleDateString()}</p>
                    )}
                    <p>Created: {new Date(session.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(session)}
                    className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                    title="Edit session"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {session.id !== currentSession?.id && (
                    <button
                      onClick={() => handleSetActive(session.id)}
                      disabled={cardLoading}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                    >
                      Set Active
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {sessions.length === 0 && !contextLoading && !initialLoading && (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No sessions found. Create your first session to get started.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600">
          <p className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, sessions.length)} of {sessions.length} sessions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentPage === index + 1
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}