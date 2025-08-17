import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";

const Lives = () => {
  const [view, setView] = useState("current");
  const [selectedLive, setSelectedLive] = useState(null);
  const [currentLive, setCurrentLive] = useState(null);
  const [previousLives, setPreviousLives] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch live streams from backend
  const fetchLives = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Fetch all live streams, sorted by createdAt descending
      const response = await axios.get(`${API_BASE_URL}/lives`, {
        params: { isLive: "true" },
      });
      
      // Get the newest live video (most recent createdAt) with isLive: true
      const sortedLives = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const newestLive = sortedLives.length > 0 ? sortedLives[0] : null;
      setCurrentLive(newestLive);

      // Fetch all previous lives (isLive: false and older isLive: true videos)
      const previousResponse = await axios.get(`${API_BASE_URL}/lives`, {
        params: { isLive: "false" },
      });
      // Include older isLive: true videos (excluding the newest one) in previous lives
      const olderLives = sortedLives.slice(1).map(live => ({
        ...live,
        thumbnail: `https://img.youtube.com/vi/${live.url.split("/embed/")[1]}/0.jpg`,
      }));
      const previousLives = [
        ...previousResponse.data,
        ...olderLives,
      ].map(live => ({
        ...live,
        thumbnail: `https://img.youtube.com/vi/${live.url.split("/embed/")[1]}/0.jpg`,
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPreviousLives(previousLives);
    } catch (err) {
      setError("Failed to fetch live streams. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch lives on component mount
  useEffect(() => {
    fetchLives();
  }, []);

  // Check if current live has ended
  useEffect(() => {
    if (currentLive) {
      const checkLiveStatus = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/lives`, {
            params: { isLive: "true" },
          });
          const sortedLives = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          if (!sortedLives.some(live => live._id === currentLive._id)) {
            // Current live is no longer active, switch to previous lives
            setView("previous");
            setCurrentLive(null);
            setSelectedLive(null);
            fetchLives(); // Refresh previous lives
          }
        } catch (err) {
          console.error("Error checking live status:", err);
        }
      };

      // Poll every 30 seconds
      const interval = setInterval(checkLiveStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [currentLive]);

  // Filter previous lives based on search query
  const filteredPreviousLives = previousLives.filter((live) =>
    live.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActiveLive = () => {
    if (view === "current" && !selectedLive && currentLive) return currentLive;
    if (view === "previous" && selectedLive) return selectedLive;
    return null;
  };

  const activeLive = getActiveLive();

  return (
    <div
      id="lives"
      className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white py-20 px-6 md:px-16"
    >
      {/* Section Header */}
      <h2 className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 animate-pulse tracking-tight">
        Live Streams
      </h2>

      {/* Toggle buttons and Search */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setView("current");
              setSelectedLive(null);
              setSearchQuery("");
            }}
            className={`cursor-pointer px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out ${
              view === "current" && !selectedLive
                ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-600/50"
                : "bg-gray-800/60 hover:bg-gray-700/70"
            } transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50`}
            disabled={isLoading}
          >
            Current Live
          </button>
          <button
            onClick={() => {
              setView("previous");
              setSelectedLive(null);
              setSearchQuery("");
            }}
            className={`cursor-pointer px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out ${
              view === "previous" || selectedLive
                ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-600/50"
                : "bg-gray-800/60 hover:bg-gray-700/70"
            } transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50`}
            disabled={isLoading}
          >
            Previous Lives
          </button>
        </div>
        {view === "previous" && !selectedLive && (
          <div className="w-full max-w-md mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous lives by title..."
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      {/* Loading State */}
      {isLoading && (
        <p className="text-center text-gray-300">Loading live streams...</p>
      )}

      {/* Active Live Player */}
      {activeLive && !isLoading && (
        <div className="flex flex-col items-center relative mb-12">
          <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-500 hover:shadow-[0_0_60px_rgba(236,72,153,0.7)] bg-black/90">
            <iframe
              src={`${activeLive.url}${view === "current" ? "?autoplay=1&mute=1" : ""}`}
              title={activeLive.title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full relative z-10"
            ></iframe>
          </div>
          <h3 className="mt-6 text-2xl font-semibold text-purple-200 animate-fade-in tracking-wide text-center">
            {activeLive.title}
          </h3>
          {selectedLive && (
            <button
              onClick={() => setSelectedLive(null)}
              className="mt-4 px-6 py-2 rounded-full text-lg font-semibold bg-gray-800/60 hover:bg-gray-700/70 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
            >
              Back to Previous Lives
            </button>
          )}
        </div>
      )}

      {/* Previous Lives Grid */}
      {view === "previous" && !selectedLive && !isLoading && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {filteredPreviousLives.length > 0 ? (
            filteredPreviousLives.map((live) => (
              <div
                key={live._id}
                className="relative bg-gray-800/70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-600/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => setSelectedLive(live)}
              >
                <img
                  src={live.thumbnail}
                  alt={live.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-semibold text-gray-100 tracking-tight">
                    {live.title}
                  </h4>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300 col-span-full">
              No previous lives found matching your search.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Lives;