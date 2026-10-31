"use client";

import { useEditorStore } from "@/lib/store";
import {
  PanelLeftClose,
  PanelLeftOpen,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Eye,
  Feather,
  Save,
  Undo,
  Redo,
} from "lucide-react";

export default function EditorToolbar() {
  const {
    currentBook,
    isSidebarOpen,
    toggleSidebar,
    isFocusMode,
    toggleFocusMode,
    isFullscreen,
    toggleFullscreen,
    zoom,
    setZoom,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
  } = useEditorStore();

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    toggleFullscreen();
  };

  return (
    <div className="h-12 bg-white border-b border-stone-200/80 flex items-center justify-between px-3 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        <div className="flex items-center gap-1.5">
          <Feather size={14} className="text-stone-400" />
          <span className="text-sm font-medium text-stone-700" style={{ fontFamily: "Playfair Display" }}>
            {currentBook?.title}
          </span>
        </div>
      </div>

      {/* Center - Formatting */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors" title="Undo (Ctrl+Z)">
          <Undo size={14} />
        </button>
        <button className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors" title="Redo (Ctrl+Y)">
          <Redo size={14} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Save status */}
        <div className="flex items-center gap-1.5 mr-2">
          {isSaving ? (
            <span className="text-xs text-stone-400 animate-pulse flex items-center gap-1">
              <Save size={11} /> Saving...
            </span>
          ) : hasUnsavedChanges ? (
            <span className="text-xs text-amber-500 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Unsaved
            </span>
          ) : lastSaved ? (
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Save size={11} /> Saved {formatTime(lastSaved)}
            </span>
          ) : null}
        </div>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        {/* Zoom */}
        <button
          onClick={() => setZoom(Math.max(50, zoom - 10))}
          className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-xs text-stone-500 w-10 text-center tabular-nums">{zoom}%</span>
        <button
          onClick={() => setZoom(Math.min(200, zoom + 10))}
          className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors"
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        <button
          onClick={toggleFocusMode}
          className={`p-1.5 rounded-md transition-colors ${isFocusMode ? "bg-stone-800 text-white" : "hover:bg-stone-100 text-stone-400"}`}
          title="Focus mode"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={handleFullscreen}
          className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors"
          title="Fullscreen"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>
      </div>
    </div>
  );
}
