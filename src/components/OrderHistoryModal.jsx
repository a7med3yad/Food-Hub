// src/components/OrderHistoryModal.jsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../context/AppContext';
import OrderItemReviewModal from './OrderItemReviewModal';
import usePortalRoot from '../hooks/usePortalRoot';

const OrderHistoryModal = ({ isOpen, onClose }) => {
  const { orders, currentUser } = useAppContext();
  const [reviewTarget, setReviewTarget] = useState(null);
  const portalRoot = usePortalRoot();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !portalRoot) return null;

  const userOrders = orders
    .filter((order) => order.userId === currentUser?.id)
    .reverse();

  const modal = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl transition-colors dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-border-color/80 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-lg font-semibold text-text-dark dark:text-white">
            <FontAwesomeIcon icon={faClock} />
            <span>Order History</span>
          </div>
          <button
            className="p-2 text-text-gray hover:text-text-dark dark:text-slate-400 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close order history"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto px-6 py-5">
          {userOrders.length === 0 ? (
            <div className="py-12 text-center text-text-gray dark:text-slate-400">
              <FontAwesomeIcon icon={faClock} className="text-5xl mb-4 opacity-40" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-border-color/70 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-text-dark dark:text-white">Order #{order.id}</h2>
                      <p className="text-sm text-text-gray dark:text-slate-300">{order.restaurantName}</p>
                      <p className="mt-1 text-xs text-text-gray dark:text-slate-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : order.status === 'on-the-way'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}
                    >
                      {order.status === 'delivered' && <i className="fas fa-check-circle"></i>}
                      {order.status === 'on-the-way' && <i className="fas fa-truck"></i>}
                      {order.status === 'preparing' && <i className="fas fa-clock"></i>}
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="mb-2 flex items-center justify-between gap-3 text-sm text-text-dark dark:text-slate-100">
                        <div>
                          <span className="block font-medium text-text-dark dark:text-white">
                            {item.quantity}x {item.menuItem.name}
                          </span>
                          <span className="text-xs text-text-gray dark:text-slate-400">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {order.status === 'delivered' && (
                          <button
                            className="text-primary-orange text-xs font-semibold hover:text-primary-orange-dark transition"
                            onClick={() => setReviewTarget({ order, item })}
                          >
                            Rate this meal
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border-color/70 pt-3 text-text-dark dark:border-slate-700 dark:text-slate-100">
                    <div className="font-semibold">Total: ${order.total.toFixed(2)}</div>
                    <span className="text-xs text-text-gray dark:text-slate-400">ID: {order.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <OrderItemReviewModal
        isOpen={!!reviewTarget}
        order={reviewTarget?.order}
        item={reviewTarget?.item}
        onClose={() => setReviewTarget(null)}
      />
    </div>
  );

  return createPortal(modal, portalRoot);
};

export default OrderHistoryModal;

