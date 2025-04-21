import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useGlobalSession } from '@/hooks/useGlobalSession';
import { supabase } from '@/libs/supabase';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountScreen() {
  const { session } = useGlobalSession();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('ログアウトに失敗しました', error.message);
  };

  return (
    <SafeAreaView>
      <View className="gap-6 p-4">
        {session?.user ? (
          <View>
            <Text>ログイン中</Text>
            <Text>email: {session.user.email}</Text>
          </View>
        ) : (
          <Text>ログインしていません</Text>
        )}

        <Button onPress={logout} isDisabled={!session}>
          <ButtonText>ログアウト</ButtonText>
        </Button>
      </View>
    </SafeAreaView>
  );
}
