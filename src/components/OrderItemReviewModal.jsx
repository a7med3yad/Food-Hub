// src/components/OrderItemReviewModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';
import usePortalRoot from '../hooks/usePortalRoot';
import { getImagePath } from '../utils/imagePath';

const OrderItemReviewModal = ({ isOpen, order, item, onClose }) => {
  const { submitReview, showToast, currentUser } = useAppContext();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const portalRoot = usePortalRoot();

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setComment('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen || !order || !item || !portalRoot) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Please login to submit a review', 'error');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    submitReview({
      menuItemId: item.menuItem.id,
      menuItemName: item.menuItem.name,
      restaurantId: order.restaurantId,
      restaurantName: order.restaurantName,
      orderId: order.id,
      orderTotal: order.total,
      rating,
      comment
    });
    onClose();
  };

  const stars = [1, 2, 3, 4, 5];

  const modal = (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur" onClick={onClose}></div>
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl transition-colors dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-color/80 p-6 dark:border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-gray dark:text-slate-400">Order #{order.id}</p>
            <h2 className="mt-1 text-2xl font-bold text-text-dark dark:text-white">{item.menuItem.name}</h2>
          </div>
          <button
            className="text-text-gray hover:text-text-dark dark:text-slate-400 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close review modal"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="space-y-6 p-6 text-text-dark dark:text-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={getImagePath(item.menuItem.image)}
              alt={item.menuItem.name}
              className="w-20 h-20 rounded-xl object-cover"
              onError={(e) => {
                if (e.target.src && !e.target.src.includes('data:image')) {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="10" dy="7" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                  e.target.alt = 'No Image';
                }
              }}
            />
            <div>
              <div className="text-sm text-text-gray dark:text-slate-400">Delivered on</div>
              <div className="text-base font-medium text-text-dark dark:text-white">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="mt-1 text-sm text-text-gray dark:text-slate-400">
                Quantity: {item.quantity} • Total ${(item.menuItem.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-dark dark:text-white">
                Rate this meal
              </label>
              <div className="flex items-center gap-2">
                {stars.map((value) => {
                  const isActive = value <= (hoverRating || rating);
                  return (
                    <button
                      key={value}
                      type="button"
                      className="p-1"
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(value)}
                      aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-8 w-8 transition-colors ${isActive ? 'text-primary-orange' : 'text-text-gray'}`}
                        fill={isActive ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M11.048 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.08 10.101c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.515-4.674z" />
                      </svg>
                    </button>
                  );
                })}
                <span className="text-sm text-text-gray dark:text-slate-400">
                  {rating > 0 ? `${rating} / 5` : 'Tap a star'}
                </span>
              </div>
              {error && <p className="mt-2 text-sm text-error">{error}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-dark dark:text-white">
                Share a quick review (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full rounded-xl border border-border-color p-3 focus:border-primary-orange focus:ring-2 focus:ring-primary-orange dark:border-slate-700 dark:bg-transparent"
                placeholder="Tell others how it tasted..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary-orange py-3 font-semibold text-white transition hover:bg-primary-orange-dark"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, portalRoot);
};

export default OrderItemReviewModal;

