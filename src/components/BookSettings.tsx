"use client";

import { useEditorStore } from "@/lib/store";
import { FONTS, PAGE_SIZES, THEMES } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Save, Type, BookOpen, Layout, Palette } from "lucide-react";
import { useState } from "react";

export default function BookSettings() {
  const { currentBook, updateBookSettings, setCurrentView } = useEditorStore();
  const [activeTab, setActiveTab] = useState("page");
  const [saving, setSaving] = useState(false);

  if (!currentBook) return null;

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentBook.id,
          title: currentBook.title,
          author: currentBook.author,
          subtitle: currentBook.subtitle,
          genre: currentBook.genre,
          pageSize: currentBook.pageSize,
          margins: currentBook.margins,
          fontFamily: currentBook.fontFamily,
          fontSize: currentBook.fontSize,
          theme: currentBook.theme,
          lineHeight: currentBook.lineHeight,
          paragraphSpacing: currentBook.paragraphSpacing,
          pageNumberPosition: currentBook.pageNumberPosition,
        }),
      });
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const selectedTheme = THEMES.find((t) => t.id === currentBook.theme) || THEMES[0];

  const tabs = [
    { id: "page", label: "Page", icon: Layout },
    { id: "typography", label: "Typography", icon: Type },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "details", label: "Details", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("editor")}
            className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-medium text-stone-800" style={{ fontFamily: "Playfair Display" }}>
            Book Settings
          </h1>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 text-white hover:bg-stone-700 transition-colors text-sm"
        >
          {saving ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <Save size={14} />
              Save & Return
            </>
          )}
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6 flex gap-6">
        {/* Tab Sidebar */}
        <div className="w-48 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-stone-800 text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-stone-200/80 p-8">
          {activeTab === "page" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-lg font-semibold text-stone-800">Page Setup</h2>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-3">Page Size</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(PAGE_SIZES).map(([key]) => (
                    <button
                      key={key}
                      onClick={() => updateBookSettings({ pageSize: key })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        currentBook.pageSize === key
                          ? "border-stone-800 bg-stone-800 text-white"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-3">Margins</label>
                <div className="grid grid-cols-3 gap-3">
                  {["narrow", "normal", "wide"].map((m) => (
                    <button
                      key={m}
                      onClick={() => updateBookSettings({ margins: m })}
                      className={`p-3 rounded-xl border text-center capitalize transition-all ${
                        currentBook.margins === m
                          ? "border-stone-800 bg-stone-800 text-white"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-3">Line Height</label>
                <div className="grid grid-cols-4 gap-3">
                  {["1.5", "1.6", "1.8", "2.0"].map((lh) => (
                    <button
                      key={lh}
                      onClick={() => updateBookSettings({ lineHeight: lh })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        currentBook.lineHeight === lh
                          ? "border-stone-800 bg-stone-800 text-white"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      {lh}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-3">Page Number Position</label>
                <div className="grid grid-cols-3 gap-3">
                  {["bottom-left", "bottom-center", "bottom-right"].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => updateBookSettings({ pageNumberPosition: pos })}
                      className={`p-3 rounded-xl border text-center text-sm transition-all ${
                        currentBook.pageNumberPosition === pos
                          ? "border-stone-800 bg-stone-800 text-white"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      {pos.replace("bottom-", "").replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "typography" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-lg font-semibold text-stone-800">Typography</h2>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Font Family</label>
                <select
                  value={currentBook.fontFamily}
                  onChange={(e) => updateBookSettings({ fontFamily: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                  style={{ fontFamily: currentBook.fontFamily }}
                >
                  {FONTS.map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Font Size</label>
                <select
                  value={currentBook.fontSize}
                  onChange={(e) => updateBookSettings({ fontSize: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                >
                  {[10, 11, 12, 13, 14, 16, 18].map((s) => (
                    <option key={s} value={s}>{s}pt</option>
                  ))}
                </select>
              </div>

              {/* Font Preview */}
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50">
                <p className="text-sm text-stone-400 mb-3">Preview</p>
                <p style={{
                  fontFamily: currentBook.fontFamily,
                  fontSize: `${currentBook.fontSize}pt`,
                  lineHeight: currentBook.lineHeight,
                  color: selectedTheme.textColor,
                }}>
                  The quick brown fox jumps over the lazy dog. In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "theme" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-lg font-semibold text-stone-800">Theme</h2>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => updateBookSettings({ theme: theme.id })}
                    className={`relative p-4 rounded-xl border text-left transition-all ${
                      currentBook.theme === theme.id
                        ? "border-stone-800 shadow-md ring-1 ring-stone-800"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {currentBook.theme === theme.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-stone-800 text-white flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}
                    <div
                      className="w-full h-16 rounded-lg mb-3 border border-stone-100"
                      style={{ backgroundColor: theme.pageBackground }}
                    >
                      <div className="p-3 space-y-1">
                        <div className="h-1 rounded-full w-12" style={{ backgroundColor: theme.textColor, opacity: 0.3 }} />
                        <div className="h-0.5 rounded-full w-full" style={{ backgroundColor: theme.textColor, opacity: 0.12 }} />
                        <div className="h-0.5 rounded-full w-10/12" style={{ backgroundColor: theme.textColor, opacity: 0.12 }} />
                      </div>
                    </div>
                    <div className="font-medium text-sm">{theme.name}</div>
                    <div className="text-xs text-stone-500">{theme.description}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "details" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-lg font-semibold text-stone-800">Book Details</h2>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Title</label>
                <input
                  type="text"
                  value={currentBook.title}
                  onChange={(e) => updateBookSettings({ title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                  style={{ fontFamily: "Playfair Display" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Author</label>
                <input
                  type="text"
                  value={currentBook.author}
                  onChange={(e) => updateBookSettings({ author: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={currentBook.subtitle || ""}
                  onChange={(e) => updateBookSettings({ subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
