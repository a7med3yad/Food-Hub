// src/components/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import usePortalRoot from '../hooks/usePortalRoot';

const AuthModal = ({ isOpen, onClose, standalone = false }) => {
  const { handleLogin } = useAppContext();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const portalRoot = usePortalRoot();

  useEffect(() => {
    if (!isOpen && !standalone) {
      setAuthMode('login');
      setName('');
      setEmail('');
      setPassword('');
      setRole('customer');
    }
  }, [isOpen, standalone]);

  if (!standalone && (!isOpen || !portalRoot)) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = authMode === 'login'
      ? { email, password }
      : { email, password, name, role };

    const loggedInUser = handleLogin(payload);

    if (loggedInUser?.role === 'admin') {
      navigate('/admin');
    } else if (standalone) {
      navigate('/');
    }

    if (!standalone) {
      onClose?.();
    }
  };

  const content = (
    <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl transition-colors dark:bg-slate-900">
      {!standalone && (
        <button
          className="absolute right-4 top-4 text-text-gray hover:text-text-dark dark:text-slate-400 dark:hover:text-white"
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
      )}
      <h2 className="mb-6 text-center text-2xl font-bold text-text-dark dark:text-white">
        {authMode === 'login' ? 'Sign In' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit}>
        {authMode === 'signup' && (
          <>
            <div className="mb-4">
              <label className="mb-2 block font-medium text-text-dark dark:text-white">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border-color bg-transparent p-3 dark:border-slate-700"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block font-medium text-text-dark dark:text-white">Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-border-color bg-white p-3 text-text-dark dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="mb-2 block font-medium text-text-dark dark:text-white">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border-color bg-transparent p-3 dark:border-slate-700"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-medium text-text-dark dark:text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border-color bg-transparent p-3 dark:border-slate-700"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary-orange py-3 font-bold text-white transition hover:bg-primary-orange-dark"
        >
          {authMode === 'login' ? 'Sign In' : 'Sign Up'}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-primary-orange hover:text-primary-orange-dark"
          >
            {authMode === 'login' ? 'Create an account' : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-border-color bg-bg-gray p-4 text-left text-sm text-text-gray dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          <p className="mb-2 font-medium text-text-dark dark:text-white">Demo Accounts:</p>
          <p>Customer: <span className="font-mono text-xs">customer@demo.com / demo123</span></p>
          <p>Admin: <span className="font-mono text-xs">admin@demo.com / demo123</span></p>
        </div>
      </form>
    </div>
  );

  if (standalone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-gray px-4 dark:bg-slate-950">
        {content}
      </div>
    );
  }

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur" onClick={onClose}></div>
      {content}
    </div>
  );

  return createPortal(modal, portalRoot);
};

export default AuthModal;

