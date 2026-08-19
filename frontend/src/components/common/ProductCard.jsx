import React from 'react';
import { Link } from 'react-router-dom';
import { getListingImageUrl } from '../../services/api';

export default function ProductCard({ product, actionButton }) {
  const shopName = product.shop?.shop_name || product.shop?.name || 'Store';
  const shopId = product.shop?.id;

  return (
    <div className="group border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0d1326] flex flex-col shadow-sm hover:shadow-md transition">
      <Link to={`/listings/${product.id}`} className="flex flex-col flex-grow">
        <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
          <img
            src={getListingImageUrl(product.id)}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300 relative z-10 bg-slate-100 dark:bg-slate-800"
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = `https://picsum.photos/seed/${product.id * 10}/400/300`; 
            }}
          />
          
          <Link 
            to={shopId ? `/shops/${shopId}` : '/marketplace'}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 left-3 bg-black/70 hover:bg-blue-600 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider z-20 shadow transition"
          >
            🏪 {shopName}
          </Link>
          
          {product.stock === 0 ? (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
              <span className="text-white text-xs font-bold uppercase tracking-wider">Out of Stock</span>
            </div>
          ) : (
            <div className={`absolute top-3 right-3 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold z-20 shadow-sm ${product.stock <= 5 ? 'bg-amber-500' : 'bg-black/60'}`}>
              {product.stock <= 5 ? 'Low Stock' : `Stock: ${product.stock}`}
            </div>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-grow gap-1.5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">{product.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{product.description || 'Verified secure listing with escrow backing.'}</p>
        </div>
      </Link>

      <div className="px-5 pb-5 pt-2 flex items-center justify-between mt-auto border-t border-slate-100 dark:border-white/5">
        <span className="text-lg font-extrabold text-blue-600 dark:text-cyan-400">${product.price}</span>
        {actionButton}
      </div>
    </div>
  );
}