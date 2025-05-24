// src/layouts/mainLayout.jsx
import Sidebar from './sidebar';
import Navbar from './navbar';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white relative">
      <Sidebar />
      <Navbar />
      <div className='flex flex-col flex-1 relative z-10'>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
