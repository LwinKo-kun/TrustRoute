import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const payload = { name, email };
      if (currentPassword && newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }
      const res = await api.put('/profile', payload);
      setMessage(res.data.message || 'Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Profile Settings</h1>
      
      {message && <div className="p-4 mb-6 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold">{message}</div>}
      {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-xl text-sm font-semibold">{error}</div>}

      <form onSubmit={handleUpdate} className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-transparent text-slate-900 dark:text-white text-sm"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-transparent text-slate-900 dark:text-white text-sm"
              required 
            />
          </div>
        </div>

        <hr className="border-slate-100 dark:border-white/5 my-2" />

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Change Password (Optional)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Current Password</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              className="w-full p-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-transparent text-slate-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="w-full p-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-transparent text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}