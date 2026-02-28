'use client';

import Link from 'next/link';
import { FiUsers, FiPackage, FiShoppingCart } from 'react-icons/fi';

const modules = [
  { label: 'Usuarios', description: 'Gestión de usuarios y roles', href: '/dashboard/users', icon: FiUsers, color: 'bg-blue-500' },
  { label: 'Inventario', description: 'Control de productos y stock', href: '/dashboard/inventory', icon: FiPackage, color: 'bg-green-500' },
  { label: 'Ventas', description: 'Órdenes y clientes', href: '/dashboard/sales', icon: FiShoppingCart, color: 'bg-purple-500' },
];

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Bienvenido 👋</h2>
      <p className="text-gray-500 mb-6">Selecciona un módulo para comenzar</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {modules.map(({ label, description, href, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4">
              <div className={`${color} p-3 rounded-lg text-white shrink-0`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold">{label}</h3>
                <p className="text-gray-500 text-sm">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}