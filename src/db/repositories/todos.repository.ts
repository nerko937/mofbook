import { db } from '@/db/client';
import { todos, todoGroups } from '@/db/schema';

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
