// src/components/CartDrawer.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';
import CheckoutModal from './CheckoutModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import usePortalRoot from '../hooks/usePortalRoot';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity } = useAppContext();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const portalRoot = usePortalRoot();

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const drawer = (
    isOpen && (
      <div
        className="fixed inset-0 z-[60]"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur"></div>
        <div
          className="absolute top-0 right-0 bottom-0 w-full max-w-md overflow-y-auto bg-white shadow-xl transition-colors dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between border-b border-border-color/80 p-5 dark:border-slate-800">
              <h2 className="text-xl font-bold text-text-dark dark:text-white">Shopping Cart</h2>
              <button
                className="p-1 text-text-gray hover:text-text-dark dark:text-slate-400 dark:hover:text-white"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>

            <div className="p-5 text-text-dark dark:text-slate-100">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-text-gray dark:text-slate-400">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-5xl mb-4 block opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.menuItem.id} className="mb-4 flex gap-3 rounded-lg border border-border-color/70 p-3 dark:border-slate-700">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.menuItem.name}</div>
                        <div className="font-semibold text-primary-orange">
                          ${item.menuItem.price.toFixed(2)}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded border border-border-color hover:bg-bg-gray dark:border-slate-700 dark:hover:bg-slate-800"
                            onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded border border-border-color hover:bg-bg-gray dark:border-slate-700 dark:hover:bg-slate-800"
                            onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                          >
                            +
                          </button>
                          <button
                            className="ml-2 text-error hover:text-red-700"
                            onClick={() => updateCartQuantity(item.menuItem.id, 0)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 border-t border-border-color/80 pt-4 dark:border-slate-800">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                      className="mt-4 w-full rounded-lg bg-primary-orange py-2 font-medium text-white transition hover:bg-primary-orange-dark"
                      onClick={() => {
                        onClose?.();
                        setTimeout(() => setIsCheckoutOpen(true), 300);
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
        </div>
      </div>
    )
  );

  return (
    <>
      {portalRoot && drawer && createPortal(drawer, portalRoot)}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};

export default CartDrawer;