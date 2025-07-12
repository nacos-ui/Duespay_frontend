import { Bell, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTheme } from "../appComponents/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import NotificationsModal from "./NotificationsModal";
import { API_ENDPOINTS } from "../apiConfig";

const navItems = [
  { label: 'Dashboard Overview', to: '/dashboard/overview' },
  { label: 'Payment Items Management', to: '/dashboard/payment-items' },
  { label: 'Transactions', to: '/dashboard/transactions' },
  { label: 'Students', to: '/dashboard/students' },
];

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Find the current route's label for the center title
  const currentNav = navItems.find(item => location.pathname === item.to);
  const centerTitle = currentNav ? currentNav.label : "";

  useEffect(() => {
    fetchUnreadCount();
    // Set up interval to check for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(API_ENDPOINTS.UNREAD_NOTIFICATIONS_COUNT, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleNotificationRead = () => {
    fetchUnreadCount();
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[64px] flex items-center justify-between bg-gray-900 px-6 z-50 shadow">
        <div className="flex items-center w-full">
          {/* Sidebar toggle icon and Logo */}
          <button
            className="mr-3 flex items-center justify-center focus:outline-none"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            {/* Show open/close icon based on sidebar state */}
            {sidebarOpen ? (
              <PanelLeftClose className="w-6 h-6 text-white" />
            ) : (
              <PanelLeftOpen className="w-6 h-6 text-white" />
            )}
          </button>
          <div className="flex items-center gap-0.5">
            <div className="rounded-lg">
              <img
                src="/Duespay_logo.png"
                alt="DuesPay Logo"
                className="h-7 w-7 rounded-lg object-cover bg-white"
              />
            </div>
            <span className="text-white font-bold text-lg" style={{ color: "#ffffff" }}>uesPay</span>
          </div>

          {/* Center: Title (hide on small screens) */}
          <div className="text-white font-semibold text-base sm:text-lg mx-auto text-center flex-1 hidden sm:block">
            {centerTitle}
          </div>

          {/* Right: Icons and Avatar */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={toggleTheme}
              className="bg-slate-800 text-white p-2 rounded-full shadow hover:bg-slate-700 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Notifications Button */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 hover:bg-gray-800 rounded-full transition"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5 text-gray-300 hover:text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <Link to="/settings">
              <Settings className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
            </Link>
            <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white cursor-pointer">
              P
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNotificationRead={handleNotificationRead}
      />
    </>
  );
}