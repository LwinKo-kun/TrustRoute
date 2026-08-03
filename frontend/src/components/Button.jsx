import React from 'react';

export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '' }) {
  const baseStyles = 'px-5 py-2.5 rounded-lg font-medium transition cursor-pointer text-sm';
  const variants = {
    primary: 'bg-[var(--accent)] text-white hover:opacity-90 shadow-md',
    secondary: 'bg-[var(--code-bg)] text-[var(--text-h)] border border-[var(--border)] hover:bg-[var(--accent-bg)]',
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}