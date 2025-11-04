import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { store } from './store';
import { getApolloClient } from './services/apollo-client';
import { CartProvider } from './contexts/CartContext';
import { RequireAuth } from './routes';

// Pages
import LoginPage from './pages/login/LoginPage';
import ProductListPage from './pages/products/ProductListPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/cart/CartPage';
import OrderHistoryPage from './pages/orders/OrderHistoryPage';

function App() {
  const [client, setClient] = React.useState<any>(null);

  useEffect(() => {
    getApolloClient().then(setClient);
  }, []);

  if (!client) {
    return <div>Loading Apollo Client...</div>;
  }

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <CartProvider>
          <BrowserRouter>
            <div className="App">
              <Routes>
                <Route path="/" element={<Navigate to="/products" replace />} />
                
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Routes */}
                <Route path="/products" element={
                  <RequireAuth>
                    <ProductListPage />
                  </RequireAuth>
                } />
                
                <Route path="/product/:id" element={
                  <RequireAuth>
                    <ProductDetailPage />
                  </RequireAuth>
                } />
                
                <Route path="/cart" element={
                  <RequireAuth>
                    <CartPage />
                  </RequireAuth>
                } />
                
                <Route path="/orders" element={
                  <RequireAuth>
                    <OrderHistoryPage />
                  </RequireAuth>
                } />
                
                <Route path="*" element={<Navigate to="/products" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </CartProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default App;