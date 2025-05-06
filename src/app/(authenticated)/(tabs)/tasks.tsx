import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { Fab, FabIcon } from '@/components/ui/fab';
import { AddIcon, ArrowUpIcon, CheckIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useGlobalSession } from '@/hooks/useGlobalSession';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/hooks/useTasks';
import BasicLayout from '@/layouts/basicLayout';
import type { Database } from '@/libs/database.types';
import { supabase } from '@/libs/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, Pressable, View, SectionList } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { type SharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';

export default function TasksScreen() {
  const { session } = useGlobalSession();
  if (!session || !session.user) return;

  const queryClient = useQueryClient();
  const { incompletedTasks, completedTasks, isLoading } = useTasks({ userId: session.user.id });
  const [showDrawer, setShowDrawer] = useState(false);

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const { data, error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', session.user.id] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: number; isCompleted: boolean }) => {
      const updatedAt = new Date().toISOString();
      const { data, error } = await supabase.from('tasks').update({ is_completed: isCompleted, updated_at: updatedAt }).eq('id', taskId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', session.user.id] });
    },
  });

  const deleteTask = (taskId: number) => {
    deleteTaskMutation.mutate(taskId);
  };

  const updateTask = (taskId: number, isCompleted: boolean) => {
    updateTaskMutation.mutate({ taskId, isCompleted: !isCompleted });
  };

  const sections = [
    { title: '未完了', data: incompletedTasks },
    { title: '完了済み', data: completedTasks },
  ];

  if (isLoading) {
    return (
      <BasicLayout>
        <View className="flex-1 justify-center items-center">
          <Spinner size="large" />
        </View>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TaskItem task={item} deleteTask={deleteTask} updateTask={updateTask} />}
        renderSectionHeader={({ section: { title, data } }) => data.length > 0 ? <Text>{title}</Text> : null }
        stickySectionHeadersEnabled={false}
      />
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

const ACTION_WIDTH = 70;

const TaskItem = ({
  task,
  deleteTask,
  updateTask,
}: {
  task: Task;
  deleteTask: (taskId: number) => void;
  updateTask: (taskId: number, isCompleted: boolean) => void;
}) => {
  const onDelete = () => {
    Alert.alert('削除しますか？', 'このタスクを削除します。', [
      {
        text: 'キャンセル',
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: '削除',
        onPress: () => deleteTask(task.id),
        style: 'destructive',
      },
    ]);
  };

  return (
    <ReanimatedSwipeable
      renderRightActions={(progress, dragX) => RightAction(progress, dragX, onDelete)}
      friction={2}
      rightThreshold={ACTION_WIDTH / 2}
      overshootFriction={8}
      enableTrackpadTwoFingerGesture
    >
      <View className="p-2">
        <Checkbox
          value={task.id.toString()}
          isChecked={task.is_completed}
          onChange={() => updateTask(task.id, task.is_completed)}
          aria-label={task.title}
        >
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
          <CheckboxLabel size="sm">
            <Text bold>{task.title}</Text>
          </CheckboxLabel>
        </Checkbox>
      </View>
    </ReanimatedSwipeable>
  );
};

const RightAction = (progress: SharedValue<number>, dragX: SharedValue<number>, onDelete: () => void) => {
  const styleAnimation = useAnimatedStyle(() => {
    const translateX = interpolate(dragX.value, [-ACTION_WIDTH, 0], [0, ACTION_WIDTH], Extrapolation.CLAMP);
    return { transform: [{ translateX }] };
  });

  return (
    <View style={{ width: ACTION_WIDTH }} className="flex-row justify-end">
      <Reanimated.View style={[{ flex: 1 }, styleAnimation]}>
        <Pressable className="bg-red-500 justify-center items-center h-full rounded" onPress={onDelete}>
          <Text className="text-white font-bold">削除</Text>
        </Pressable>
      </Reanimated.View>
    </View>
  );
};
