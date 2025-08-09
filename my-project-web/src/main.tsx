import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './hooks/useLanguage';
import { CartProvider } from './contexts/CartContext';
import App from './App';
import { AdminPanel } from './components/AdminPanel';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  </React.StrictMode>,
);