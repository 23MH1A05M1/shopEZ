import { useEffect, useState } from 'react';
import api from '../services/api';
import { resolveImageUrl } from '../services/imageUrl';
import { formatCurrency } from '../utils/currency';

const emptyForm = { name: '', description: '', price: '', category: '', imageUrl: '', stock: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { limit: 100 } });
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview('');
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show an instant local preview while the upload is in progress
    setImagePreview(URL.createObjectURL(file));
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      // Do NOT set Content-Type manually — the browser needs to add its own
      // multipart boundary, which axios/browser handles automatically for FormData.
      const { data } = await api.post('/upload', formData);
      // Store the relative path returned by the server (e.g. "/uploads/xyz.jpg")
      setForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
    setImagePreview(resolveImageUrl(product.imageUrl));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <h1 className="section-title">Manage Products</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control" name="name" required value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input className="form-control" name="category" required value={form.category} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input className="form-control" type="number" step="0.01" min="0" name="price" required value={form.price} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input className="form-control" type="number" min="0" name="stock" required value={form.stock} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Product Image</label>
            <input
              className="form-control"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleImageSelect}
            />
            {uploading && <p className="muted" style={{ fontSize: '0.85rem', marginTop: 6 }}>Uploading...</p>}
            {imagePreview && !uploading && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6, marginTop: 8, border: '1px solid var(--color-border)' }}
              />
            )}
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea className="form-control" name="description" rows={3} required value={form.description} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={uploading}>
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="spinner-wrap">Loading products...</div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatCurrency(p.price)}</td>
                  <td>{p.stock}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
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

export default AdminProducts;
