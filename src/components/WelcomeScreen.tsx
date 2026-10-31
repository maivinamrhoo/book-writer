"use client";

import { useEditorStore } from "@/lib/store";
import { BookSettings } from "@/lib/types";
import { motion } from "framer-motion";
import {
  BookOpen,
  PenTool,
  Clock,
  Trash2,
  Plus,
  Feather,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function WelcomeScreen() {
  const { setCurrentView, setCurrentBook, setChapters, setActiveChapter, setRecentBooks, recentBooks } = useEditorStore();
  const [books, setBooks] = useState<BookSettings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      const mapped = data.map((b: Record<string, unknown>) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        subtitle: b.subtitle || "",
        genre: b.genre || "",
        language: b.language || "English",
        pageSize: b.pageSize || b.page_size || "A5",
        margins: b.margins || "normal",
        fontFamily: b.fontFamily || b.font_family || "Libre Baskerville",
        fontSize: b.fontSize || b.font_size || 12,
        theme: b.theme || "classic-novel",
        lineHeight: b.lineHeight || b.line_height || "1.8",
        paragraphSpacing: b.paragraphSpacing || b.paragraph_spacing || "normal",
        headerText: b.headerText || b.header_text || "",
        footerText: b.footerText || b.footer_text || "",
        pageNumberPosition: b.pageNumberPosition || b.page_number_position || "bottom-center",
        coverData: b.coverData || b.cover_data || undefined,
        frontMatter: b.frontMatter || b.front_matter || undefined,
        backMatter: b.backMatter || b.back_matter || undefined,
        wordCount: b.wordCount || b.word_count || 0,
      }));
      setBooks(mapped);
      setRecentBooks(mapped);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const openBook = async (book: BookSettings) => {
    setCurrentBook(book);
    try {
      const res = await fetch(`/api/chapters?bookId=${book.id}`);
      const data = await res.json();
      const mapped = data.map((c: Record<string, unknown>) => ({
        id: c.id as string,
        bookId: (c.bookId || c.book_id) as string,
        title: c.title as string,
        content: (c.content || "") as string,
        order: c.order as number,
        isExpanded: c.isExpanded ?? c.is_expanded ?? true,
        wordCount: c.wordCount ?? c.word_count ?? 0,
      }));
      setChapters(mapped);
      setActiveChapter(mapped[0]?.id ?? null);
    } catch {
      setChapters([]);
    }
    setCurrentView("editor");
  };

  const deleteBook = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      fetchBooks();
    } catch {
      // ignore
    }
  };

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl w-full text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-800 text-white mb-6 shadow-lg">
            <Feather size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-stone-800" style={{ fontFamily: "Playfair Display" }}>
            BookCraft
          </h1>
          <p className="text-stone-500 mt-3 text-lg tracking-wide">
            Write Beautiful Books.
          </p>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
        >
          <button
            onClick={() => setCurrentView("create")}
            className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-stone-200/80 hover:border-stone-300 hover:shadow-lg transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-stone-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus size={20} />
            </div>
            <div>
              <div className="font-medium text-stone-800">Create New Book</div>
              <div className="text-sm text-stone-500">Start a new writing project</div>
            </div>
          </button>

          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".txt,.md";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    // store for create flow
                    sessionStorage.setItem("importContent", reader.result as string);
                    setCurrentView("create");
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
            className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-stone-200/80 hover:border-stone-300 hover:shadow-lg transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="font-medium text-stone-800">Import File</div>
              <div className="text-sm text-stone-500">Import TXT or Markdown</div>
            </div>
          </button>
        </motion.div>

        {/* Recent Books */}
        {!loading && books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4 px-1">
              <Clock size={14} className="text-stone-400" />
              <span className="text-sm font-medium text-stone-500 tracking-wide uppercase">Recent Books</span>
            </div>

            <div className="space-y-2">
              {books.slice(0, 6).map((book, i) => (
                <motion.button
                  key={book.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => openBook(book)}
                  className="group w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-200/60 hover:border-stone-300 hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="w-10 h-14 rounded bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-stone-600 flex-shrink-0">
                    <PenTool size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-stone-800 truncate" style={{ fontFamily: "Playfair Display" }}>
                      {book.title}
                    </div>
                    <div className="text-sm text-stone-500 flex items-center gap-2">
                      <span>{book.author}</span>
                      <span className="text-stone-300">·</span>
                      <span>{book.genre || "Untitled Genre"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-stone-400">
                      {book.wordCount || 0} words
                    </span>
                    <button
                      onClick={(e) => deleteBook(book.id, e)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && books.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-stone-400 text-sm"
          >
            No books yet. Create your first masterpiece.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
