// src/components/CartDrawer.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CheckoutModal from './CheckoutModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const CartDrawer = () => {
  const { cart, updateCartQuantity, currentUser } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        className="relative p-2 border border-border-color rounded-lg text-text-dark hover:bg-bg-gray transition"
        onClick={() => setIsOpen(true)}
      >
        <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-orange text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div
            className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border-color flex justify-between items-center">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button
                className="p-1 text-text-gray hover:text-text-dark"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>

            <div className="p-5">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-text-gray">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-5xl mb-4 block opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.menuItem.id} className="flex gap-3 mb-4 p-3 border border-border-color rounded-lg">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.menuItem.name}</div>
                        <div className="text-primary-orange font-semibold">
                          ${item.menuItem.price.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            className="w-7 h-7 border border-border-color rounded flex items-center justify-center hover:bg-bg-gray"
                            onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            className="w-7 h-7 border border-border-color rounded flex items-center justify-center hover:bg-bg-gray"
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

                  <div className="border-t border-border-color pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                      className="w-full mt-4 bg-primary-orange text-white py-2 rounded-lg font-medium hover:bg-primary-orange-dark transition"
                      onClick={() => {
                        setIsOpen(false);
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
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};

export default CartDrawer;