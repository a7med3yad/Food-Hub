// src/components/MenuItemCard.jsx
// كارد الصنف - يعرض صورة الصنف والسعر والوصف
import React, { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import ItemDetailsModal from './ItemDetailsModal';
import { getImagePath } from '../utils/imagePath';

const MenuItemCard = ({ item }) => {
  const { addToCart, getMenuItemRating } = useAppContext();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { average, count } = getMenuItemRating(item.id);

  const openDetails = useCallback(() => {
    setIsDetailsOpen(true);
  }, []);

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails();
    }
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    addToCart(item.id);
  };

  return (
    <>
      <article
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-color/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
        role="button"
        tabIndex={0}
        onClick={openDetails}
        onKeyDown={handleKeyDown}
        aria-label={`View ${item.name} details and reviews`}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={getImagePath(item.image)}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              if (e.target.src && !e.target.src.includes('data:image')) {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23e5e7eb" width="600" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                e.target.alt = 'No Image';
              }
            }}
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-text-dark dark:bg-slate-900/80 dark:text-slate-100">
            ${item.price.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-white">{item.name}</h3>
              <p className="mt-1 text-sm text-text-gray dark:text-slate-300 line-clamp-2">
                {item.description}
              </p>
            </div>
            <div className="min-w-[64px] text-right">
              <div className="flex items-center justify-end gap-1 text-sm font-semibold text-primary-orange">
                <i className="fas fa-star"></i>
                <span>{count > 0 ? average.toFixed(1) : 'New'}</span>
              </div>
              <p className="text-[11px] text-text-light dark:text-slate-400">
                {count} review{count === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-sm font-semibold text-primary-orange dark:text-orange-300">
              Tap card to see reviews
            </span>
            <button
              className="rounded-lg bg-primary-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-orange-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange"
              onClick={handleAddToCart}
            >
              Add
            </button>
          </div>
        </div>
      </article>

      <ItemDetailsModal item={item} isOpen={isDetailsOpen} onClose={closeDetails} />
    </>
  );
};

export default MenuItemCard;

