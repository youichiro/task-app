import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useGlobalSession } from '@/hooks/useGlobalSession';
import BasicLayout from '@/layouts/basicLayout';
import { supabase } from '@/libs/supabase';
import { Alert, View } from 'react-native';

export default function SettingScreen() {
  const { session } = useGlobalSession();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('ログアウトに失敗しました', error.message);
  };

  return (
    <BasicLayout>
      <View className="gap-6">
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
    </BasicLayout>
  );
}
