import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function Category() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch categories
  const fetchCategories = () => {
    api
      .get("/admin/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      api
        .put(`/admin/categories/${editingId}/`, formData)
        .then(() => {
          fetchCategories();
          setFormData({ name: "" });
          setEditingId(null);
        })
        .catch((err) => console.error("Error updating category:", err));
    } else {
      api
        .post("/admin/categories/", formData)
        .then(() => {
          fetchCategories();
          setFormData({ name: "" });
        })
        .catch((err) => console.error("Error adding category:", err));
    }
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name });
    setEditingId(cat.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      api
        .delete(`/admin/categories/${id}/`)
        .then(() => fetchCategories())
        .catch((err) => console.error("Error deleting category:", err));
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">Category Management</h2>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          name="name"
          className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter category name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => {
                setFormData({ name: "" });
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Category List */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat, index) => (
              <tr key={cat.id}>
                <td className="px-4 py-2 text-sm">{index + 1}</td>
                <td className="px-4 py-2 text-sm">{cat.name}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Category;
