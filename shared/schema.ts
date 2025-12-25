import { pgTable, text, serial, integer, boolean, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

// Export everything from auth
export * from "./models/auth";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  showUsername: boolean("show_username").default(true).notNull(),
  bio: text("bio"),
  // Theme settings
  theme: text("theme").default("default").notNull(), // 'default', 'dark', 'custom'
  backgroundColor: text("background_color").default("#ffffff"),
  textColor: text("text_color").default("#000000"),
  buttonColor: text("button_color").default("#000000"),
  buttonTextColor: text("button_text_color").default("#ffffff"),
  font: text("font").default("Inter"),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id),
  title: text("title").notNull(),
  url: text("url").notNull(),
  icon: text("icon"), // lucide icon name
  order: integer("order").notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
});

// Relations
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  links: many(links),
}));

export const linksRelations = relations(links, ({ one }) => ({
  profile: one(profiles, {
    fields: [links.profileId],
    references: [profiles.id],
  }),
}));

// Schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true });
export const insertLinkSchema = createInsertSchema(links).omit({ id: true });

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Link = typeof links.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;

// Request Types
export type UpdateProfileRequest = Partial<InsertProfile>;
export type CreateLinkRequest = Omit<InsertLink, "profileId" | "order">; // profileId from session, order calc on backend
export type UpdateLinkRequest = Partial<InsertLink>;
export type ReorderLinksRequest = { ids: number[] };
