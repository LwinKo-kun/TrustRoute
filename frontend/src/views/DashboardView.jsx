import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardView() {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-1 flex-col p-6 space-y-6 text-left">
            <div className="flex justify-between items-center bg-[var(--code-bg)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow)]">
                <div>
                    <h2>Welcome, {user?.name}</h2>
                    <p className="text-sm mt-1">
                        Role: <span className="text-[var(--accent)] font-semibold uppercase">{user?.role}</span>
                    </p>
                </div>
                <button 
                    onClick={logout} 
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-semibold transition cursor-pointer text-sm"
                >
                    Sign Out
                </button>
            </div>

            <div className="bg-[var(--code-bg)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow)]">
                <h3>Network Status</h3>
                <p className="text-sm mt-1">Connected to TrustRoute Coordinator & P2P Validator Mesh.</p>
            </div>
        </div>
    );
}