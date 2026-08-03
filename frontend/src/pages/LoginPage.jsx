import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to authenticate.');
    }
  };

  return (
    <div>
      <h2>Welcome Back</h2>
      <p className="text-sm mb-6">Enter your credentials to access your validator node dashboard.</p>
      {error && <div className="p-3 mb-4 text-xs text-red-500 bg-red-500/10 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Input label="Email Address" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@trustroute.io" />
        <Input label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <Button type="submit" className="w-full mt-2">Sign In</Button>
      </form>
      <p className="text-xs mt-6">Don't have an account? <Link to="/signup" className="text-[var(--accent)] font-medium hover:underline">Sign up</Link></p>
    </div>
  );
}