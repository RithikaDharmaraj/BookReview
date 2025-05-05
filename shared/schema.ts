import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Book schema
export const bookCategories = pgEnum("book_category", [
  "fiction", 
  "non-fiction", 
  "science", 
  "psychology", 
  "business", 
  "romance", 
  "fantasy", 
  "thriller", 
  "mystery", 
  "biography", 
  "history", 
  "self-help"
]);

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  price: text("price").notNull(),
  category: bookCategories("category").notNull(),
  featured: boolean("featured").default(false),
  publishedDate: text("published_date"),
  publisher: text("publisher"),
  pages: integer("pages"),
  language: text("language").default("English"),
  isbn: text("isbn"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
});

// Review schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  bookId: integer("book_id").notNull(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  aiRefinedContent: text("ai_refined_content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Extend schemas for validation
export const registerUserSchema = insertUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const reviewFormSchema = insertReviewSchema
  .extend({
    useAiRefinement: z.boolean().optional(),
  })
  .omit({
    userId: true,
  });
