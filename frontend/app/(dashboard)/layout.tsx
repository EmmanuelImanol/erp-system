'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { removeCookie } from '@/lib/cookies';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: FiGrid },
  { label: 'Usuarios', href: '/dashboard/users', icon: FiUsers },
  { label: 'Inventario', href: '/dashboard/inventory', icon: FiPackage },
  { label: 'Ventas', href: '/dashboard/sales', icon: FiShoppingCart },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    removeCookie('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-sm transition-all duration-300 flex flex-col`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b">
          {isSidebarOpen && (
            <span className="text-xl font-bold text-blue-600">ERP System</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {isSidebarOpen && <span className="text-sm font-medium">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors w-full"
          >
            <FiLogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            {navItems.find((item) => item.href === pathname)?.label ?? 'Dashboard'}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              A
            </div>
            Admin
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
}