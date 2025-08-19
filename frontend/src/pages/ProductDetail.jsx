import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}/`)
      .then(r => setProduct(r.data))
      .catch(() => {});
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      return navigate('/login');
    }
    await api.post('/cart/add/', { product_id: product.id, quantity: qty });
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 animate-pulse">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="m-10 max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          {product.image && (
            <img
              src={product.image}
              alt={product.title}
              className="rounded-lg w-full h-auto object-cover"
            />
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-6">Price: ₹{product.price}</p>

          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addToCart}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;