// src/components/CheckoutModal.jsx
// مودال الدفع - المستخدم بيدخل العنوان ورقم التليفون
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';
import usePortalRoot from '../hooks/usePortalRoot';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, placeOrder, showToast, selectedRestaurant } = useAppContext();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const portalRoot = usePortalRoot();

  // حساب الإجمالي
  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (isOpen) {
      setAddress('');
      setPhone('');
      setNotes('');
      setErrors({});
    }
  }, [isOpen]);

  // دالة إرسال الطلب
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRestaurant) {
      showToast('Please choose a restaurant before checking out', 'error');
      return;
    }

    const trimmedAddress = address.trim();
    const trimmedPhone = phone.trim();

    const newErrors = {};

    // التحقق من العنوان - لازم يكون فيه حروف مش أرقام بس
    if (!trimmedAddress || trimmedAddress.length < 10) {
      newErrors.address = 'Please enter a valid address (at least 10 characters)';
    }

    // التحقق من رقم التليفون - لازم يكون أرقام بس وطول معقول
    if (!trimmedPhone || !/^\d{10,15}$/.test(trimmedPhone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    // لو في أخطاء، بنوقف هنا
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    // لو كل حاجة تمام، بنعمل الطلب
    setErrors({});
    const orderData = {
      address: trimmedAddress,
      phone: trimmedPhone,
      notes,
      total
    };
    const newOrder = placeOrder(orderData);
    
    if (newOrder) {
      showToast('Order placed successfully!', 'success');
      onClose();
    } else {
      showToast('Unable to place order. Please try again.', 'error');
    }
  };

  if (!isOpen || !portalRoot) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur"
        onClick={onClose}
      ></div>
      
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-lg transition-colors dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-color/80 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-text-dark dark:text-white">Checkout</h2>
            {selectedRestaurant && (
              <p className="text-sm text-text-gray dark:text-slate-400">
                {selectedRestaurant.name}
              </p>
            )}
          </div>
          <button
            className="text-text-gray hover:text-text-dark dark:text-slate-400 dark:hover:text-white"
            onClick={onClose}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-5 text-text-dark dark:text-slate-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block font-medium text-text-dark dark:text-white">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-border-color bg-transparent p-3 dark:border-slate-700"
                rows="3"
                placeholder="Enter your delivery address"
                required
              />
              {errors.address && (
                <p className="mt-2 text-sm text-error">{errors.address}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-medium text-text-dark dark:text-white">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-border-color bg-transparent p-3 dark:border-slate-700"
                placeholder="Enter your phone number"
                required
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-error">{errors.phone}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-medium text-text-dark dark:text-white">Order Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-border-color bg-transparent p-3 dark:border-slate-700"
                rows="2"
                placeholder="Any special instructions?"
              />
            </div>

            <div className="mb-6 rounded-lg bg-bg-gray p-4 dark:bg-slate-800">
              <h3 className="mb-3 font-bold text-text-dark dark:text-white">Order Summary</h3>
              {cart.map((item, idx) => (
                <div key={idx} className="mb-2 flex justify-between text-sm text-text-gray dark:text-slate-300">
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="mb-2 flex justify-between text-sm text-text-gray dark:text-slate-300">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border-color/70 pt-2 font-bold text-text-dark dark:border-slate-700 dark:text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary-orange py-3 font-bold text-white transition hover:bg-primary-orange-dark"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, portalRoot);
};

export default CheckoutModal;