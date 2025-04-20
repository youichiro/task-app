import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

export default function TabIndexScreen() {
  return <Redirect href="/(tabs)/auth" />;
}
