import { Spinner } from '@/components/ui/spinner';
import { useGlobalSession } from '@/hooks/useGlobalSession';
import { supabase } from '@/libs/supabase';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout() {
  const { session, setSession } = useGlobalSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 現在のセッションを取得する
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // セッションの変化を監視する
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);

  if (loading) {
    return <Spinner />;
  }

  // 未ログインの場合は認証画面にリダイレクトする
  if (!session) {
    return <Redirect href="/auth" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
