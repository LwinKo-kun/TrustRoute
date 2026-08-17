import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { getListingImageUrl } from '../../services/api';

export default function ProductCard({ product }) {
  if (!product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer">
        <Link to={`/products/${product.id}`}>
          <img
            src={getListingImageUrl(product.id)}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </Link>
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            product.stock > 0 
              ? 'bg-black/60 backdrop-blur-md text-white' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of stock'}
          </span>
        </div>

        {/* Shop Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold bg-black/60 backdrop-blur-md text-white rounded-full shadow-sm uppercase tracking-wider text-[10px]">
            {product.shop?.shop_name || 'Store'}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.id}`} className="mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            {product.title}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <RatingStars rating={4.5} count={128} />
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => {
              const cart = JSON.parse(localStorage.getItem('cart')) || [];
              const idx = cart.findIndex(i => i.id === product.id);
              if (idx >= 0) {
                cart[idx].quantity += 1;
              } else {
                cart.push({
                  id: product.id,
                  title: product.title,
                  price: Number(product.price) || 0,
                  quantity: 1,
                  shop_id: product.shop?.id || null,
                });
              }
              localStorage.setItem('cart', JSON.stringify(cart));
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}