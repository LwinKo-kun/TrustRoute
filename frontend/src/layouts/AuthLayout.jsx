import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6 bg-[var(--bg)]">
      <div className="w-full max-w-md p-8 border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] bg-[var(--bg)]">
        <div className="mb-6">
          <span className="text-xl font-bold tracking-tight text-[var(--text-h)]">Trust<span className="text-[var(--accent)]">Route</span></span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}