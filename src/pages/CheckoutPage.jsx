// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CheckoutPage = () => {
  const { cart, selectedRestaurant, placeOrder, showToast } = useAppContext();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (cart.length === 0 || !selectedRestaurant) {
      navigate('/');
    }
  }, [cart, selectedRestaurant, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address || !phone) {
      showToast('Please fill in address and phone number', 'error');
      return;
    }

    const orderData = { address, phone, notes, total };
    const newOrder = placeOrder(orderData);
    
    // Redirect to tracking
    navigate(`/tracking/${newOrder.id}`);
    showToast('Order placed successfully!', 'success');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-text-dark font-medium mb-2">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border border-border-color rounded-lg"
            rows="3"
            placeholder="Enter your delivery address"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-text-dark font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-border-color rounded-lg"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-text-dark font-medium mb-2">Order Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border border-border-color rounded-lg"
            rows="2"
            placeholder="Any special instructions?"
          />
        </div>

        <div className="bg-bg-gray p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-3">Order Summary</h3>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm mb-2">
              <span>{item.quantity}x {item.menuItem.name}</span>
              <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm mb-2">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border-color">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-orange text-white py-3 rounded-lg font-bold hover:bg-primary-orange-dark transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;