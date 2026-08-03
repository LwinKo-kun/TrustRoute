// frontend/src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <p className="text-sm mb-6">Register a profile on TrustRoute.</p>
      {error && <div className="p-3 mb-4 text-xs text-red-500 bg-red-500/10 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full Name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Mercer" />
        <Input label="Email Address" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@trustroute.io" />
        
        {/* Password field with absolute-positioned eye toggle button */}
        <div className="relative flex flex-col text-left">
          <Input 
            label="Password" 
            type={showPassword ? 'text' : 'password'} 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-xs font-medium opacity-60 hover:opacity-100 transition focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye Slash Icon (Hide)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              // Eye Icon (View)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs font-medium text-[var(--text-h)]">Account Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="p-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-h)]"
          >
            <option value="customer">Customer</option>
            <option value="shopkeeper">Shopkeeper</option>
            <option value="delivery">Delivery Agent</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <Button type="submit" className="w-full mt-2">Register</Button>
      </form>
      <p className="text-xs mt-6">Already registered? <Link to="/login" className="text-[var(--accent)] font-medium hover:underline">Sign in</Link></p>
    </div>
  );
}