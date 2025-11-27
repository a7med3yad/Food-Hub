// src/pages/AuthPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <AuthModal
      isOpen
      standalone
      onClose={() => navigate('/')}
    />
  );
};

export default AuthPage;