import React from 'react';

export default function Input({ label, type = 'text', name, value, onChange, placeholder, error }) {
  return (
    <div className="flex flex-col text-left gap-1.5 w-full mb-4">
      {label && <label className="text-sm font-medium text-[var(--text-h)]">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] focus:outline-none focus:border-[var(--accent)] transition text-sm"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}