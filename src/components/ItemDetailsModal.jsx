// src/components/ItemDetailsModal.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';

const ItemDetailsModal = ({ item, isOpen, onClose }) => {
  const { reviews } = useAppContext();
  if (!isOpen || !item) return null;

  const itemReviews = reviews.filter((r) => r.menuItemId === item.id);
  const totalReviews = itemReviews.length;
  const averageRating = totalReviews
    ? itemReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = itemReviews.filter((review) => review.rating === star).length;
    return {
      star,
      count,
      percentage: totalReviews ? Math.round((count / totalReviews) * 100) : 0
    };
  });

  const renderStars = (score) =>
    Array.from({ length: 5 }).map((_, idx) => (
      <i
        key={idx}
        className={`fas fa-star ${idx < Math.round(score) ? 'text-primary-orange' : 'text-border-color'}`}
      ></i>
    ));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur" onClick={onClose}></div>

      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl transition-colors dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border-color/80 p-6 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-text-dark dark:text-white">{item.name}</h2>
            <p className="mt-1 text-text-gray dark:text-slate-300">{item.description}</p>
          </div>
          <button
            className="text-text-gray hover:text-text-dark dark:text-slate-400 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close item reviews"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="space-y-8 p-6">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-bg-gray p-6 text-center dark:bg-slate-800">
              <div className="text-5xl font-bold text-primary-black dark:text-white">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center gap-1 my-3">
                {renderStars(averageRating)}
              </div>
              <p className="text-sm text-text-gray dark:text-slate-300">
                Based on {totalReviews} review{totalReviews === 1 ? '' : 's'}
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              {distribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-medium text-text-dark dark:text-white">{star} ★</span>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-bg-gray dark:bg-slate-800">
                    <div
                      className="h-full bg-primary-orange transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right text-xs text-text-gray dark:text-slate-300">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-text-dark dark:text-white">Customer feedback</h3>
            {itemReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-color py-12 text-center text-text-gray dark:border-slate-700 dark:text-slate-300">
                No reviews yet. Complete a checkout to leave the first one!
              </div>
            ) : (
              <div className="space-y-4">
                {itemReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-border-color p-4 shadow-sm dark:border-slate-700"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-text-dark dark:text-white">{review.userName}</span>
                      <span className="text-xs text-text-gray dark:text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <i
                          key={idx}
                          className={`fas fa-star ${idx < review.rating ? 'text-primary-orange' : 'text-border-color'}`}
                        ></i>
                      ))}
                      <span className="text-xs text-text-gray ml-2">{review.rating}/5</span>
                    </div>
                    <p className="text-sm text-text-dark dark:text-slate-200">
                      {review.comment || 'No written review'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;