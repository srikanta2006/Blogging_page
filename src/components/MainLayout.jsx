// src/components/MainLayout.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function MainLayout() {
  return (
    <div className="min-h-screen font-sans bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet /> {/* This is where the protected pages will be rendered */}
      </main>
    </div>
  );
}

export default MainLayout;
