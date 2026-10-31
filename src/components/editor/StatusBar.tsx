"use client";

import { useEditorStore } from "@/lib/store";

export default function StatusBar() {
  const { chapters, activeChapterId, currentBook } = useEditorStore();

  const activeChapter = chapters.find((c) => c.id === activeChapterId);
  const totalWords = chapters.reduce((sum, c) => sum + c.wordCount, 0);
  const totalChars = chapters.reduce(
    (sum, c) => sum + c.content.replace(/<[^>]*>/g, "").length,
    0
  );
  const readingTime = Math.max(1, Math.ceil(totalWords / 250));
  const estimatedPages = Math.max(1, Math.ceil(totalWords / 250));

  return (
    <div className="h-7 bg-white border-t border-stone-200/80 flex items-center justify-between px-4 flex-shrink-0 text-[11px] text-stone-400">
      <div className="flex items-center gap-4">
        <span>
          Chapter: <span className="text-stone-600">{activeChapter?.title || "—"}</span>
        </span>
        <span>
          Chapter Words: <span className="text-stone-600">{activeChapter?.wordCount || 0}</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span>
          Total Words: <span className="text-stone-600 font-medium">{totalWords.toLocaleString()}</span>
        </span>
        <span>
          Characters: <span className="text-stone-600">{totalChars.toLocaleString()}</span>
        </span>
        <span>
          ~{readingTime} min read
        </span>
        <span>
          ~{estimatedPages} pages
        </span>
        <span>
          Theme: <span className="text-stone-600">{currentBook?.theme || "—"}</span>
        </span>
      </div>
    </div>
  );
}
