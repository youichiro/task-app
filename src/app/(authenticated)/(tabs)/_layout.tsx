import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'black', headerShadowVisible: false, tabBarShowLabel: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen
        name="tasks"
        options={{ title: '✅タスク', tabBarIcon: ({ color }) => <FontAwesome name="check" color={color} size={20} /> }}
      />
      <Tabs.Screen
        name="calendar"
        options={{ title: '📅カレンダー', tabBarIcon: ({ color }) => <FontAwesome name="calendar" color={color} size={20} /> }}
      />
      <Tabs.Screen
        name="setting"
        options={{ title: '設定', tabBarIcon: ({ color }) => <FontAwesome name="user" color={color} size={20} /> }}
      />
    </Tabs>
  );
}
