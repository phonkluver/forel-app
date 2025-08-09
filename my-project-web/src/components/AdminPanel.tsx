import React, { useState } from 'react';
import { AdminMenuManager } from './admin/AdminMenuManager';
import { AdminPromoBanners } from './admin/AdminPromoBanners';
import AdminCategoryManager from './admin/AdminCategoryManager';
import { Button } from './ui/button';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'menu' | 'banners' | 'categories'>('menu');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Админ-панель
          </h1>
          <p className="text-gray-600">
            Управление меню и промо-баннерами
          </p>
        </div>

        {/* Навигация по вкладкам */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'menu' ? 'default' : 'outline'}
            onClick={() => setActiveTab('menu')}
            className="px-6 py-2"
          >
            Управление меню
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
            className="px-6 py-2"
          >
            Категории
          </Button>
          <Button
            variant={activeTab === 'banners' ? 'default' : 'outline'}
            onClick={() => setActiveTab('banners')}
            className="px-6 py-2"
          >
            Промо-баннеры
          </Button>
        </div>

        {/* Контент вкладок */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'menu' && <AdminMenuManager />}
          {activeTab === 'categories' && <AdminCategoryManager />}
          {activeTab === 'banners' && <AdminPromoBanners />}
        </div>
      </div>
    </div>
  );
} 