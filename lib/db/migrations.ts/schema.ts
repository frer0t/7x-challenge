import {
  boolean,
  date,
  foreignKey,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean("email_verified").notNull(),
    image: text(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (table) => [unique("user_email_unique").on(table.email)]
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey().notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      mode: "string",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      mode: "string",
    }),
    scope: text(),
    password: text(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "account_user_id_user_id_fk",
    }).onDelete("cascade"),
  ]
);

export const session = pgTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    token: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "session_user_id_user_id_fk",
    }).onDelete("cascade"),
    unique("session_token_unique").on(table.token),
  ]
);

export const verification = pgTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const categories = pgTable("categories", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  color: text(),
  icon: text(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
});

export const habits = pgTable(
  "habits",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    categoryId: text("category_id"),
    userId: text("user_id").notNull(),
    targetFrequency: integer("target_frequency").default(1).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "habits_category_id_categories_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "habits_user_id_user_id_fk",
    }).onDelete("cascade"),
  ]
);

export const habitCompletions = pgTable(
  "habit_completions",
  {
    id: text().primaryKey().notNull(),
    habitId: text("habit_id").notNull(),
    userId: text("user_id").notNull(),
    completedAt: date("completed_at").notNull(),
    completedCount: integer("completed_count").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.habitId],
      foreignColumns: [habits.id],
      name: "habit_completions_habit_id_habits_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "habit_completions_user_id_user_id_fk",
    }).onDelete("cascade"),
  ]
);
