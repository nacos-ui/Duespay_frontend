import React, { useState, useEffect } from 'react';
import { X, Bell, Check, CheckCheck, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../apiConfig';
import Pagination from '../pages/Transactions/components/Pagination';
import { fetchWithTimeout, handleFetchError } from '../utils/fetchUtils'; 

const NotificationsModal = ({ isOpen, onClose, onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetchWithTimeout(`${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&page_size=${pageSize}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }, 10000); // 10 second timeout for fetching notifications
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.results);
        setCount(data.count);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      const errorInfo = handleFetchError(error);
      console.error('Error fetching notifications:', errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetchWithTimeout(`${API_ENDPOINTS.NOTIFICATIONS}${notificationId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      }, 8000); // 8 second timeout for marking as read
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        );
        // Notify parent component to update unread count
        onNotificationRead();
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      const errorInfo = handleFetchError(error);
      console.error('Error marking notification as read:', errorInfo.message);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAllRead(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetchWithTimeout(`${API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }, 10000); // 10 second timeout for marking all as read
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        // Notify parent component to update unread count
        onNotificationRead();
      } else {
        console.error('Failed to mark all notifications as read');
      }
    } catch (error) {
      const errorInfo = handleFetchError(error);
      console.error('Error marking all notifications as read:', errorInfo.message);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleViewTransactions = () => {
    navigate('/dashboard/transactions');
    onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0f111fbe] backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-[#181B2A] border border-[#23263A] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#23263A]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              disabled={markingAllRead}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors disabled:opacity-50"
            >
              <CheckCheck size={16} />
              {markingAllRead ? 'Marking...' : 'Mark All Read'}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#23263A] rounded text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No notifications found
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-4 rounded-lg border transition-colors ${
                    notification.is_read
                      ? 'bg-[#23263A] border-[#2D3142]'
                      : 'bg-purple-900/20 border-purple-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      <button
                        onClick={handleViewTransactions}
                        className="p-1 hover:bg-[#2D3142] rounded"
                        title="View transactions"
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                      </button>
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 hover:bg-[#2D3142] rounded"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-green-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-purple-600 rounded-full absolute right-2 top-2"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {count > pageSize && (
          <div className="border-t border-[#23263A] p-4">
            <Pagination
              count={count}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsModal;