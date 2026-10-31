"use client";

import { useEditorStore } from "@/lib/store";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Settings,
  Trash2,
  Copy,
  FileText,
  Download,
  ArrowLeft,
  BookMarked,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const {
    currentBook,
    chapters,
    activeChapterId,
    setActiveChapter,
    addChapter,
    removeChapter,
    updateChapterTitle,
    setCurrentView,
    reorderChapters,
  } = useEditorStore();

  if (!currentBook) return null;

  const handleAddChapter = () => {
    const newId = crypto.randomUUID();
    const order = chapters.length;
    addChapter({
      id: newId,
      bookId: currentBook.id,
      title: `Chapter ${order + 1}`,
      content: "",
      order,
      isExpanded: true,
      wordCount: 0,
    });

    // Save to server
    fetch("/api/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newId,
        bookId: currentBook.id,
        title: `Chapter ${order + 1}`,
        content: "",
        order,
        wordCount: 0,
      }),
    }).catch(console.error);
  };

  const handleDeleteChapter = (id: string) => {
    if (chapters.length <= 1) return;
    if (!confirm("Delete this chapter?")) return;
    removeChapter(id);
    fetch(`/api/chapters?id=${id}`, { method: "DELETE" }).catch(console.error);
  };

  const handleDuplicateChapter = (ch: typeof chapters[0]) => {
    const newId = crypto.randomUUID();
    const newChapter = {
      ...ch,
      id: newId,
      title: `${ch.title} (Copy)`,
      order: chapters.length,
    };
    addChapter(newChapter);
    fetch("/api/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newId,
        bookId: currentBook.id,
        title: newChapter.title,
        content: newChapter.content,
        order: newChapter.order,
        wordCount: newChapter.wordCount,
      }),
    }).catch(console.error);
  };

  const moveChapter = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= chapters.length) return;
    const newChapters = [...chapters];
    const [moved] = newChapters.splice(index, 1);
    newChapters.splice(newIndex, 0, moved);
    reorderChapters(newChapters.map((ch, i) => ({ ...ch, order: i })));
  };

  return (
    <div className="h-full bg-stone-50 border-r border-stone-200/80 flex flex-col">
      {/* Book Header */}
      <div className="p-4 border-b border-stone-200/60">
        <button
          onClick={() => setCurrentView("welcome")}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors mb-3"
        >
          <ArrowLeft size={12} />
          <span>All Books</span>
        </button>
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-stone-500 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-stone-800 text-sm truncate" style={{ fontFamily: "Playfair Display" }}>
              {currentBook.title}
            </div>
            <div className="text-xs text-stone-400 truncate">{currentBook.author}</div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Chapters</span>
          <button
            onClick={handleAddChapter}
            className="p-1 rounded-md hover:bg-stone-200/60 text-stone-400 hover:text-stone-600 transition-colors"
            title="Add chapter"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="space-y-0.5">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div
                className={`group flex items-center gap-1.5 px-2 py-2 rounded-lg cursor-pointer transition-all ${
                  activeChapterId === chapter.id
                    ? "bg-stone-200/80 text-stone-900"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
                onClick={() => setActiveChapter(chapter.id)}
              >
                <GripVertical size={12} className="text-stone-300 opacity-0 group-hover:opacity-100 cursor-grab flex-shrink-0" />
                
                {activeChapterId === chapter.id ? (
                  <ChevronDown size={12} className="text-stone-400 flex-shrink-0" />
                ) : (
                  <ChevronRight size={12} className="text-stone-400 flex-shrink-0" />
                )}

                <FileText size={12} className="text-stone-400 flex-shrink-0" />

                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-transparent text-sm font-medium border-none outline-none min-w-0"
                />

                <span className="text-[10px] text-stone-400 flex-shrink-0">
                  {chapter.wordCount || 0}
                </span>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); moveChapter(index, -1); }}
                      className="p-0.5 rounded hover:bg-stone-300/50 text-stone-400"
                      title="Move up"
                    >
                      <ChevronDown size={10} className="rotate-180" />
                    </button>
                  )}
                  {index < chapters.length - 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); moveChapter(index, 1); }}
                      className="p-0.5 rounded hover:bg-stone-300/50 text-stone-400"
                      title="Move down"
                    >
                      <ChevronDown size={10} />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDuplicateChapter(chapter); }}
                    className="p-0.5 rounded hover:bg-stone-300/50 text-stone-400"
                    title="Duplicate"
                  >
                    <Copy size={10} />
                  </button>
                  {chapters.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter.id); }}
                      className="p-0.5 rounded hover:bg-red-100 text-stone-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-stone-200/60 space-y-1">
        <button
          onClick={() => setCurrentView("frontmatter")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <BookMarked size={14} />
          Cover & Front Matter
        </button>
        <button
          onClick={() => setCurrentView("settings")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <Settings size={14} />
          Book Settings
        </button>
        <button
          onClick={() => setCurrentView("export")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <Download size={14} />
          Export Book
        </button>
      </div>
    </div>
  );
}
