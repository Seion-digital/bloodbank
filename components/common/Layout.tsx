import React from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {user && showSidebar && (
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>
        )}
        <main className={`flex-1 ${user && showSidebar ? 'ml-0' : ''}`}>
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};