import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import LinearGradient from 'react-native-linear-gradient';

const Hero: React.FC = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Lives');
  };

  return (
    <View className="relative w-full h-screen">
      {/* Background Video */}
      <Video
        source={{ uri: 'https://res.cloudinary.com/dtwa3lxdk/video/upload/v1755447122/5278-182817488_medium_zjhgtt.mp4' }}
        rate={1.0}
        isMuted
        isLooping
        shouldPlay
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(112, 26, 117, 0.7)', 'rgba(49, 46, 129, 0.5)', 'rgba(0, 0, 0, 0.7)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View className="relative z-10 flex-1 items-center justify-center px-4">
        <Text className="text-4xl font-bold text-white tracking-wide shadow-md">
          PulseStream
        </Text>
        <Text className="mt-4 text-lg text-purple-200 text-center">
          Watch live events and replays anytime, anywhere
        </Text>
        <TouchableOpacity
          onPress={handlePress}
          className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia-500/50 to-indigo-600/50 active:opacity-80 shadow-lg"
          style={{
            elevation: 5, // Android shadow
            shadowColor: 'rgba(192, 132, 252, 0.7)', // iOS shadow
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 20,
          }}
        >
          <Text className="text-white text-base font-semibold">View Live Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Hero;