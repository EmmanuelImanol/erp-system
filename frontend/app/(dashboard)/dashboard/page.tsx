'use client';

import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { removeCookie } from '@/lib/cookies';
import Link from 'next/link';

// 👇 Función fuera del componente para leer el usuario
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser || storedUser === 'undefined') return null;
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const user = getStoredUser(); // 👈 sin useEffect ni useState

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    removeCookie('token');
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">ERP System</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.name} — {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">Bienvenido, {user?.name} 👋</h2>
        <p className="text-gray-500">Selecciona un módulo para comenzar</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Reemplaza la card de usuarios */}
          <Link href="/dashboard/users">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-lg font-semibold">👥 Usuarios</h3>
              <p className="text-gray-500 text-sm mt-1">Gestión de usuarios y roles</p>
            </div>
          </Link>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold">📦 Inventario</h3>
            <p className="text-gray-500 text-sm mt-1">Control de productos y stock</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold">💰 Ventas</h3>
            <p className="text-gray-500 text-sm mt-1">Órdenes y clientes</p>
          </div>
        </div>
      </div>
    </main>
  );
}