import { Card } from '@/components/ui/card';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { Fab, FabIcon } from '@/components/ui/fab';
import { AddIcon, ArrowUpIcon, CheckIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useGlobalSession } from '@/hooks/useGlobalSession';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/hooks/useTasks';
import BasicLayout from '@/layouts/basicLayout';
import type { Database } from '@/libs/database.types';
import { supabase } from '@/libs/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { View } from 'react-native';

export default function TasksScreen() {
  const { session } = useGlobalSession();
  if (!session || !session.user) return;

  const queryClient = useQueryClient();
  const { tasks } = useTasks({ userId: session.user.id });
  const [showDrawer, setShowDrawer] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

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

  const mutation = useMutation({
    mutationFn: async (task: Database['public']['Tables']['tasks']['Insert']) => {
      const {data, error } = await supabase.from('tasks').insert(task);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', session.user.id] });
    },
  });

  const addTask = async () => {
    if (taskTitle.length === 0) return;
    mutation.mutate({
      title: taskTitle,
      user_id: session.user.id,
    });
    setTaskTitle('');
    setShowDrawer(false);
  };

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
      <Drawer anchor="bottom" isOpen={showDrawer} onClose={() => setShowDrawer(false)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerBody>
            <Input variant="none">
              <InputField placeholder="何をしたいですか？" autoFocus autoCapitalize="none" value={taskTitle} onChangeText={setTaskTitle} />
            </Input>
          </DrawerBody>
          <DrawerFooter>
            <Fab size="lg" isDisabled={taskTitle.length === 0} onPress={() => addTask()}>
              <FabIcon as={ArrowUpIcon} size="lg" />
            </Fab>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </BasicLayout>
  );
}
