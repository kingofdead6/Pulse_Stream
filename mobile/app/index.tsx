import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";
import { API_BASE_URL } from "../api";

interface Live {
  _id: string;
  title: string;
  url: string;
  isLive: boolean;
  createdAt: string;
  thumbnail?: string;
}

// Helper: Extract YouTube ID safely from any link format
const getYouTubeId = (url: string): string | null => {
  try {
    if (url.includes("embed/")) {
      return url.split("embed/")[1].split(/[?&]/)[0];
    }
    if (url.includes("watch?v=")) {
      return url.split("watch?v=")[1].split("&")[0];
    }
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split(/[?&]/)[0];
    }
    return null;
  } catch {
    return null;
  }
};

const Lives: React.FC = () => {
  const [currentLive, setCurrentLive] = useState<Live | null>(null);
  const [previousLives, setPreviousLives] = useState<Live[]>([]);
  const [selectedLive, setSelectedLive] = useState<Live | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLives = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/lives`);
      const allLives = response.data.sort(
        (a: Live, b: Live) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const newestLive = allLives.find((live: Live) => live.isLive);
      if (newestLive) {
        const videoId = getYouTubeId(newestLive.url);
        setCurrentLive({
          ...newestLive,
          thumbnail: videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : undefined,
        });
      } else {
        setCurrentLive(null);
      }

      const previousLives = allLives
        .filter((live: Live) => !live.isLive || live._id !== newestLive?._id)
        .map((live: Live) => {
          const videoId = getYouTubeId(live.url);
          return {
            ...live,
            thumbnail: videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : undefined,
          };
        });

      setPreviousLives(previousLives);
    } catch (err) {
      setError("⚠️ Failed to fetch live streams. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLives();
  }, []);

  const filteredPreviousLives = previousLives.filter((live) =>
    live.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-gray-900"
      >
    <View style={styles.container}>
      {/* Full-screen hero section */}
      <View style={styles.heroSection}>
        <Video
          source={{
            uri: "https://res.cloudinary.com/dtwa3lxdk/video/upload/v1755447122/5278-182817488_medium_zjhgtt.mp4",
          }}
          isLooping
          shouldPlay
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["rgba(112,26,117,0.7)", "rgba(49,46,129,0.5)", "rgba(0,0,0,0.7)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>PulseStream</Text>
          <Text style={{marginTop: 16,fontSize: 14,color: "#c8b5ff"}} >
            Watch live events and replays anytime, anywhere
          </Text>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={["#0f172a", "#1e1b4b", "#4c1d95"]}
          style={styles.scrollContainer}
        >
          <Text style={styles.sectionTitle}>
            🎥 Live Streams
          </Text>

          {/* Error */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Loader */}
          {isLoading && <ActivityIndicator size="large" color="#c084fc" style={styles.loader} />}

          {/* Current Live */}
          {currentLive && !selectedLive && !isLoading && (
            <View style={styles.liveContainer}>
              <Text style={styles.liveTitle}>🔴 Current Live</Text>
              <View style={styles.videoContainer}>
                <WebView
                  source={{ uri: `${currentLive.url}?autoplay=1&mute=1` }}
                  allowsFullscreenVideo
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction={false}
                  style={styles.webView}
                />
              </View>
              <Text style={styles.videoTitle}>{currentLive.title}</Text>
            </View>
          )}

          {/* Selected Previous Live */}
          {selectedLive && (
            <View style={styles.liveContainer}>
              <Text style={styles.liveTitle}>📼 Previous Live</Text>
              <View style={styles.videoContainer}>
                <WebView
                  source={{ uri: selectedLive.url }}
                  allowsFullscreenVideo
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction={false}
                  style={styles.webView}
                />
              </View>
              <Text style={styles.videoTitle}>{selectedLive.title}</Text>
              <TouchableOpacity
                onPress={() => setSelectedLive(null)}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>⬅ Back to List</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Previous Lives List */}
          {!selectedLive && !isLoading && (
            <View>
              <Text style={styles.liveTitle}>📺 Previous Lives</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="🔍 Search previous lives..."
                placeholderTextColor="#9ca3af"
                style={styles.searchInput}
              />
              {filteredPreviousLives.length > 0 ? (
                <View style={styles.previousLivesContainer}>
                  {filteredPreviousLives.map((live) => (
                    <TouchableOpacity
                      key={live._id}
                      onPress={() => setSelectedLive(live)}
                      style={styles.liveCard}
                    >
                      <Image
                        source={
                          live.thumbnail
                            ? { uri: live.thumbnail }
                            : require("../assets/fallback-thumbnail.png")
                        }
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                      <View style={styles.liveCardContent}>
                        <Text style={styles.liveCardTitle}>{live.title}</Text>
                        <Text style={styles.liveCardDate}>
                          {new Date(live.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noLivesText}>No previous lives found.</Text>
              )}
            </View>
          )}
        </LinearGradient>
      </ScrollView>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: Dimensions.get("window").height, // Full screen height
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heroContent: {
    zIndex: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  heroButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#9333ea",
  },
  heroButtonText: {
    color: "white",
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    color: "white",
  },
  errorText: {
    color: "#f87171",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  loader: {
    marginBottom: 16,
  },
  liveContainer: {
    marginBottom: 24,
  },
  liveTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#d8b4fe",
    marginBottom: 12,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  webView: {
    flex: 1,
  },
  videoTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#e9d5ff",
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    backgroundColor: "rgba(139, 92, 246, 0.8)",
    alignSelf: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  searchInput: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previousLivesContainer: {
    flexDirection: "column",
    gap: 16,
  },
  liveCard: {
    backgroundColor: "rgba(79, 70, 229, 0.2)",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  thumbnail: {
    width: "100%",
    height: 192,
  },
  liveCardContent: {
    padding: 16,
  },
  liveCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f3e8ff",
  },
  liveCardDate: {
    fontSize: 12,
    color: "#d1d5db",
    marginTop: 4,
  },
  noLivesText: {
    textAlign: "center",
    color: "#d1d5db",
    fontSize: 16,
  },
});

export default Lives;