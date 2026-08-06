import React from 'react';

export default function Input({ label, type = 'text', name, value, onChange, placeholder, error, required = false, className = '' }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
          }
          ${className}
        `}
        required={required}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}