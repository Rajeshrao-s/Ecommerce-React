// src/pages/OrdersList.jsx
import { useEffect, useState } from "react";
import api from "../api/axios"; // axios instance with JWT
import { Link } from "react-router-dom";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to fetch orders:", err));
  }, []);

  if (!orders) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 animate-pulse">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-indigo-50 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-6 py-3 text-right text-sm font-medium">Total</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-800 font-semibold">
                    ₹{order.total_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{order.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
                    >
                      View Items
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
