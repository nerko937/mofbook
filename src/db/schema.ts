import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';


export const checklists = sqliteTable("checklists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 200 }).notNull(),
});
export type Checklist = typeof checklists.$inferSelect;
export type NewChecklist = typeof checklists.$inferInsert;


export const checklistGroups = sqliteTable("checklist_groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  checklistId: integer('checklist_id').references(() => checklists.id, { onDelete: 'cascade' }).notNull(),
  position: integer("position").notNull(),
})
export type ChecklistGroup = typeof checklistGroups.$inferSelect;
export type NewChecklistGroup = typeof checklistGroups.$inferInsert;


export const checklistItems = sqliteTable("checklist_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupId: integer('group_id').references(() => checklistGroups.id, { onDelete: 'cascade' }).notNull(),
  content: text("content").notNull(),
  position: integer("position").notNull(),
})
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type NewChecklistItem = typeof checklistItems.$inferInsert;
