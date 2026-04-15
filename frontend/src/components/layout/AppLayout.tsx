import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-5 space-y-4 bg-surface min-h-screen">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
