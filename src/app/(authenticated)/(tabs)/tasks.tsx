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
import { FlatList, Pressable, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export default function TasksScreen() {
  const { session } = useGlobalSession();
  if (!session || !session.user) return;

  const { tasks } = useTasks({ userId: session.user.id });
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <BasicLayout>
      <Card variant="filled" size="sm">
        <FlatList data={tasks} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => <TaskItem task={item} />} />
      </Card>
      <Fab onPress={() => setShowDrawer(true)}>
        <FabIcon as={AddIcon} size="lg" />
      </Fab>
      <TaskFormDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} userId={session.user.id} />
    </BasicLayout>
  );
}

const TaskFormDrawer = ({ isOpen, onClose, userId }: { isOpen: boolean; onClose: () => void; userId: string }) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  const mutation = useMutation({
    mutationFn: async (task: Database['public']['Tables']['tasks']['Insert']) => {
      const { data, error } = await supabase.from('tasks').insert(task);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    },
  });

  const addTask = async () => {
    if (title.length === 0) return;
    mutation.mutate({
      title: title,
      user_id: userId,
    });
    setTitle('');
    onClose();
  };

  return (
    <Drawer anchor="bottom" isOpen={isOpen} onClose={onClose}>
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerBody>
          <Input variant="none">
            <InputField placeholder="何をしたいですか？" autoFocus autoCapitalize="none" value={title} onChangeText={setTitle} />
          </Input>
        </DrawerBody>
        <DrawerFooter>
          <Fab size="lg" isDisabled={title.length === 0} onPress={() => addTask()}>
            <FabIcon as={ArrowUpIcon} size="lg" />
          </Fab>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const TaskItem = ({ task }: { task: Task }) => {
  return (
    <ReanimatedSwipeable renderRightActions={RightAction} friction={2} rightThreshold={10} overshootFriction={8} enableTrackpadTwoFingerGesture>
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
    </ReanimatedSwipeable>
  );
};

const RightAction = (drag: SharedValue<number>) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: (drag.value * -60) + 60 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <Pressable className="bg-red-500 justify-center items-center px-3 rounded">
        <Text className="text-white font-bold">削除</Text>
      </Pressable>
    </Reanimated.View>
  );
};
