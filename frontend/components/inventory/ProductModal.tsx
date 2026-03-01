'use client';

import { useState, useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiX } from 'react-icons/fi';
import { Product } from '@/types';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';

const productSchema = z.object({
  sku: z.string().min(2, 'El SKU debe tener al menos 2 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'El precio debe ser mayor a 0')),
  stock: z.preprocess((val) => Number(val), z.number().min(0, 'El stock no puede ser negativo')),
  minStock: z.preprocess((val) => Number(val), z.number().min(0, 'El stock mínimo no puede ser negativo')),
  category: z.string().min(1, 'La categoría es requerida'),
  isAvailable: z.boolean(),
});

type ProductForm = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema) as Resolver<ProductForm>,
    defaultValues: {
      sku: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      minStock: 0,
      category: '',
      isAvailable: true,
    },
  });

  // Cargar categorías al montar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get<string[]>('/inventory/categories');
        setCategories(data);
      } catch {
        console.error('Error al cargar categorías');
      }
    };
    loadCategories();
  }, []);

  // Cargar SKU y datos cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return;

    const loadModalData = async () => {
      if (product) {
        reset({
          sku: product.sku,
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          stock: product.stock,
          minStock: product.minStock,
          category: product.category,
          isAvailable: product.isAvailable,
        });
      } else {
        reset({
          sku: '',
          name: '',
          description: '',
          price: 0,
          stock: 0,
          minStock: 0,
          category: '',
          isAvailable: true,
        });
        try {
          const { data } = await api.get<{ sku: string }>('/inventory/generate-sku');
          reset((prev) => ({ ...prev, sku: data.sku }));
        } catch {
          console.error('Error al generar SKU');
        }
      }
    };

    loadModalData();
  }, [isOpen, product, reset]);

  const onSubmit = async (data: ProductForm) => {
    setError(null);
    try {
      if (isEditing) {
        await api.put(`/inventory/${product.id}`, data);
      } else {
        await api.post('/inventory', data);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message;
      setError(Array.isArray(message) ? message[0] : message ?? 'Error al guardar el producto');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* SKU y Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium dark:text-gray-200">SKU</label>
              <input
                {...register('sku')}
                readOnly={isEditing}
                className={`border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isEditing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder="PROD-001"
              />
              {errors.sku && <span className="text-red-500 text-xs">{errors.sku.message}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium dark:text-gray-200">Categoría</label>
              <select
                {...register('category')}
                className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
            </div>
          </div>

          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium dark:text-gray-200">Nombre</label>
            <input
              {...register('name')}
              className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Laptop Dell"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium dark:text-gray-200">Descripción</label>
            <textarea
              {...register('description')}
              rows={2}
              className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descripción del producto..."
            />
          </div>

          {/* Precio, Stock, Stock mínimo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium dark:text-gray-200">Precio</label>
              <input
                {...register('price')}
                type="number"
                step="0.01"
                min="0"
                className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && <span className="text-red-500 text-xs">{errors.price.message}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium dark:text-gray-200">Stock</label>
              <input
                {...register('stock')}
                type="number"
                min="0"
                className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.stock && <span className="text-red-500 text-xs">{errors.stock.message}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium dark:text-gray-200">Stock mínimo</label>
              <input
                {...register('minStock')}
                type="number"
                min="0"
                className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.minStock && <span className="text-red-500 text-xs">{errors.minStock.message}</span>}
            </div>
          </div>

          {/* Disponible */}
          <div className="flex items-center gap-2">
            <input
              {...register('isAvailable')}
              type="checkbox"
              id="isAvailable"
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium dark:text-gray-200">
              Producto disponible
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-500 text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}