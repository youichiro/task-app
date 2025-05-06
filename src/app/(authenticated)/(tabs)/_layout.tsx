import { Tabs } from 'expo-router';
import { CalendarDaysIcon, CheckIcon, Icon, SettingsIcon } from '@/components/ui/icon';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'black', headerShadowVisible: false, tabBarShowLabel: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen
        name="tasks"
        options={{ title: '✅タスク', tabBarIcon: ({ color }) => <Icon as={CheckIcon} color={color} size="xl" /> }}
      />
      <Tabs.Screen
        name="calendar"
        options={{ title: '📅カレンダー', tabBarIcon: ({ color }) => <Icon as={CalendarDaysIcon} color={color} size="xl" /> }}
      />
      <Tabs.Screen
        name="setting"
        options={{ title: '設定', tabBarIcon: ({ color }) => <Icon as={SettingsIcon} color={color} size="xl" /> }}
      />
    </Tabs>
  );
}
