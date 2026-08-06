import React, { useState } from 'react';

export default function FilterSidebar({ categories = [], onFilterChange }) {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minRating, setMinRating] = useState(0);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (onFilterChange) {
      onFilterChange({ category, priceRange, minRating });
    }
  };

  const handlePriceChange = (e) => {
    const maxPrice = parseInt(e.target.value);
    setPriceRange([0, maxPrice]);
    if (onFilterChange) {
      onFilterChange({ category: selectedCategory, priceRange: [0, maxPrice], minRating });
    }
  };

  const handleRatingChange = (e) => {
    const rating = parseInt(e.target.value);
    setMinRating(rating);
    if (onFilterChange) {
      onFilterChange({ category: selectedCategory, priceRange, minRating: rating });
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedCategory('');
    setMinRating(0);
    if (onFilterChange) {
      onFilterChange({ category: '', priceRange: [0, 500], minRating: 0 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h3>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">$0</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              ${priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={minRating === rating}
                onChange={handleRatingChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {rating} stars & up
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
      >
        Clear Filters
      </button>
    </div>
  );
}