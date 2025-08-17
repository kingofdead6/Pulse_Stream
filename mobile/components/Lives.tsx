import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import { API_BASE_URL } from "../api";


interface Live {
  _id: string;
  title: string;
  url: string;
  isLive: boolean;
  createdAt: string;
  thumbnail?: string;
}

const Lives: React.FC = () => {
  const [view, setView] = useState<'current' | 'previous'>('current');
  const [selectedLive, setSelectedLive] = useState<Live | null>(null);
  const [currentLive, setCurrentLive] = useState<Live | null>(null);
  const [previousLives, setPreviousLives] = useState<Live[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch live streams from backend
  const fetchLives = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/lives`, {
        params: { isLive: 'true' },
      });
      const sortedLives = response.data.sort((a: Live, b: Live) => new Date(b.createdAt) - new Date(a.createdAt));
      const newestLive = sortedLives.length > 0 ? sortedLives[0] : null;
      setCurrentLive(newestLive);

      const previousResponse = await axios.get(`${API_BASE_URL}/lives`, {
        params: { isLive: 'false' },
      });
      const olderLives = sortedLives.slice(1).map((live: Live) => ({
        ...live,
        thumbnail: `https://img.youtube.com/vi/${live.url.split('/embed/')[1]}/default.jpg`,
      }));
      const previousLives = [
        ...previousResponse.data,
        ...olderLives,
      ].map((live: Live) => ({
        ...live,
        thumbnail: `https://img.youtube.com/vi/${live.url.split('/embed/')[1]}/default.jpg`,
      })).sort((a: Live, b: Live) => new Date(b.createdAt) - new Date(a.createdAt));
      setPreviousLives(previousLives);
    } catch (err) {
      setError('Failed to fetch live streams. Please try again.');
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
            params: { isLive: 'true' },
          });
          const sortedLives = response.data.sort((a: Live, b: Live) => new Date(b.createdAt) - new Date(a.createdAt));
          if (!sortedLives.some((live: Live) => live._id === currentLive._id)) {
            setView('previous');
            setCurrentLive(null);
            setSelectedLive(null);
            fetchLives();
          }
        } catch (err) {
          console.error('Error checking live status:', err);
        }
      };

      const interval = setInterval(checkLiveStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [currentLive]);

  // Filter previous lives based on search query
  const filteredPreviousLives = previousLives.filter((live) =>
    live.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActiveLive = () => {
    if (view === 'current' && !selectedLive && currentLive) return currentLive;
    if (view === 'previous' && selectedLive) return selectedLive;
    return null;
  };

  const activeLive = getActiveLive();

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#4c1d95']}
      className="flex-1 pt-10 px-4"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Section Header */}
        <Text className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          Live Streams
        </Text>

        {/* Toggle Buttons and Search */}
        <View className="flex items-center gap-4 mb-8">
          <View className="flex flex-row gap-3">
            <TouchableOpacity
              onPress={() => {
                setView('current');
                setSelectedLive(null);
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 ${
                view === 'current' && !selectedLive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                  : 'bg-gray-800/60 active:bg-gray-700/70'
              }`}
              disabled={isLoading}
              style={{
                elevation: 3,
                shadowColor: view === 'current' && !selectedLive ? 'rgba(168, 85, 247, 0.5)' : 'transparent',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 8,
              }}
            >
              <Text className="text-white">Current Live</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setView('previous');
                setSelectedLive(null);
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 ${
                view === 'previous' || selectedLive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                  : 'bg-gray-800/60 active:bg-gray-700/70'
              }`}
              disabled={isLoading}
              style={{
                elevation: 3,
                shadowColor: view === 'previous' || selectedLive ? 'rgba(168, 85, 247, 0.5)' : 'transparent',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 8,
              }}
            >
              <Text className="text-white">Previous Lives</Text>
            </TouchableOpacity>
          </View>
          {view === 'previous' && !selectedLive && (
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search previous lives by title..."
              placeholderTextColor="#9ca3af"
              className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-100 text-black text-base border-0 focus:ring-2 focus:ring-purple-500"
            />
          )}
        </View>

        {/* Error Message */}
        {error && (
          <Text className="text-red-400 text-sm text-center mb-4">{error}</Text>
        )}

        {/* Loading State */}
        {isLoading && (
          <ActivityIndicator size="large" color="#c084fc" className="mb-4" />
        )}

        {/* Active Live Player */}
        {activeLive && !isLoading && (
          <View className="flex items-center mb-8">
            <View className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black/90">
              <WebView
                source={{ uri: `${activeLive.url}${view === 'current' ? '?autoplay=1&mute=1' : ''}` }}
                allowsFullscreenVideo
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                style={{ flex: 1 }}
              />
            </View>
            <Text className="mt-4 text-lg font-semibold text-purple-200 text-center">
              {activeLive.title}
            </Text>
            {selectedLive && (
              <TouchableOpacity
                onPress={() => setSelectedLive(null)}
                className="mt-4 px-4 py-2 rounded-full text-base font-semibold bg-gray-800/60 active:bg-gray-700/70 transition-all duration-300"
                style={{ elevation: 3 }}
              >
                <Text className="text-white">Back to Previous Lives</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Previous Lives Grid */}
        {view === 'previous' && !selectedLive && !isLoading && (
          <View className="flex flex-row flex-wrap gap-4">
            {filteredPreviousLives.length > 0 ? (
              filteredPreviousLives.map((live) => (
                <TouchableOpacity
                  key={live._id}
                  onPress={() => setSelectedLive(live)}
                  className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.67rem)] bg-gray-800/70 rounded-xl overflow-hidden shadow-lg active:opacity-80"
                  style={{
                    elevation: 3,
                    shadowColor: 'rgba(168, 85, 247, 0.5)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                  }}
                >
                  <Image
                    source={{ uri: live.thumbnail }}
                    className="w-full h-40 object-cover"
                  />
                  <View className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 active:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Text className="text-purple-400 text-2xl">▶</Text>
                  </View>
                  <View className="p-4">
                    <Text className="text-base font-semibold text-gray-100 tracking-tight">
                      {live.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-center text-gray-300 w-full text-base">
                No previous lives found matching your search.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Lives;