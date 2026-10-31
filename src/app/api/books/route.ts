import { NextResponse } from "next/server";
import { db } from "@/db";
import { books, chapters } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allBooks = await db.select().from(books).orderBy(desc(books.updatedAt));
    return NextResponse.json(allBooks);
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      author,
      subtitle,
      genre,
      language,
      pageSize,
      margins,
      fontFamily,
      fontSize,
      theme,
      lineHeight,
      paragraphSpacing,
      coverData,
      frontMatter,
      backMatter,
    } = body;

    const [newBook] = await db
      .insert(books)
      .values({
        id,
        title,
        author,
        subtitle: subtitle || null,
        genre: genre || null,
        language: language || "English",
        pageSize: pageSize || "A5",
        margins: margins || "normal",
        fontFamily: fontFamily || "Libre Baskerville",
        fontSize: fontSize || 12,
        theme: theme || "classic-novel",
        lineHeight: lineHeight || "1.8",
        paragraphSpacing: paragraphSpacing || "normal",
        coverData: coverData || null,
        frontMatter: frontMatter || null,
        backMatter: backMatter || null,
        wordCount: 0,
      })
      .returning();

    // Create first chapter
    const chapterId = crypto.randomUUID();
    await db.insert(chapters).values({
      id: chapterId,
      bookId: id,
      title: "Chapter 1",
      content: "",
      order: 0,
      wordCount: 0,
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Failed to create book:", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const [updated] = await db
      .update(books)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update book:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}
