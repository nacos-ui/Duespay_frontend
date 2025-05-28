import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, ArrowLeftRight, LogOut,
  Settings, User, X
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, to: '/dashboard' },
    { label: 'Payment Items', icon: <Receipt className="w-5 h-5" />, to: '/dashboard/payment-items' },
    { label: 'Transactions', icon: <ArrowLeftRight className="w-5 h-5" />, to: '/dashboard/transactions' },
    { label: 'Students', icon: <User className="w-5 h-5" />, to: '/dashboard/students' },
  ];

  const settingsItems = [
    { label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { label: 'Logout', icon: <LogOut className="w-5 h-5" /> },
  ];

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
        <div className="flex flex-col items-left justify-between pt-10">
          <h2 className="text-[#8C8C8C] font-sans font-semibold text-[16px] leading-6 mx-.5 mb-4">Overview</h2>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-5 rounded-4xl cursor-pointer
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
            {settingsItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-4 py-5 rounded-4xl hover:bg-gray-900 cursor-pointer">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}