import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  addTodo,
  addTodoGroup,
  addTodoItem,
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

  return {
    fetchedItems,
    addTodoItem,
    deleteTodoItems,
  };
}
