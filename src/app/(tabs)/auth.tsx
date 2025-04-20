import { Input, InputField } from '@/components/ui/input';
import { supabase } from '@/libs/supabase';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // メールアドレスでログインする
  const signInWithEmail = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false)
  };

  // メールアドレスでアカウント登録する
  const signUpWithEmail = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false)
  }

  return (
    <View>
      <Text>AuthScreen</Text>
      <Input>
        <InputField type="text" placeholder='Email' />
      </Input>
    </View>
  )
}
