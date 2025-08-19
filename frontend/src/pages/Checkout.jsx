import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Checkout() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    setLoading(true);
    try {
      // mock payment flow
      await new Promise(res => setTimeout(res, 800));
      const res = await api.post('/place-order/', { address });
      navigate(`/order-confirmation/${res.data.order_id}`);
    } catch (e) {
      alert('Error placing order: ' + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Checkout</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Delivery Address</label>
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          placeholder="Enter your delivery address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Payment (Mock)</label>
        <div className="p-4 bg-gray-100 rounded-lg border text-gray-600">
          Use mock payment — click Place Order
        </div>
      </div>

      <button
        className={`w-full py-2 rounded-lg text-white font-medium transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
        onClick={placeOrder}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}

export default Checkout;
