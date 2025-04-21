import type React from 'react';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="tasks" options={{ headerShown: false }} />
      <Tabs.Screen name="account" options={{ title: 'アカウント' }} />
    </Tabs>
  );
}
