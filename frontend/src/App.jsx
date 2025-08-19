import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequireAdmin from './utils/RequireAdmin';
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";
import OrderList from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";
import Category from "./pages/admin/Category";
import ProductList from "./pages/admin/ProductList";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Top Navigation Bar */}
        <Topbar />

        {/* Main Content */}
        <main className="min-h-screen bg-gray-100 p-4 md:p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/my-products" element={<MyProducts />} />
              <Route path="/my-products/edit/:id" element={<EditProduct />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetail />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
              <Route path="/admin/products" element={<RequireAdmin><ProductList /></RequireAdmin>} />
              <Route path="/admin/categories" element={<RequireAdmin><Category /></RequireAdmin>} />

              {/* Fallback */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center h-64">
                    <h3 className="text-2xl font-semibold text-gray-600">
                      404 - Page Not Found
                    </h3>
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
      </AuthProvider>
    </Router>
  );
}
