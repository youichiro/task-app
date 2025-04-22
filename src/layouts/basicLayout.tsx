import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BasicLayout({ children, withSafeArea = false }: { children: React.ReactNode; withSafeArea?: boolean }) {
  if (withSafeArea) {
    return <SafeAreaView className="flex-1 bg-white p-4">{children}</SafeAreaView>;
  }
  return <View className="flex-1 bg-white p-4">{children}</View>;
}
