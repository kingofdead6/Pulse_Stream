import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, {
        email: formData.email.trim(),
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/admindashboard', { replace: true });
      } else {
        setError('No token received from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white py-20 px-6 md:px-16 flex items-center justify-center"
    >
      <div className="bg-black/60 backdrop-blur-md rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.6)] p-8 max-w-md w-full transition-all duration-500 hover:shadow-[0_0_60px_rgba(236,72,153,0.7)]">
        <h2 className="text-4xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 animate-pulse tracking-tight">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="admin@example.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block mb-1 text-sm text-gray-300">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute top-10 right-3 cursor-pointer text-gray-600 hover:text-black"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className={`cursor-pointer w-full py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out ${
              isLoading
                ? 'bg-gray-800/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-600/50'
            } transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;