import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (category) params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/products/categories/all').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div>
      <h1 className="section-title">Shop the collection</h1>

      <form onSubmit={handleSearch} className="flex" style={{ gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          className="form-control"
          style={{ maxWidth: 320 }}
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select className="form-control" style={{ maxWidth: 220 }} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="spinner-wrap">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found. Try a different search.</div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
