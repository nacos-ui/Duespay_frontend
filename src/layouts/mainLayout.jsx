import Sidebar from './sidebar';
import Navbar from './navbar';
import React, { useState, useEffect } from 'react';
import { useRegisterRefresh } from '../utils/refreshContext'; // Add this import

export default function MainLayout({ children }) {
  // Register the refresh function
  useRegisterRefresh();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });

  const handleToggleSidebar = () => setSidebarOpen((open) => !open);

  useEffect(() => {
    const handleResize = () => {
      // Only force sidebar state on actual window resize, not route changes
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else if (window.innerWidth < 768 && sidebarOpen) {
        // Only close if currently open and switching to mobile
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F111F] text-white relative">
      {/* Desktop Sidebar: Always visible when open, takes up space in layout */}
      <div className={`hidden md:block transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} 
        ${sidebarOpen ? 'opacity-100' : 'opacity-0'} flex-shrink-0 overflow-hidden`}>
        <Sidebar onClose={() => {
          // Only close on desktop if explicitly requested (like close button)
          if (window.innerWidth < 768) setSidebarOpen(false);
        }} />
      </div>

      {/* Mobile Sidebar: Overlay on top of content */}
      <div className={`md:hidden fixed z-40 top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#0b0c164e] bg-opacity-40 z-30 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area - shifts based on sidebar state on desktop */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar spans the remaining width */}
        <Navbar onToggleSidebar={handleToggleSidebar} />
        
        {/* Main content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}