import { Card } from '@/components/ui/card';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent } from '@/components/ui/drawer';
import { Fab, FabIcon } from '@/components/ui/fab';
import { AddIcon, CheckIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useGlobalSession } from '@/hooks/useGlobalSession';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/hooks/useTasks';
import BasicLayout from '@/layouts/basicLayout';
import { useState } from 'react';
import { View } from 'react-native';

export default function TasksScreen() {
  const { session } = useGlobalSession();
  if (!session || !session.user) return;

  const { tasks } = useTasks({ userId: session.user.id });
  const [showDrawer, setShowDrawer] = useState(false);

  const TaskItem = ({ task }: { task: Task }) => (
    <View className="p-2">
      <Checkbox value="checkbox" isChecked={task.is_completed}>
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel size="sm" className="text-primary font-bold">
          {task.title}
        </CheckboxLabel>
      </Checkbox>
    </View>
  );

  return (
    <BasicLayout>
      <Card variant="filled" size="sm">
        {tasks?.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </Card>
      <Fab onPress={() => setShowDrawer(true)}>
        <FabIcon as={AddIcon} size="lg" />
      </Fab>
      <Drawer anchor='bottom' isOpen={showDrawer} onClose={() => setShowDrawer(false)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerBody>
            <Text>aaa</Text>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </BasicLayout>
  );
}
