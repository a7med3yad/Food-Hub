// src/components/Header.jsx
// الهيدر بتاع الصفحة - فيه اللوجو والأزرار
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CartDrawer from './CartDrawer';
import OrderHistoryModal from './OrderHistoryModal';
import AuthModal from './AuthModal';

const Header = () => {
  const { currentUser, cart, handleLogout, isDarkMode, toggleDarkMode } = useAppContext();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';

  // عدد الأصناف في السلة
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLoginClick = () => {
    setIsAuthOpen(true);
  };

  useEffect(() => {
    if (currentUser) {
      setIsAuthOpen(false);
    } else {
      setIsCartOpen(false);
      setIsHistoryOpen(false);
    }
  }, [currentUser]);

  // ستايل موحد للأزرار الدائرية عشان نضمن التناسق
  const iconButtonStyle = `
    group relative flex h-10 w-10 items-center justify-center rounded-full 
    border transition-all duration-300
    
    /* Light Mode Styles */
    border-border-color text-text-gray bg-white
    hover:border-primary-orange hover:bg-primary-orange/5 hover:text-primary-orange hover:shadow-md
    
    /* Dark Mode Styles - High Visibility (Pop out) */
    dark:border-slate-400 dark:bg-slate-700 dark:text-white
    dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]
    
    /* Hover State in Dark Mode */
    dark:hover:border-primary-orange dark:hover:bg-slate-600 
    dark:hover:text-primary-orange 
    dark:hover:shadow-[0_0_15px_rgba(249,115,22,0.6)]
  `;

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur transition-colors dark:bg-slate-900/95 dark:shadow-slate-800/50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo Section */}
        <div
          className="logo flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => navigate('/')}
        >
          <img
            src={process.env.PUBLIC_URL + '/logo192.png'}
            alt="FoodHub Logo"
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
          />
          <div className="text-2xl font-bold tracking-tight flex items-center">
            <span className="text-text-dark dark:text-white transition-colors">Food</span>
            <span className="text-text-dark dark:text-white transition-colors relative ml-0.5">
              Hub
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary-orange-dark rounded-full shadow-[0_0_8px_rgba(234,88,12,0.5)]"></span>
            </span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            className={iconButtonStyle}
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg transition-transform duration-500 group-hover:rotate-90`}></i>
          </button>

          {/* User Actions (Cart & History) */}
          {currentUser && !isAdmin && (
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <button
                className={iconButtonStyle}
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping cart with ${cartCount} items`}
                title="Shopping Cart"
              >
                <i className="fas fa-shopping-cart text-lg transition-transform duration-300 group-hover:scale-110"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-orange text-white text-xs font-bold shadow-lg ring-2 ring-white dark:ring-slate-900 animate-pulse-once">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Order History Button */}
              <button
                className={iconButtonStyle}
                onClick={() => setIsHistoryOpen(true)}
                aria-label="View order history"
                title="Order History"
              >
                <i className="fas fa-history text-lg transition-transform duration-500 group-hover:-rotate-180"></i>
              </button>
            </div>
          )}

          {/* Login / Signup Button */}
          {!currentUser && (
            <button
              className="rounded-full bg-primary-orange px-6 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-primary-orange-dark hover:shadow-lg hover:shadow-primary-orange/30 active:scale-95"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}

          {/* Logout Button */}
          {currentUser && (
            <button
              className="hidden sm:block rounded-full border border-slate-200 bg-transparent px-5 py-2 text-sm font-semibold text-text-dark transition-all duration-300 hover:bg-slate-100 dark:border-slate-400 dark:text-white dark:hover:bg-slate-800 dark:hover:text-primary-orange dark:hover:border-primary-orange"
              onClick={() => {
                handleLogout();
                const currentPath = window.location.pathname;
                if (currentPath.includes('/admin') || currentPath.includes('/history')) {
                  setTimeout(() => {
                    navigate('/', { replace: true });
                  }, 50);
                }
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Modals & Drawers */}
      {currentUser && !isAdmin && (
        <>
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <OrderHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </>
      )}
      {!currentUser && (
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      )}
    </header>
  );
};

export default Header;