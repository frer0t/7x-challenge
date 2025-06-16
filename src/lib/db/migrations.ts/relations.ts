import { relations } from "drizzle-orm/relations";
import { user, account, session, categories, habits, habitCompletions } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	habits: many(habits),
	habitCompletions: many(habitCompletions),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const habitsRelations = relations(habits, ({one, many}) => ({
	category: one(categories, {
		fields: [habits.categoryId],
		references: [categories.id]
	}),
	user: one(user, {
		fields: [habits.userId],
		references: [user.id]
	}),
	habitCompletions: many(habitCompletions),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	habits: many(habits),
}));

export const habitCompletionsRelations = relations(habitCompletions, ({one}) => ({
	habit: one(habits, {
		fields: [habitCompletions.habitId],
		references: [habits.id]
	}),
	user: one(user, {
		fields: [habitCompletions.userId],
		references: [user.id]
	}),
}));