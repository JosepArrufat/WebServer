import { isNull } from "drizzle-orm";
import { pgTable, timestamp, varchar, uuid, text, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").default("unset").notNull(),
  is_chirpy_red: boolean("is_chirpy_red").default(false)
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SafeUser = Omit<User, 'hashedPassword' | 'is_chirpy_red'> & {
  isChirpyRed: boolean;
};

export const chirps = pgTable("chirps",  {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: text("body").notNull(), 
  user_id: uuid("user_id").notNull()
    .references(()=>users.id, {onDelete: "cascade"}),

})

export type NewChirp = typeof chirps.$inferInsert;

export const refresh_tokens = pgTable("refresh_tokens", {
  token: text("token").primaryKey(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow()
    .$onUpdate(()=> new Date()),
  user_id: uuid("user_id").notNull()
    .references(() => users.id, {onDelete:"cascade"}),
  expires_at: timestamp("expires_at").notNull(),
  revoked_at: timestamp("revoked_at"),
})

export type RefreshToken = typeof refresh_tokens.$inferInsert;