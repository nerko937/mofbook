import { eq, max } from 'drizzle-orm';
import { db } from '@/db/client';
import { todoGroups, todoItems } from '@/db/schema';

/** Primary `from` is todo_groups — live query refreshes on group changes. */
export function todoGroupsForTodoQuery(todoId: number) {
  return db
    .select()
    .from(todoGroups)
    .where(eq(todoGroups.todoId, todoId))
    .orderBy(todoGroups.position);
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
