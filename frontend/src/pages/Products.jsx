import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/')
      .then(r => setProducts(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 animate-pulse">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div
              key={p.id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col transform transition-transform duration-300 hover:scale-105"
            >
              {p.image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h5 className="text-xl font-semibold mb-2 text-gray-800 truncate">{p.title}</h5>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{p.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold text-gray-900">₹{p.price}</span>
                  <Link
                    to={`/products/${p.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;