import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Checkout from './routes/Checkout';
import Admin from './routes/Admin';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import CartSidebar from './components/CartSidebar';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <div className="App font-sans bg-gray-50 dark:bg-dark-bg min-h-screen text-gray-800 dark:text-dark-text text-right" dir="rtl">
              <Navbar />
              <CartSidebar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router >
  );
}

export default App;
