import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 space-y-4 p-3 sm:p-5">
        <button
          type="button"
          className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button>
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
