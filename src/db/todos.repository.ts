import { eq, max, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { todos, todoGroups, todoItems, type TodoGroup } from "@/db/schema";

export function getTodosQuery() {
  return db.select().from(todos).orderBy(todos.createdAt);
}

export async function addTodo(name: string) {
  await db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(todos)
      .values({ name: name })
      .returning({ id: todos.id });

    await tx.insert(todoGroups).values({ todoId: id, position: 1 });
  });
}

export function getTodoGroupsQuery(todoId: number) {
  return db
    .select()
    .from(todoGroups)
    .where(eq(todoGroups.todoId, todoId))
    .orderBy(todoGroups.position);
}

export async function deleteTodo(todoId: number) {
  await db.delete(todos).where(eq(todos.id, todoId));
}

export async function addTodoGroup(input: {
  todoId: number;
  position: number;
}): Promise<TodoGroup> {
  const [group] = await db
    .insert(todoGroups)
    .values({ todoId: input.todoId, position: input.position })
    .returning();
  if (!group) {
    throw new Error("insert todo group returned no row");
  }
  return group;
}

export function getTodoItemsQuery(todoId: number) {
  return db
    .select({
      item: todoItems,
      group: todoGroups,
    })
    .from(todoItems)
    .innerJoin(todoGroups, eq(todoItems.groupId, todoGroups.id))
    .where(eq(todoGroups.todoId, todoId))
    .orderBy(todoGroups.position, todoItems.position);
}

export async function addTodoItem(input: { groupId: number; content: string }) {
  const [{ maxPos }] = await db
    .select({ maxPos: max(todoItems.position) })
    .from(todoItems)
    .where(eq(todoItems.groupId, input.groupId));

  await db.insert(todoItems).values({
    groupId: input.groupId,
    content: input.content,
    position: (maxPos ?? 0) + 1,
  });
}

export async function deleteTodoItems(itemIds: number[]) {
  await db.delete(todoItems).where(inArray(todoItems.id, itemIds));
}
