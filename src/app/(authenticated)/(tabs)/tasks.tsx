import { Text } from '@/components/ui/text';
import { useGlobalSession } from '@/hooks/useGlobalSession';
import { useTasks } from '@/hooks/useTasks';
import BasicLayout from '@/layouts/basicLayout';
import { View } from 'react-native';

export default function TasksScreen() {
  const { session } = useGlobalSession();
  if (!session || !session.user) return;

  const { tasks } = useTasks({ userId: session.user.id });

  return (
    <BasicLayout>
      <Text>タスク一覧</Text>
      {tasks?.map((task) => (
        <View key={task.id} className="py-2 border-b border-gray-200">
          <Text>{task.title}</Text>
        </View>
      ))}
    </BasicLayout>
  );
}
