// src/pages/OrderDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}/`)
      .then(res => setOrder(res.data))
      .catch(err => console.error("Failed to fetch order:", err));
  }, [id]);

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Order <span className="text-indigo-600">#{order.id}</span>
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Status:</span> {order.status}</p>
          <p><span className="font-semibold">Total:</span> ₹{order.total_amount}</p>
          <p><span className="font-semibold">Placed At:</span> {new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-2xl p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-indigo-100 text-gray-700">
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 border-b">
                    {/* Updated to include image */}
                    <div className="flex items-center gap-4">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <span>{item.product.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b text-center">{item.quantity}</td>
                  <td className="px-4 py-3 border-b text-right">₹{item.unit_price}</td>
                  <td className="px-4 py-3 border-b text-right">
                    ₹{item.quantity * item.unit_price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}