'use client';

import { useCallback, useEffect, useState } from 'react';
import { Product } from '@/types';
import api from '@/lib/axios';
import { FiTrash2, FiEdit2, FiPlus, FiAlertTriangle, FiSearch } from 'react-icons/fi';
import ProductModal from '@/components/inventory/ProductModal';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false); // 👈 nuevo
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lowStockCount, setLowStockCount] = useState(0);

  const fetchProducts = useCallback(async (searchTerm?: string, categoryTerm?: string) => {
    try {
      // 👇 solo muestra loading completo la primera vez
      if (loading) {
        setLoading(true);
      } else {
        setSearching(true);
      }

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryTerm) params.append('category', categoryTerm);

      const { data } = await api.get<Product[]>(`/inventory?${params}`);
      setProducts(data);
    } catch {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [loading]);

  const fetchLowStock = useCallback(async () => {
    try {
      const { data } = await api.get<Product[]>('/inventory/low-stock');
      setLowStockCount(data.length);
    } catch {
      console.error('Error al cargar stock mínimo');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchLowStock();
  }, [fetchProducts, fetchLowStock]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchProducts(e.target.value, category);
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    fetchProducts(search, e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await api.delete(`/inventory/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      fetchLowStock();
    } catch {
      setError('Error al eliminar el producto');
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSuccess = () => {
    fetchProducts(search, category);
    fetchLowStock();
  };

  const categories = [...new Set(products.map((p) => p.category))];

  if (loading) return <p className="p-6 text-gray-500 dark:text-gray-400">Cargando productos...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Inventario</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Control de productos y stock</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus size={16} />
          Nuevo producto
        </button>
      </div>

      {/* Alerta stock mínimo */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg mb-6">
          <FiAlertTriangle size={18} />
          <span className="text-sm font-medium">
            {lowStockCount} producto{lowStockCount > 1 ? 's' : ''} con stock bajo el mínimo
          </span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-9 pr-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* 👇 spinner de búsqueda */}
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}
        </div>
        <select
          value={category}
          onChange={handleCategory}
          className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Categoría</th>
              <th className="px-6 py-3 text-left">Precio</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{product.sku}</td>
                <td className="px-6 py-4 font-medium dark:text-white">{product.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 dark:text-white">${Number(product.price).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${
                    product.stock <= product.minStock
                      ? 'text-red-500'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {product.stock}
                    {product.stock <= product.minStock && (
                      <FiAlertTriangle className="inline ml-1" size={12} />
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.isAvailable
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {product.isAvailable ? 'Disponible' : 'No disponible'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay productos registrados
          </p>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        product={selectedProduct}
      />
    </div>
  );
}