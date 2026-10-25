import { useRef } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import {
  addTodoItem,
  todoGroupsForTodoQuery,
  todoItemsWithGroupsQuery,
} from '@/db/repositories/todo-items.repository';

export function useTodoItems(todoId: number) {
  const { data: groups } = useLiveQuery(todoGroupsForTodoQuery(todoId), [todoId]);
  const { data: itemsWithGroups } = useLiveQuery(
    todoItemsWithGroupsQuery(todoId),
    [todoId],
  );

  const addingRef = useRef(false);

  const addItem = async (input: { groupId: number; content: string }) => {
    if (addingRef.current) return;
    addingRef.current = true;
    try {
      await addTodoItem(input);
    } finally {
      addingRef.current = false;
    }
  };

  return {
    groups,
    itemsWithGroups,
    addItem,
  };
}
