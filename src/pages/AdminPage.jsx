// src/pages/AdminPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AdminPage = () => {
  const { orders, setOrders, showToast, currentUser, isAuthReady, reviews } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthReady) return;
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Admins only', 'error');
      navigate('/');
    }
  }, [currentUser, isAuthReady, navigate, showToast]);

  if (!isAuthReady) {
    return null;
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'preparing').length;

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    showToast(`Order ${orderId} updated to "${newStatus}"`, 'success');
  };

  const reviewFeed = [...reviews]
    .reverse()
    .filter(review => orders.some(order => order.id === review.orderId));

  return (
    <div className="container mx-auto px-4 py-6 text-text-dark dark:text-white">
      <h1 className="mb-6 text-2xl font-bold">Restaurant Admin Dashboard</h1>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900/70">
          <div className="mb-1 text-sm text-text-gray dark:text-slate-400">Total Orders</div>
          <div className="text-2xl font-bold text-primary-orange">{totalOrders}</div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900/70">
          <div className="mb-1 text-sm text-text-gray dark:text-slate-400">Total Revenue</div>
          <div className="text-2xl font-bold text-primary-orange">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900/70">
          <div className="mb-1 text-sm text-text-gray dark:text-slate-400">Pending Orders</div>
          <div className="text-2xl font-bold text-primary-orange">{pendingOrders}</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900/70">
        <h2 className="mb-4 text-xl font-bold text-text-dark dark:text-white">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-text-gray dark:text-slate-400">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {[...orders].reverse().slice(0, 10).map(order => (
              <div key={order.id} className="border-b border-border-color/70 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-text-dark dark:text-white">Order #{order.id}</h3>
                    <p className="text-sm text-text-gray dark:text-slate-400">{order.restaurantName}</p>
                    <p className="text-xs text-text-gray dark:text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <select
                    className="rounded border border-border-color px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="preparing">Preparing</option>
                    <option value="on-the-way">On the Way</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <div className="mb-2 rounded bg-bg-gray p-3 dark:bg-slate-800/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-text-dark dark:text-slate-100">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-text-gray dark:text-slate-300">
                  <div>
                    <div>📞 {order.phone || 'N/A'}</div>
                    <div>📍 {order.address || 'N/A'}</div>
                  </div>
                  <div className="font-bold text-text-dark dark:text-white">Total: ${order.total.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900/70">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-dark dark:text-white">Latest Customer Ratings</h2>
          <span className="text-xs uppercase tracking-wide text-text-gray dark:text-slate-400">
            {reviewFeed.length} feedback{reviewFeed.length === 1 ? '' : 's'}
          </span>
        </div>
        {reviewFeed.length === 0 ? (
          <p className="text-text-gray dark:text-slate-400">No reviews yet. Encourage customers to rate their meals.</p>
        ) : (
          <div className="space-y-4">
            {reviewFeed.slice(0, 8).map(review => (
              <div
                key={review.id}
                className="rounded-lg border border-border-color/70 p-4 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-text-dark dark:text-white">
                      {review.menuItemName} • {review.restaurantName || 'N/A'}
                    </p>
                    <p className="text-xs text-text-gray dark:text-slate-400">
                      Order #{review.orderId} • {new Date(review.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-primary-orange">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <i
                        key={idx}
                        className={`fas fa-star ${idx < review.rating ? 'text-primary-orange' : 'text-border-color dark:text-slate-700'}`}
                      ></i>
                    ))}
                    <span className="ml-2 text-sm text-text-dark dark:text-white">{review.rating}/5</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-text-dark dark:text-slate-200">
                  {review.comment || 'No written feedback provided.'}
                </p>
                <div className="mt-2 text-xs text-text-gray dark:text-slate-400">
                  Total order value: ${review.orderTotal?.toFixed(2) || '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;