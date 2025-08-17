import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "../global.css";
import Hero from '@/components/Hero';
import Lives from '@/components/Lives';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Hero">
        <Stack.Screen 
          name="Hero" 
          component={Hero} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Lives" 
          component={Lives} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
