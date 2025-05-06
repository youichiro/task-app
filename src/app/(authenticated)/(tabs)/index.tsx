import { Redirect } from 'expo-router';

export default function TabIndexScreen() {
  return <Redirect href="/(authenticated)/(tabs)/calendar" />;
}
