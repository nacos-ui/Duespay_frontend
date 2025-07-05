import { Bell, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTheme } from "../appComponents/ThemeContext";
import { Sun, Moon } from "lucide-react";

const navItems = [
  { label: 'Dashboard Overview', to: '/dashboard/overview' },
  { label: 'Payment Items Management', to: '/dashboard/payment-items' },
  { label: 'Transactions', to: '/dashboard/transactions' },
  { label: 'Students', to: '/dashboard/students' },
];

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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
          <Bell className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
          <Link to="/settings">
            <Settings className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
          </Link>
          <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white cursor-pointer">
            P
          </div>
        </div>
      </div>
    </div>
  );
}