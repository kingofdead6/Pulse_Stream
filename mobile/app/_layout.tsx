import { Stack } from "expo-router";
import { useState } from "react";
import AnimatedSplash from "./SplashScreen";
import "../global.css";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
