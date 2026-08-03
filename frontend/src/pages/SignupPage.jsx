import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <p className="text-sm mb-6">Register a new operator profile for the TrustRoute network.</p>
      {error && <div className="p-3 mb-4 text-xs text-red-500 bg-red-500/10 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Input label="Full Name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Mercer" />
        <Input label="Email Address" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@trustroute.io" />
        <Input label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <Button type="submit" className="w-full mt-2">Register Node</Button>
      </form>
      <p className="text-xs mt-6">Already registered? <Link to="/login" className="text-[var(--accent)] font-medium hover:underline">Sign in</Link></p>
    </div>
  );
}