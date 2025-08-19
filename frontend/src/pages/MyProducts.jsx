import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AddProduct from "./AddProduct";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/my-products/")
      .then((r) => setProducts(r.data))
      .catch((e) => {
        console.error(e);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/my-products/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err.response?.data || err.message);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Products</h2>

      {/* Add Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h5 className="text-lg font-medium mb-4">Add New Product</h5>
        <AddProduct
          onProductAdded={(newProduct) => setProducts([newProduct, ...products])}
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">#</th>
                <th className="px-4 py-3 border-b">Image</th> {/* Added Image Header */}
                <th className="px-4 py-3 border-b">Title</th>
                <th className="px-4 py-3 border-b">Description</th>
                <th className="px-4 py-3 border-b">Price</th>
                <th className="px-4 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  {/* Added Image Cell */}
                  <td className="px-4 py-3 border-b">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">{p.title}</td>
                  <td className="px-4 py-3 border-b">
                    {p.description?.slice(0, 120)}
                  </td>
                  <td className="px-4 py-3 border-b">₹{p.price}</td>
                  <td className="px-4 py-3 border-b flex space-x-2">
                    <Link
                      to={`/my-products/edit/${p.id}`}
                      className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
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

export default MyProducts;