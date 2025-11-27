// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockRestaurants, mockMenuItems } from '../data/mockData';


const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('foodhub-theme') === 'dark';
  });
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('foodhub-user');
    const savedCart = localStorage.getItem('foodhub-cart');
    const savedOrders = localStorage.getItem('foodhub-orders');
    const savedReviews = localStorage.getItem('foodhub-reviews');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    setIsAuthReady(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('foodhub-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('foodhub-user');
    }
    localStorage.setItem('foodhub-cart', JSON.stringify(cart));
    localStorage.setItem('foodhub-orders', JSON.stringify(orders));
    localStorage.setItem('foodhub-reviews', JSON.stringify(reviews));
  }, [currentUser, cart, orders, reviews]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle('dark', isDarkMode);
    if (isDarkMode) {
      root.dataset.theme = 'dark';
      body.classList.add('dark-body');
    } else {
      root.dataset.theme = 'light';
      body.classList.remove('dark-body');
    }
    localStorage.setItem('foodhub-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // === HELPER FUNCTIONS ===

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const getRestaurantRating = (restaurantId) => {
    const restaurantReviews = reviews.filter(r => r.restaurantId === restaurantId);
    if (restaurantReviews.length === 0) return { average: 0, count: 0 };
    const average = restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length;
    return { average, count: restaurantReviews.length };
  };

  const getMenuItemRating = (menuItemId) => {
    const itemReviews = reviews.filter(r => r.menuItemId === menuItemId);
    if (itemReviews.length === 0) return { average: 0, count: 0 };
    const average = itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length;
    return { average, count: itemReviews.length };
  };
  const addToCart = (itemId) => {
    if (!currentUser) {
      showToast('Please login to add items to cart', 'error');
      return false;
    }

    if (currentUser.role !== 'customer') {
      showToast('Only customers can order food', 'error');
      return false;
    }

    const item = mockMenuItems.find(i => i.id === itemId);
    if (!item) return false;

    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === itemId);
      if (existing) {
        return prev.map(c => c.menuItem.id === itemId ? { ...c, quantity: c.quantity + 1 } : c);
      } else {
        return [...prev, { menuItem: item, quantity: 1 }];
      }
    });

    showToast(`${item.name} added to cart`, 'success');
    return true;
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(c => c.menuItem.id !== itemId));
      showToast('Item removed from cart', 'success');
    } else {
      setCart(prev =>
        prev.map(c =>
          c.menuItem.id === itemId ? { ...c, quantity } : c
        )
      );
    }
  };

  const handleLogin = (user) => {
    const determineRole = () => {
      if (user.role) return user.role;
      if (user.email?.toLowerCase() === 'admin@demo.com') return 'admin';
      return 'customer';
    };

    const normalizedUser = {
      ...user,
      id: user.id || user.email || `user_${Date.now()}`,
      role: determineRole(),
      name: user.name || (user.email ? user.email.split('@')[0] : 'Guest')
    };

    setCurrentUser(normalizedUser);
    localStorage.setItem('foodhub-user', JSON.stringify(normalizedUser));
    showToast(`Welcome ${normalizedUser.name}!`, 'success');
    return normalizedUser;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem('foodhub-user');
    showToast('Logged out successfully', 'success');
  };

  const placeOrder = (orderData) => {
    if (!currentUser || !selectedRestaurant || cart.length === 0) return null;

    const newOrder = {
      id: 'ORD' + Date.now().toString(36).toUpperCase(),
      userId: currentUser.id,
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      items: [...cart],
      total: orderData.total,
      status: 'preparing',
      address: orderData.address,
      phone: orderData.phone,
      notes: orderData.notes,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    return newOrder;
  };

  const submitReview = (reviewData) => {
    const newReview = {
      id: 'review_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      menuItemId: reviewData.menuItemId,
      menuItemName: reviewData.menuItemName,
      restaurantId: reviewData.restaurantId,
      restaurantName: reviewData.restaurantName,
      orderId: reviewData.orderId,
      orderTotal: reviewData.orderTotal,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [...prev, newReview]);
    showToast('Review submitted successfully!', 'success');
  };

  const value = {
    // State
    currentUser,
    cart,
    orders,
    reviews,
    selectedRestaurant,
    selectedCategory,
    toast,
    // Data
    restaurants: mockRestaurants,
    menuItems: mockMenuItems,
    // Setters
    setCurrentUser,
    setSelectedRestaurant,
    setSelectedCategory,
    // Functions
    showToast,
    getRestaurantRating,
    getMenuItemRating,
    addToCart,
    updateCartQuantity,
    handleLogin,
    handleLogout,
    placeOrder,
    submitReview,
    isDarkMode,
    toggleDarkMode,
    isAuthReady,
    // For debugging
    setCart,
    setOrders
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};