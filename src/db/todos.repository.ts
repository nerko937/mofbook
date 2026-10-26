import { eq, max } from 'drizzle-orm';
import { db } from '@/db/client';
import { todos, todoGroups, todoItems, type TodoGroup } from '@/db/schema';

export function todosListQuery() {
  return db.select().from(todos).orderBy(todos.createdAt);
}

export async function addTodo(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;

  const [{ id }] = await db
    .insert(todos)
    .values({ name: trimmed })
    .returning({ id: todos.id });
  await db.insert(todoGroups).values({ todoId: id, position: 1 });
}

/** Primary `from` is todo_groups — live query refreshes on group changes. */
export function todoGroupsForTodoQuery(todoId: number) {
  return db
    .select()
    .from(todoGroups)
    .where(eq(todoGroups.todoId, todoId))
    .orderBy(todoGroups.position);
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
    throw new Error('insert todo group returned no row');
  }
  return group;
}

/** Primary `from` is todo_items — live query refreshes on item inserts/updates. */
export function todoItemsWithGroupsQuery(todoId: number) {
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
  const trimmed = input.content.trim();
  if (!trimmed) return;

  const [{ maxPos }] = await db
    .select({ maxPos: max(todoItems.position) })
    .from(todoItems)
    .where(eq(todoItems.groupId, input.groupId));

  await db.insert(todoItems).values({
    groupId: input.groupId,
    content: trimmed,
    position: (maxPos ?? 0) + 1,
  });
}
