// src/pages/DisputePage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DisputePage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    
    const [category, setCategory] = useState('Item Not Received');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Combine category and details into the single 'reason' field required by the DB
        const fullReason = `[${category}] - ${details}`;

        try {
            await api.post(`/orders/${orderId}/disputes`, { reason: fullReason });
            alert("Dispute opened. Escrow funds have been frozen pending Admin review.");
            navigate(`/orders/${orderId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to open dispute.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 p-6 rounded-2xl mb-8">
                <h1 className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 mb-2">Open Escrow Dispute</h1>
                <p className="text-sm text-rose-600 dark:text-rose-300">
                    Opening a dispute will freeze the Escrow funds for Order #{orderId}. An admin will review the chat logs to make a final arbitration ruling.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0d1326] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 flex flex-col gap-6">
                {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">{error}</div>}
                
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Complaint Category</label>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070b1c] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                        <option>Item Not Received</option>
                        <option>Item Damaged / Defective</option>
                        <option>Item Not As Described</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Detailed Evidence</label>
                    <textarea 
                        rows="5"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Explain exactly what happened..."
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070b1c] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        required
                    ></textarea>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition flex-1">Cancel</button>
                    <button type="submit" disabled={loading || details.length < 5} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition flex-1 disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Submit Dispute'}
                    </button>
                </div>
            </form>
        </div>
    );
}