"use client";

import { useEditorStore } from "@/lib/store";
import { THEMES } from "@/lib/types";
import Sidebar from "./Sidebar";
import EditorToolbar from "./EditorToolbar";
import BookPage from "./BookPage";
import StatusBar from "./StatusBar";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

export default function BookEditor() {
  const {
    currentBook,
    chapters,
    activeChapterId,
    isSidebarOpen,
    isFocusMode,
    zoom,
    hasUnsavedChanges,
    setIsSaving,
    setLastSaved,
    setHasUnsavedChanges,
  } = useEditorStore();

  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const theme = THEMES.find((t) => t.id === currentBook?.theme) || THEMES[0];

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

  const saveToServer = useCallback(async () => {
    if (!currentBook || !hasUnsavedChanges) return;
    setIsSaving(true);
    try {
      // Save all chapters
      for (const ch of chapters) {
        await fetch("/api/chapters", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: ch.id,
            title: ch.title,
            content: ch.content,
            order: ch.order,
            wordCount: ch.wordCount,
          }),
        });
      }

      // Update book word count
      const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
      await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentBook.id,
          wordCount: totalWords,
          theme: currentBook.theme,
          fontFamily: currentBook.fontFamily,
          fontSize: currentBook.fontSize,
          pageSize: currentBook.pageSize,
          margins: currentBook.margins,
          lineHeight: currentBook.lineHeight,
        }),
      });

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, [currentBook, chapters, hasUnsavedChanges, setIsSaving, setLastSaved, setHasUnsavedChanges]);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(saveToServer, 5000);
    }
    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
  }, [hasUnsavedChanges, saveToServer]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveToServer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveToServer]);

  if (!currentBook) return null;

  return (
    <div className={`h-screen flex flex-col bg-stone-100 overflow-hidden ${isFocusMode ? "focus-mode" : ""}`}>
      {/* Top Toolbar */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <EditorToolbar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && !isFocusMode && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 overflow-hidden"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Editor Area */}
        <div className="flex-1 overflow-auto flex justify-center py-8 px-4" style={{ backgroundColor: theme.id === "dark-mode" ? "#121212" : "#E8E5DE" }}>
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            className="transition-transform duration-200"
          >
            {activeChapter ? (
              <BookPage
                chapter={activeChapter}
                theme={theme}
                book={currentBook}
              />
            ) : (
              <div className="text-center text-stone-400 mt-20">
                <p className="text-lg" style={{ fontFamily: "Playfair Display" }}>Select or create a chapter to begin writing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <StatusBar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
