import { supabase } from '@/libs/supabase';
import { useQuery } from '@tanstack/react-query';

export type Task = Awaited<ReturnType<typeof fetch>>[number];

const fetch = async (userId: string) => {
  const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId);
  if (error) {
    throw error;
  }
  return data;
};

export function useTasks({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: async () => fetch(userId),
    enabled: !!userId,
  });

  const incompletedTasks = data?.filter((task) => !task.is_completed) ?? [];
  const completedTasks = data?.filter((task) => task.is_completed) ?? [];

  return { tasks: data, incompletedTasks, completedTasks, isLoading, error };
}
