import { pgTable, text, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  subtitle: text("subtitle"),
  genre: text("genre"),
  language: text("language").default("English"),
  pageSize: text("page_size").default("A5"),
  margins: text("margins").default("normal"),
  fontFamily: text("font_family").default("Libre Baskerville"),
  fontSize: integer("font_size").default(12),
  theme: text("theme").default("classic-novel"),
  lineHeight: text("line_height").default("1.8"),
  paragraphSpacing: text("paragraph_spacing").default("normal"),
  headerText: text("header_text"),
  footerText: text("footer_text"),
  pageNumberPosition: text("page_number_position").default("bottom-center"),
  coverData: jsonb("cover_data"),
  frontMatter: jsonb("front_matter"),
  backMatter: jsonb("back_matter"),
  wordCount: integer("word_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chapters = pgTable("chapters", {
  id: text("id").primaryKey(),
  bookId: text("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").default(""),
  order: integer("order").notNull(),
  isExpanded: boolean("is_expanded").default(true),
  wordCount: integer("word_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
