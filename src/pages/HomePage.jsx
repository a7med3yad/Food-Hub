// src/pages/HomePage.jsx
// الصفحة الرئيسية - عرض المطاعم
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import RestaurantCard from '../components/RestaurantCard';

const HomePage = () => {
  const { restaurants, setSelectedRestaurant, showToast } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // بنفلتر المطاعم حسب البحث
  const filteredRestaurants = useMemo(() => {
    if (!searchQuery) return restaurants;
    const q = searchQuery.toLowerCase();
    return restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.categories.some(cat => cat.toLowerCase().includes(q))
    );
  }, [searchQuery, restaurants]);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    navigate(`/menu/${restaurant.id}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-orange to-orange-400 py-12 text-center text-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Food from Your Favorite Restaurants</h1>
          <p className="text-lg opacity-95 mb-6">Fast delivery • Real-time tracking • Best prices</p>
          <div className="max-w-lg mx-auto relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray"></i>
            <input
              type="text"
              className="w-full rounded-lg border border-white/20 bg-white/95 pl-10 pr-4 py-3 text-lg text-text-dark shadow-md transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-orange dark:bg-slate-900 dark:text-white dark:ring-1 dark:ring-slate-700"
              placeholder="Search for restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="py-10 transition-colors dark:bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-dark dark:text-white">
              {searchQuery ? 'Search Results' : 'Available Restaurants'}
            </h2>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-10 text-text-gray dark:text-slate-400">
              No restaurants found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;