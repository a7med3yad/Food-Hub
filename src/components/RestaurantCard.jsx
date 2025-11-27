// src/components/RestaurantCard.jsx
// كارد المطعم - يعرض معلومات المطعم وصورته
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { getImagePath } from '../utils/imagePath';

const RestaurantCard = ({ restaurant, onClick }) => {
  const { getRestaurantRating } = useAppContext();
  const { average, count } = getRestaurantRating(restaurant.id);

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-xl border border-transparent bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      onClick={onClick}
    >
      <div className="relative w-full h-48">
        <img
          src={getImagePath(restaurant.image)}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            if (e.target.src && !e.target.src.includes('data:image')) {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23e5e7eb" width="600" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
              e.target.alt = 'No Image';
            }
          }}
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-text-dark dark:text-white">{restaurant.name}</h3>
          <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-sm font-semibold text-primary-orange dark:bg-slate-800">
            <i className="fas fa-star text-primary-orange"></i>
            <span>{count > 0 ? average.toFixed(1) : 'New'}</span>
          </div>
        </div>
        <p className="mb-3 text-sm text-text-gray line-clamp-2 dark:text-slate-300">
          {restaurant.description}
        </p>
        <div className="flex gap-3 text-sm text-text-gray dark:text-slate-300">
          <span className="flex items-center gap-1">
            <i className="fas fa-clock"></i> {restaurant.deliveryTime}
          </span>
          <span className="flex items-center gap-1">
            <i className="fas fa-dollar-sign"></i> Min ${restaurant.minimumOrder}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;