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

  return { tasks: data, isLoading, error };
}
