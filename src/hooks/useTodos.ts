import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { addTodo, todosListQuery } from '@/db/repositories/todos.repository';

export function useTodos() {
  const { data: fetchedTodos } = useLiveQuery(todosListQuery());

  return {
    fetchedTodos,
    addTodo,
  };
}
