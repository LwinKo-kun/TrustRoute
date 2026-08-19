import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/layout/Layout';

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data.data || []);
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/addresses', {
        title,
        recipient_name: recipientName,
        phone,
        street_address: streetAddress,
        city,
        postal_code: postalCode,
        is_default: isDefault,
      });
      setShowForm(false);
      setTitle(''); setRecipientName(''); setPhone(''); setStreetAddress(''); setCity(''); setPostalCode('');
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save address.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete address.');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Shipping Addresses</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage delivery locations for seamless checkout.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition"
          >
            {showForm ? 'Cancel' : '+ Add Address'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddAddress} className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Address Label (e.g., Home, Office)" value={title} onChange={e => setTitle(e.target.value)} className="p-3 border rounded-xl dark:bg-transparent" required />
            <input type="text" placeholder="Recipient Name" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="p-3 border rounded-xl dark:bg-transparent" required />
            <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="p-3 border rounded-xl dark:bg-transparent" required />
            <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="p-3 border rounded-xl dark:bg-transparent" required />
            <input type="text" placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="p-3 border rounded-xl dark:bg-transparent" />
            <textarea placeholder="Street Address" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} className="p-3 border rounded-xl dark:bg-transparent sm:col-span-2" required />
            <label className="flex items-center gap-2 sm:col-span-2 text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} /> Set as default shipping address
            </label>
            <button type="submit" className="sm:col-span-2 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow">Save Address</button>
          </form>
        )}

        {loading ? <p className="text-center text-slate-400 py-10">Loading addresses...</p> : addresses.length === 0 ? (
          <p className="text-center text-slate-400 py-10 bg-white dark:bg-[#0d1326] rounded-2xl border">No saved shipping addresses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{addr.title}</h3>
                    {addr.is_default && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full uppercase">Default</span>}
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{addr.recipient_name} ({addr.phone})</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{addr.street_address}, {addr.city} {addr.postal_code}</p>
                </div>
                <button onClick={() => handleDelete(addr.id)} className="self-end px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-500 hover:text-white transition">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}