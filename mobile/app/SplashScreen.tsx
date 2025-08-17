import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

SplashScreen.preventAutoHideAsync();

// Define custom animations
Animatable.initializeRegistryWithDefinitions({
  glitch: {
    0: { translateX: 0 },
    0.2: { translateX: -5 },
    0.4: { translateX: 5 },
    0.6: { translateX: -3 },
    0.8: { translateX: 3 },
    1: { translateX: 0 },
  },
  fadeOutScale: {
    0: { opacity: 1, scaleX: 1, scaleY: 1 },
    0.5: { opacity: 0.7, scaleX: 1.1, scaleY: 1.1 },
    1: { opacity: 0, scaleX: 0.8, scaleY: 0.8 },
  },
});

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDone(true);
    },5000); // Total duration 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/Icon.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.7)", "rgba(75, 0, 130, 0.8)", "rgba(0, 255, 255, 0.3)"]}
        style={styles.gradient}
      >
        <Animatable.View
          animation={animationDone ? "fadeOutScale" : undefined}
          duration={800}
          style={styles.container}
          onAnimationEnd={() => {
            if (animationDone) {
              SplashScreen.hideAsync();
              onFinish();
            }
          }}
        >
          <Animatable.Image
            animation={{
              0: { scaleX: 0, scaleY: 0, opacity: 0 },
              0.5: { scaleX: 1.2, scaleY: 1.2, opacity: 1 },
              0.7: { scaleX: 0.9, scaleY: 0.9 },
              1: { scaleX: 1, scaleY: 1 },
            }}
            duration={1200}
            source={require("../assets/Icon.png")}
            style={styles.logo}
          />
          <Animatable.Text
            animation={animationDone ? "glitch" : "glitch"}
            iterationCount={animationDone ? 1 : 2}
            delay={1000}
            duration={600}
            style={styles.text}
          >
            PulseStream
          </Animatable.Text>
        </Animatable.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 2,
    borderColor: "#00FFFF",
    borderRadius: 15,
    margin: 20,
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: 180,
    height: 180,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#00FFFF",
    marginTop: 30,
    textShadowColor: "#FF00FF",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 12,
    fontFamily: "monospace",
  },
});