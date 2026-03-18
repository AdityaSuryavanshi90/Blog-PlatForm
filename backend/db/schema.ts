import { pgTable, pgEnum, text, uuid } from "drizzle-orm/pg-core";

export const RoleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: RoleEnum("role").notNull().default("USER"),
});

export const Blog = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: uuid("authorId")
    .notNull()
    .references(() => users.id),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
