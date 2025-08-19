import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/products/'), api.get('/admin/categories/')])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xl font-semibold text-gray-800">Products</h4>
            <Link
              to="/admin/products/"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors"
            >
              Product List
            </Link>
          </div>
          {/* <ul className="divide-y divide-gray-200">
            {products.map(p => (
              <li key={p.id} className="flex justify-between items-center py-2">
                <span className="text-gray-700">{p.title}</span>
                <Link
                  to={`/admin/products/${p.id}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-md transition-colors"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul> */}
        </div>

        {/* Categories Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xl font-semibold text-gray-800">Categories</h4>
            <Link
              to="/admin/categories/"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors"
            >
              Category List
            </Link>
          </div>
          {/* <ul className="divide-y divide-gray-200">
            {categories.map(c => (
              <li key={c.id} className="flex justify-between items-center py-2">
                <span className="text-gray-700">{c.name}</span>
                <Link
                  to={`/admin/categories/${c.id}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-md transition-colors"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul> */}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
