// src/pages/HistoryPage.jsx
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import OrderItemReviewModal from '../components/OrderItemReviewModal';

const HistoryPage = () => {
  const { orders, currentUser } = useAppContext();
  const [reviewTarget, setReviewTarget] = useState(null);

  // Get only current user's orders
  const userOrders = orders.filter(order => order.userId === currentUser?.id).reverse();

  const openReviewModal = (order, item) => {
    setReviewTarget({ order, item });
  };

  return (
    <div className="container mx-auto px-4 py-6 text-text-dark dark:text-white">
      <h1 className="mb-6 text-2xl font-bold">Order History</h1>

      {userOrders.length === 0 ? (
        <div className="py-12 text-center text-text-gray dark:text-slate-400">
          <i className="fas fa-receipt text-5xl mb-4 block opacity-50"></i>
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => (
            <div key={order.id} className="rounded-xl border border-border-color/70 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-dark dark:text-white">Order #{order.id}</h2>
                  <p className="text-sm text-text-gray dark:text-slate-400">{order.restaurantName}</p>
                  <p className="mt-1 text-xs text-text-gray dark:text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-success' :
                  order.status === 'on-the-way' ? 'bg-blue-100 text-blue-600' :
                  'bg-orange-100 text-warning'
                }`}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>

              <div className="mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="mb-2 flex items-center justify-between gap-3 text-sm text-text-dark dark:text-slate-100">
                    <div>
                      <span className="block font-medium text-text-dark dark:text-white">{item.quantity}x {item.menuItem.name}</span>
                      <span className="text-xs text-text-gray dark:text-slate-400">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    {order.status === 'delivered' && (
                      <button
                        className="text-primary-orange text-xs font-semibold hover:text-primary-orange-dark transition"
                        onClick={() => openReviewModal(order, item)}
                      >
                        Rate this meal
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border-color/70 pt-3 dark:border-slate-700">
                <div className="font-bold text-text-dark dark:text-white">Total: ${order.total.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <OrderItemReviewModal
        isOpen={!!reviewTarget}
        order={reviewTarget?.order}
        item={reviewTarget?.item}
        onClose={() => setReviewTarget(null)}
      />
    </div>
  );
};

export default HistoryPage;