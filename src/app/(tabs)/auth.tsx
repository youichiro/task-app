import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { supabase } from '@/libs/supabase';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ログインする
  const login = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  };

  // アカウント登録する
  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  };

  const isValid = () => {
    return email.length > 0 && password.length > 0;
  };

  return (
    <SafeAreaView>
      <View className="gap-6 m-4">
        {/* メールアドレスフォーム */}
        <FormControl isRequired={true}>
          <FormControlLabel>
            <FormControlLabelText>メールアドレス</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="example@gmail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />
          </Input>
        </FormControl>

        {/* パスワードフォーム */}
        <FormControl isRequired={true}>
          <FormControlLabel>
            <FormControlLabelText>パスワード</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>
          <FormControlHelper>
            <FormControlHelperText>パスワードは8文字以上で、英字と数字を含めてください</FormControlHelperText>
          </FormControlHelper>
        </FormControl>

        <View className="gap-2">
          {/* ログインボタン */}
          <Button onPress={login} isDisabled={loading || !isValid()} action="primary">
            <ButtonText>{loading ? 'Loading...' : 'ログイン'}</ButtonText>
          </Button>
          {/* アカウント登録ボタン */}
          <Button onPress={signUp} isDisabled={loading || !isValid()} action="secondary">
            <ButtonText>{loading ? 'Loading...' : 'アカウント登録'}</ButtonText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
