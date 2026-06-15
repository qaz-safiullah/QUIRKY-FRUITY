import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import { Snackbar, Alert } from '@mui/material';

import './styles/main.css'; 
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Homepage from './Pages/Homepage';
import ProfilePage from './Pages/ProfilePage';
import OrdersPage from './Pages/OrdersPage';
import CheckoutModal from './components/CheckoutModal/CheckoutModal';
import AuthModal from './components/AuthModal/AuthModal';
import { submitOrder } from './services/api';

function AppContent() {
  const navigate = useNavigate();
  const { cart, cartCount, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message, severity) => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleSubmitOrder = async (orderData) => {
    await submitOrder(orderData);
    clearCart();
    showToast('Order placed successfully!', 'success');
  };

  const handleContinueShopping = () => {
    setCheckoutOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('stores');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const el = document.getElementById('stores');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="app-container">
        <Navbar
          cartCount={cartCount}
          onCartClick={user ? () => setCheckoutOpen(true) : undefined}
          onAuthClick={() => setAuthOpen(true)}
        />

        <Snackbar
          open={toast.open}
          autoHideDuration={2000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            variant="filled"
            sx={{
              width: '100%',
              fontFamily: 'Poppins',
              fontWeight: 700,
              borderRadius: '12px',
              backgroundColor: toast.severity === 'success' ? '#2d6a4f' : '#d95d39',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>

        <Routes>
          <Route path="/" element={<Homepage showToast={showToast} onAuthRequest={() => setAuthOpen(true)} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </div>

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={(id) => updateQuantity(id, 0)}
          onClose={() => setCheckoutOpen(false)}
          onContinueShopping={handleContinueShopping}
          onSubmitOrder={handleSubmitOrder}
        />
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
