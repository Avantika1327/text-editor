import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
// import "bootstrap-icons/font/bootstrap-icons.css";

// Category interface
interface Category {
  id: string;
  name: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem("categories");
    if (stored) {
      try {
        return JSON.parse(stored) as Category[];
      } catch (e) {
        console.error("Failed to parse categories:", e);
        return [];
      }
    }
    return [];
  });

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const handleSave = (category: Category) => {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === category.id);
      if (exists) return prev.map((c) => (c.id === category.id ? category : c));
      return [...prev, category];
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  return (
    <div className="container my-5">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-dark">Categories</h2>
        <button className="shadow-sm btn btn-success btn-sm" onClick={handleAddClick}>
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="p-4 mb-4 border rounded shadow-sm bg-light">
          <CategoryForm
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
            editingCategory={editingCategory || undefined}
          />
        </div>
      )}

      {categories.length === 0 ? (
        <div className="py-5 text-center bg-white border rounded shadow-sm text-muted">
          No categories added yet.
        </div>
      ) : (
        <div className="shadow-sm table-responsive">
          <table className="table mb-0 align-middle bg-white table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th style={{ width: "50%" }}>Name</th>
                <th style={{ width: "30%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="align-middle">
                  <td>{category.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(category)}
                      title="Edit"
                    >
                      <i className="bi bi-pencil-square">Edit</i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(category.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash">Delete</i>
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
};

export default CategoryList;
