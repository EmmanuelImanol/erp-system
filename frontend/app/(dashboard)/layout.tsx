'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiUsers, FiPackage, FiShoppingCart,
  FiGrid, FiLogOut, FiMenu, FiX,
} from 'react-icons/fi';
import { removeCookie } from '@/lib/cookies';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: FiGrid },
  { label: 'Usuarios', href: '/dashboard/users', icon: FiUsers },
  { label: 'Inventario', href: '/dashboard/inventory', icon: FiPackage },
  { label: 'Ventas', href: '/dashboard/sales', icon: FiShoppingCart },
];

// 👇 Fuera del componente principal
interface SidebarContentProps {
  pathname: string;
  onNavigate: () => void;
  onLogout: () => void;
}

function SidebarContent({ pathname, onNavigate, onLogout }: SidebarContentProps) {
  return (
    <>
      <nav className="flex-1 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors w-full"
        >
          <FiLogOut size={20} />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    removeCookie('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 bg-white shadow-sm flex-col shrink-0">
        <div className="px-4 py-5 border-b">
          <span className="text-xl font-bold text-blue-600">ERP System</span>
        </div>
        <SidebarContent
          pathname={pathname}
          onNavigate={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* Overlay mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-sm flex flex-col
        transition-transform duration-300 lg:hidden
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-4 py-5 border-b">
          <span className="text-xl font-bold text-blue-600">ERP System</span>
          <button onClick={() => setIsMobileSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>
        <SidebarContent
          pathname={pathname}
          onNavigate={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <FiMenu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-gray-700">
              {navItems.find((item) => item.href === pathname)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              A
            </div>
            <span className="hidden sm:block">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}