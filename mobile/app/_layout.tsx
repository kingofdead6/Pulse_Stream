import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import "../global.css";
import Hero from '@/components/Hero';
import Lives from '@/components/Lives';

const Stack = createStackNavigator();
const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Hero" component={Hero} />
      <Stack.Screen name="Lives" component={Lives} />
    </Stack.Navigator>
  </NavigationContainer>
);