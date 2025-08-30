import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, ArrowLeftRight, LogOut,
  Settings, User, X
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, to: '/dashboard/overview' },
    { label: 'Payment Items', icon: <Receipt className="w-5 h-5" />, to: '/dashboard/payment-items' },
    { label: 'Transactions', icon: <ArrowLeftRight className="w-5 h-5" />, to: '/dashboard/transactions' },
    { label: 'Students', icon: <User className="w-5 h-5" />, to: '/dashboard/students' },
  ];

  const logout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/auth'; // Redirect to login page
  };

  return (
    <div className="w-64 bg-gray-900 text-white border-r border-gray-800 min-h-screen p-4 flex flex-col justify-between shadow-2xl relative">
      {/* Close button for mobile */}
      {onClose && (
        <button
          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      <div>
        <div className="flex flex-col items-left justify-between pt-16">
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-4 rounded-3xl cursor-pointer
                  ${location.pathname === item.to ? 'bg-purple-700' : 'hover:bg-[#0F111F]'}`}
                onClick={onClose}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {/* Bottom: Settings */}
      <div>
        <div className="space-y-3">
          <div className="flex flex-col items-left justify-between pt-10">
            <h2 className="text-[#8C8C8C] font-sans font-semibold text-[16px] leading-6 mx-.5 mb-4">Settings</h2>
            <Link
              to="/settings"
              className={`flex items-center gap-2 px-3 py-4 rounded-3xl cursor-pointer
                ${location.pathname === '/settings' ? 'bg-purple-700' : 'hover:bg-[#0F111F]'}`}
              onClick={onClose}
            >
              <span><Settings className="w-5 h-5" /></span>
              <span>Settings</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-4 rounded-3xl cursor-pointer hover:bg-[#d12f2f6a] text-left w-full"
            >
              <span><LogOut className="w-5 h-5" /></span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}