import { useRef } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  addTodo,
  addTodoGroup,
  addTodoItem as addTodoItemToDb,
  getTodoGroupsQuery,
  getTodoItemsQuery,
  getTodosQuery,
  getTodoQuery,
  deleteTodoItems,
  deleteTodo,
} from "@/db/todos.repository";

export function useTodos() {
  const { data: fetchedTodos } = useLiveQuery(getTodosQuery());

  return {
    fetchedTodos,
    getTodo: getTodoQuery,
    addTodo,
    deleteTodo,
  };
}

export function useTodoGroups(todoId: number) {
  const { data: fetchedGroups } = useLiveQuery(getTodoGroupsQuery(todoId), [
    todoId,
  ]);

  return {
    fetchedGroups,
    addTodoGroup,
  };
}

export function useTodoItems(todoId: number) {
  const { data: fetchedItems } = useLiveQuery(getTodoItemsQuery(todoId), [
    todoId,
  ]);

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
    fetchedItems,
    addTodoItem,
    deleteTodoItems,
  };
}
