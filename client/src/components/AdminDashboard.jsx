import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api';

const AdminDashboard = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [lives, setLives] = useState([]);
  const [form, setForm] = useState({ title: '', url: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Check token and redirect if not present
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchLives();
    }
  }, [token, navigate]);

  const fetchLives = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/lives`);
      setLives(res.data);
    } catch (err) {
      setError('Failed to fetch live streams. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/lives`, {
        title: form.title,
        url: form.url,
        isLive: true,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setForm({ title: '', url: '' });
      setIsModalOpen(false);
      fetchLives();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add live stream.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/lives/${id}`);
      fetchLives();
    } catch (err) {
      setError('Failed to delete live stream.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white py-10 px-4 sm:px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 animate-pulse tracking-tight text-center sm:text-left">
            Admin Dashboard
          </h1>
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-600/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
              disabled={isLoading}
            >
              Add Live
            </button>
            <button
              onClick={handleLogout}
              className="cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold bg-gray-800/60 hover:bg-gray-700/70 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        {/* Loading State */}
        {isLoading && <p className="text-center text-gray-300 mb-4">Loading...</p>}

        {/* Modal for Adding Live */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-[0_0_20px_rgba(168,85,247,0.6)] p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto transition-all duration-500">
              <h2 className="text-xl sm:text-2xl font-semibold text-purple-200 mb-4 sm:mb-6 text-center">Add New Live Stream</h2>
              <form onSubmit={handleAdd} className="space-y-4 sm:space-y-5">
                <div>
                  <label htmlFor="title" className="block mb-1 text-xs sm:text-sm text-gray-300">Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter live stream title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100 text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block mb-1 text-xs sm:text-sm text-gray-300">URL</label>
                  <input
                    id="url"
                    type="text"
                    placeholder="Enter live stream URL"
                    value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100 text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className={`cursor-pointer flex-1 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 ease-in-out ${
                      isLoading
                        ? 'bg-gray-800/60 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-600/50'
                    } transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add Live'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="cursor-pointer flex-1 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold bg-gray-800/60 hover:bg-gray-700/70 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lives Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {lives.length > 0 ? (
            lives.map(live => (
              <div
                key={live._id}
                className="relative bg-gray-800/70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-600/50 transition-all duration-300 transform hover:-translate-y-2"
              >
                <img
                  src={`https://img.youtube.com/vi/${live.url.split("/embed/")[1]}/0.jpg`}
                  alt={live.title}
                  className="w-full h-48 sm:h-56 object-cover transition-transform duration-300"
                />
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-100 tracking-tight">{live.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2">URL:</p>
                  <a
                    href={live.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-blue-400 hover:underline mt-1 block truncate"
                  >
                    {live.url}
                  </a>
                  <button
                    onClick={() => handleDelete(live._id)}
                    className="cursor-pointer mt-3 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-base sm:text-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-400/50"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300 col-span-full text-sm sm:text-base">No live streams found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;