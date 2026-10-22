import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm';


export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 200 }).notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;


export const todoGroups = sqliteTable("todo_groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  todoId: integer('todo_id').references(() => todos.id, { onDelete: 'cascade' }).notNull(),
  position: integer("position").notNull(),
}, (t) => [
  unique("todo_groups_todo_id_position_uk").on(t.todoId, t.position)
])
export type TodoGroup = typeof todoGroups.$inferSelect;
export type NewTodoGroup = typeof todoGroups.$inferInsert;


export const todoItems = sqliteTable("todo_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupId: integer('group_id').references(() => todoGroups.id, { onDelete: 'cascade' }).notNull(),
  content: text("content").notNull(),
  position: integer("position").notNull(),
}, (t) => [
  unique("todo_items_group_id_position_uk").on(t.groupId, t.position)
])
export type TodoItem = typeof todoItems.$inferSelect;
export type NewTodoItem = typeof todoItems.$inferInsert;

export const todoRelations = relations(todos, ({ many }) => ({ groups: many(todoGroups)}))
export const todoGroupRelations = relations(todoGroups, ({ one, many }) => ({
  todo: one(todos, {fields: [todoGroups.todoId], references: [todos.id]}),
  items: many(todoItems)
}))
export const todoItemRelations = relations(todoItems, ({ one }) => ({
  group: one(todoGroups, {fields: [todoItems.groupId], references: [todoGroups.id]}),
}))
