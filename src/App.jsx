// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';
import HistoryPage from './pages/HistoryPage';
import AuthPage from './pages/AuthPage'; // ← أضفها
import Header from './components/Header';
import Toast from './components/Toast';

function App() {
  return (
    <AppProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="min-h-screen bg-bg-gray transition-colors dark:bg-slate-950">
          <Header />
          <main className="pb-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu/:restaurantId" element={<MenuPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/auth" element={<AuthPage />} /> {/* ← أضفها */}
              <Route path="*" element={
                <div className="container mx-auto py-10 text-center text-text-gray">
                  404 - Page Not Found
                </div>
              } />
            </Routes>
          </main>
          <Toast />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;