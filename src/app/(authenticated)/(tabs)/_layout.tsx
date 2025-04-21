import type React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'black', headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="tasks" options={{ tabBarIcon: ({ color }) => <FontAwesome name="tasks" color={color} size={20} /> }} />
      <Tabs.Screen name="account" options={{ tabBarIcon: ({ color }) => <FontAwesome name="user" color={color} size={20} /> }} />
    </Tabs>
  );
}
