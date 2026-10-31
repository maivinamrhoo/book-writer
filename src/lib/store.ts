"use client";

import { create } from "zustand";
import type { BookSettings, ChapterData } from "./types";

interface EditorState {
  // Navigation
  currentView: "welcome" | "create" | "editor" | "settings" | "cover" | "export" | "frontmatter";
  
  // Book
  currentBook: BookSettings | null;
  chapters: ChapterData[];
  activeChapterId: string | null;
  
  // Editor state
  isSidebarOpen: boolean;
  isFullscreen: boolean;
  isFocusMode: boolean;
  isDarkMode: boolean;
  zoom: number;
  
  // Recent books
  recentBooks: BookSettings[];
  
  // Undo/Redo
  undoStack: string[];
  redoStack: string[];
  
  // Auto-save
  lastSaved: Date | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  setCurrentView: (view: EditorState["currentView"]) => void;
  setCurrentBook: (book: BookSettings | null) => void;
  setChapters: (chapters: ChapterData[]) => void;
  setActiveChapter: (id: string | null) => void;
  updateChapterContent: (id: string, content: string) => void;
  updateChapterTitle: (id: string, title: string) => void;
  addChapter: (chapter: ChapterData) => void;
  removeChapter: (id: string) => void;
  reorderChapters: (chapters: ChapterData[]) => void;
  toggleSidebar: () => void;
  toggleFullscreen: () => void;
  toggleFocusMode: () => void;
  toggleDarkMode: () => void;
  setZoom: (zoom: number) => void;
  setRecentBooks: (books: BookSettings[]) => void;
  setLastSaved: (date: Date) => void;
  setIsSaving: (saving: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  updateBookSettings: (settings: Partial<BookSettings>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentView: "welcome",
  currentBook: null,
  chapters: [],
  activeChapterId: null,
  isSidebarOpen: true,
  isFullscreen: false,
  isFocusMode: false,
  isDarkMode: false,
  zoom: 100,
  recentBooks: [],
  undoStack: [],
  redoStack: [],
  lastSaved: null,
  isSaving: false,
  hasUnsavedChanges: false,

  setCurrentView: (view) => set({ currentView: view }),
  setCurrentBook: (book) => set({ currentBook: book }),
  setChapters: (chapters) => set({ chapters }),
  setActiveChapter: (id) => set({ activeChapterId: id }),
  updateChapterContent: (id, content) =>
    set((state) => ({
      chapters: state.chapters.map((ch) =>
        ch.id === id
          ? { ...ch, content, wordCount: content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length }
          : ch
      ),
      hasUnsavedChanges: true,
    })),
  updateChapterTitle: (id, title) =>
    set((state) => ({
      chapters: state.chapters.map((ch) =>
        ch.id === id ? { ...ch, title } : ch
      ),
      hasUnsavedChanges: true,
    })),
  addChapter: (chapter) =>
    set((state) => ({
      chapters: [...state.chapters, chapter],
      activeChapterId: chapter.id,
      hasUnsavedChanges: true,
    })),
  removeChapter: (id) =>
    set((state) => {
      const newChapters = state.chapters.filter((ch) => ch.id !== id);
      return {
        chapters: newChapters,
        activeChapterId:
          state.activeChapterId === id
            ? newChapters[0]?.id ?? null
            : state.activeChapterId,
        hasUnsavedChanges: true,
      };
    }),
  reorderChapters: (chapters) => set({ chapters, hasUnsavedChanges: true }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setZoom: (zoom) => set({ zoom }),
  setRecentBooks: (books) => set({ recentBooks: books }),
  setLastSaved: (date) => set({ lastSaved: date }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
  updateBookSettings: (settings) =>
    set((state) => ({
      currentBook: state.currentBook ? { ...state.currentBook, ...settings } : null,
      hasUnsavedChanges: true,
    })),
}));
