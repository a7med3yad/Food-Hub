// src/pages/MenuPage.jsx
// صفحة عرض قائمة المطعم
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MenuItemCard from '../components/MenuItemCard';

const MenuPage = () => {
  const { restaurantId } = useParams();
  const {
    restaurants,
    menuItems,
    selectedCategory,
    setSelectedCategory,
    showToast,
    getRestaurantRating
  } = useAppContext();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // بنلاقي المطعم من الـ ID
  const restaurant = restaurants.find(r => r.id === restaurantId);

  // بنحسب التقييم المتوسط للمطعم
  const { average: restAvg, count: restCount } = restaurant
    ? getRestaurantRating(restaurant.id)
    : { average: 0, count: 0 };

  // بنجيب الفئات بتاعة المطعم
  const categories = restaurant ? ['all', ...restaurant.categories] : [];

  // بنفلتر الأصناف حسب الفئة والبحث
  const filteredItems = useMemo(() => {
    if (!restaurant) return [];
    // بنفلتر الأصناف اللي بتاعة المطعم ده بس
    let items = menuItems.filter(item => item.restaurantId === restaurant.id);

    // لو في فئة محددة، بنفلتر بيها
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // لو في بحث، بنفلتر بالاسم أو الوصف
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }

    return items;
  }, [menuItems, selectedCategory, searchQuery, restaurant]);

  // لو المطعم مش موجود، بنرجع للصفحة الرئيسية
  useEffect(() => {
    if (!restaurant) {
      showToast('Restaurant not found', 'error');
      navigate('/');
    }
  }, [restaurant, navigate, showToast]);

  if (!restaurant) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 text-text-dark dark:text-white">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-color bg-white px-4 py-2 text-sm font-medium text-text-dark shadow-sm transition hover:border-primary-orange hover:text-primary-orange dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
      >
        <i className="fas fa-arrow-left text-xs"></i>
        <span>Back to Restaurants</span>
      </button>

      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900/70">
        <h1 className="mb-2 text-2xl font-bold text-text-dark dark:text-white">{restaurant.name}</h1>
        <p className="mb-3 text-text-gray dark:text-slate-300">{restaurant.description}</p>
        <div className="flex gap-4 text-sm text-text-gray dark:text-slate-300">
          <span>⭐ {restCount > 0 ? restAvg.toFixed(1) : 'New'} {restCount > 0 ? `(${restCount} reviews)` : ''}</span>
          <span>🕒 {restaurant.deliveryTime}</span>
          <span>💰 Min ${restaurant.minimumOrder}</span>
        </div>
      </div>

      <div className="relative mb-6">
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 transform text-text-gray"></i>
        <input
          type="text"
          className="w-full rounded-lg border border-border-color bg-white/80 pl-10 pr-4 py-2 text-text-dark transition focus:border-primary-orange focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
              selectedCategory === cat
                ? 'bg-primary-orange text-white'
                : 'bg-white border border-border-color text-text-dark hover:bg-bg-gray dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-10 text-center text-text-gray dark:text-slate-400">No items found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;