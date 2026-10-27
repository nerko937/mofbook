import { useRef } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import {
  addTodo,
  addTodoGroup,
  addTodoItem as addTodoItemToDb,
  todoGroupsForTodoQuery,
  todoItemsWithGroupsQuery,
  todosListQuery,
  deleteTodoItems,
  deleteTodo
} from '@/db/todos.repository';

export function useTodos() {
  const { data: fetchedTodos } = useLiveQuery(todosListQuery());

  return {
    fetchedTodos,
    addTodo,
    deleteTodo
  };
}

export function useTodoGroups(todoId: number) {
  const { data: fetchedGroups } = useLiveQuery(todoGroupsForTodoQuery(todoId), [todoId]);

  return {
    fetchedGroups,
    addTodoGroup,
  }
}

export function useTodoItems(todoId: number) {
  const { data: itemsWithGroups } = useLiveQuery(
    todoItemsWithGroupsQuery(todoId),
    [todoId],
  );

  const addingRef = useRef(false);

  const addTodoItem = async (input: { groupId: number; content: string }) => {
    if (addingRef.current) return;
    addingRef.current = true;
    try {
      await addTodoItemToDb(input);
    } finally {
      addingRef.current = false;
    }
  };

  return {
    itemsWithGroups,
    addTodoItem,
    deleteTodoItems,
  };
}
