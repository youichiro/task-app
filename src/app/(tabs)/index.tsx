import { Input, InputField } from '@/components/ui/input';
import { Text, View } from 'react-native';

export default function TabOneScreen() {
  return (
    <View>
      <Text>Tab One</Text>
      <Text>Email</Text>
      <Input>
        <InputField type="text" placeholder="Email" />
      </Input>
    </View>
  );
}
