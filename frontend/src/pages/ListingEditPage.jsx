import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function ListingEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then((res) => {
        const item = res.data.data;
        setTitle(item.title);
        setDescription(item.description || '');
        setPrice(item.price);
        setStock(item.stock);
        // Display existing image from the backend image endpoint
        setPreviewUrl(`http://localhost:8000/api/listings/${id}/image`);
      })
      .catch(() => setError('Failed to load listing details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Switch preview to local blob URL immediately
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    if (image) formData.append('image', image);

    try {
      await api.post(`/listings/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !title) return <p className="p-6 text-sm opacity-60">Loading listing data...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Edit Listing</h1>
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="8" // Increased from 3 to 8
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-y"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Stock</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Replace Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-white hover:file:opacity-90"
          />

          {previewUrl && (
            <div className="mt-3 flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-60">Current / New Preview:</span>
              <div className="w-40 h-40 rounded-xl overflow-hidden border border-[var(--border)] bg-black/5 dark:bg-white/5">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition w-fit mt-2"
        >
          {loading ? 'Saving...' : 'Update Listing'}
        </button>
      </form>
    </div>
  );
}