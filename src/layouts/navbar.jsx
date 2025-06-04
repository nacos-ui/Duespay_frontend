import { Bell, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation } from "react-router-dom";

const navItems = [
  { label: 'Dashboard Overview', to: '/dashboard/overview' },
  { label: 'Payment Items Management', to: '/dashboard/payment-items' },
  { label: 'Transactions', to: '/dashboard/transactions' },
  { label: 'Students', to: '/dashboard/students' },
];

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const location = useLocation();

  // Find the current route's label for the center title
  const currentNav = navItems.find(item => location.pathname === item.to);
  const centerTitle = currentNav ? currentNav.label : "";

  return (
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
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="7" width="20" height="10" rx="2" fill="currentColor" className="text-purple-500" />
              <circle cx="17" cy="12" r="1.5" fill="white" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg" style={{ color: "#B983FF" }}>DuesPay</span>
        </div>

        {/* Center: Title (hide on small screens) */}
        <div className="text-white font-semibold text-base sm:text-lg mx-auto text-center flex-1 hidden sm:block">
          {centerTitle}
        </div>

        {/* Right: Icons and Avatar */}
        <div className="flex items-center gap-4 ml-auto">
          <Bell className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
          <Settings className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
          <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white cursor-pointer">
            A
          </div>
        </div>
      </div>
    </div>
  );
}