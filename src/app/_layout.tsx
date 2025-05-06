import FontAwesome from '@expo/vector-icons/FontAwesome';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { GlobalSessionProvider } from '@/hooks/useGlobalSession';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Reamimatedのstrictモードを無効化する
// https://docs.swmansion.com/react-native-reanimated/docs/debugging/logger-configuration/
configureReanimatedLogger({ strict: false });

export const unstable_settings = {
  // https://docs.expo.dev/router/advanced/router-settings/
  initialRouteName: '(authenticated)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const queryClient = new QueryClient();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalSessionProvider>
        <GluestackUIProvider mode="light">
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
              <Stack.Screen name="(public)" options={{ headerShown: false }} />
            </Stack>
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </GlobalSessionProvider>
    </QueryClientProvider>
  );
}
