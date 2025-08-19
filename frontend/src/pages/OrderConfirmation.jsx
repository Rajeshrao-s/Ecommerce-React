import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}/`)
      .then(r => setOrder(r.data))
      .catch(() => {});
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Order Confirmation</h2>
      {!order ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded-md p-4 space-y-2">
          <p className="text-lg">Order <span className="font-medium">#{order.id}</span> placed. Total: <span className="font-semibold">₹{order.total_amount}</span></p>
          <p className="text-gray-700">Status: <span className="font-medium">{order.status}</span></p>
        </div>
      )}
    </div>
  );
}

export default OrderConfirmation;
