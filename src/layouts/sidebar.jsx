import { Link, useLocation } from "react-router-dom";
import logo from '../assets/logo.png'; // Adjust the path as needed
import {
  Home, Compass, Package, Handshake, BarChart2, Bot,
  Settings, User, Menu
} from 'lucide-react';



export default function Sidebar() {
  
  const navItems = [
    { label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { label: 'Inventory', icon: <Package className="w-5 h-5" /> },
    { label: 'Sponsorship Hub', icon: <Handshake className="w-5 h-5" /> },
    { label: 'Live Match Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { label: 'Doola AI', icon: <Bot className="w-5 h-5" /> },
  ];

  const settingsItems = [
    { label: 'Settings',icon: <Settings className="w-5 h-5" />  },
    { label: 'Profile',icon: <User className="w-5 h-5" />  },
  ];




  return (
    <div className="relative w-64 bg-[#0F111F] text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-6"><img src={logo} alt="Logo" className="h-8 w-auto" /></h1>

        <div className="flex flex-col items-left justify-between pt-10">
          <h2 className="text-[#8C8C8C] font-sans font-semibold text-[16px] leading-6 mx-.5 mb-4">Overview</h2>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-4 py-5 rounded-4xl hover:bg-[#2A2A2A] cursor-pointer">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
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
              <div key={item.label} className="flex items-center gap-2 px-4 py-5 rounded-4xl hover:bg-[#2A2A2A] cursor-pointer">
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
