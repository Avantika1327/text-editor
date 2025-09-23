import { useState, useEffect, type FormEvent } from "react";

// Props type define
interface Category {
  id: string;
  name: string;
}

interface CategoryFormProps {
  onSave: (category: Category) => void;
  onCancel: () => void;
  editingCategory?: Category;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSave, onCancel, editingCategory }) => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName("");
    }
  }, [editingCategory]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Category name is required!");
      return;
    }

    onSave({
      id: editingCategory ? editingCategory.id : crypto.randomUUID(), // Unique ID
      name,
    });

    setName("");
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header fw-bold">
        {editingCategory ? "Edit Category" : "Add Category"}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit" className="btn btn-success">
            {editingCategory ? "Update" : "Save"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
