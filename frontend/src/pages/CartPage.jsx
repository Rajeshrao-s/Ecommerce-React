import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart/");
      const cartItems = res.data.items || res.data;
      setItems(cartItems);

      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setCartTotal(total);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
      setItems([]);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id, newQty, productId) => {
    const quantity = Number(newQty);
    if (quantity <= 0) return;

    try {
      await api.put(`/cart/update/`, {
        product_id: productId,
        quantity: quantity,
      });
      fetchCart();
    } catch (err) {
      console.error(
        "Failed to update item quantity:",
        err.response?.data || err.message
      );
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/cart/remove/${id}/`);
      fetchCart();
    } catch (err) {
      console.error(
        "Failed to remove item:",
        err.response?.data || err.message
      );
    }
  };

  const goCheckout = () => navigate("/checkout");

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Cart</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {items.map((i) => (
              <li
                key={i.id}
                className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white"
              >
                {i.product?.image && (
                  <img
                    src={`http://localhost:8000${i.product.image}`}
                    alt={i.product.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                
                <div className="flex-grow flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="font-medium text-gray-800">{i.product?.title}</div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => updateQty(i.id, i.quantity - 1, i.product.id)}
                        disabled={i.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-2">{i.quantity}</span>
                      <button
                        className="px-2 py-1 border rounded text-gray-700 hover:bg-gray-100"
                        onClick={() => updateQty(i.id, i.quantity + 1, i.product.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="font-semibold">₹{(i.product?.price * i.quantity).toFixed(2)}</div>
                    <button
                      className="text-red-600 hover:text-red-800 font-medium"
                      onClick={() => remove(i.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center font-bold text-lg p-4 border-t">
            <span>Total:</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={goCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;