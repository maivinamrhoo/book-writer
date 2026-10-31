"use client";

import { useEditorStore } from "@/lib/store";
import { FONTS, GENRES, PAGE_SIZES, THEMES } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Feather } from "lucide-react";
import { useState } from "react";

export default function CreateBookFlow() {
  const { setCurrentView, setCurrentBook, setChapters, setActiveChapter } = useEditorStore();
  const [step, setStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    subtitle: "",
    genre: "Fiction",
    language: "English",
    pageSize: "A5",
    margins: "normal",
    fontFamily: "Libre Baskerville",
    fontSize: 12,
    theme: "classic-novel",
  });

  const updateForm = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedTheme = THEMES.find((t) => t.id === form.theme) || THEMES[0];

  const createBook = async () => {
    if (!form.title.trim() || !form.author.trim()) return;
    setIsCreating(true);
    const id = crypto.randomUUID();

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      await res.json();

      const chapRes = await fetch(`/api/chapters?bookId=${id}`);
      const chaps = await chapRes.json();
      const mapped = chaps.map((c: Record<string, unknown>) => ({
        id: c.id as string,
        bookId: (c.bookId || c.book_id) as string,
        title: c.title as string,
        content: (c.content || "") as string,
        order: c.order as number,
        isExpanded: true,
        wordCount: 0,
      }));

      // If there's imported content, set it on the first chapter
      const importContent = sessionStorage.getItem("importContent");
      if (importContent && mapped.length > 0) {
        mapped[0].content = `<p>${importContent.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
        mapped[0].wordCount = importContent.split(/\s+/).filter(Boolean).length;
        await fetch("/api/chapters", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: mapped[0].id, content: mapped[0].content, wordCount: mapped[0].wordCount }),
        });
        sessionStorage.removeItem("importContent");
      }

      setCurrentBook({
        id,
        ...form,
        wordCount: 0,
        lineHeight: "1.8",
        paragraphSpacing: "normal",
        pageNumberPosition: "bottom-center",
      });
      setChapters(mapped);
      setActiveChapter(mapped[0]?.id ?? null);
      setCurrentView("editor");
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const steps = [
    // Step 0: Book Details
    <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-2">Book Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateForm("title", e.target.value)}
          placeholder="Enter your book title..."
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent transition-all text-lg"
          style={{ fontFamily: "Playfair Display" }}
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-2">Author Name *</label>
        <input
          type="text"
          value={form.author}
          onChange={(e) => updateForm("author", e.target.value)}
          placeholder="Your name..."
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-2">Subtitle <span className="text-stone-400">(optional)</span></label>
        <input
          type="text"
          value={form.subtitle}
          onChange={(e) => updateForm("subtitle", e.target.value)}
          placeholder="A subtitle for your book..."
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2">Genre</label>
          <select
            value={form.genre}
            onChange={(e) => updateForm("genre", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent transition-all"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2">Language</label>
          <select
            value={form.language}
            onChange={(e) => updateForm("language", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent transition-all"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Portuguese">Portuguese</option>
          </select>
        </div>
      </div>
    </motion.div>,

    // Step 1: Page Setup
    <motion.div key="page" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-3">Page Size</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(PAGE_SIZES).map(([key, size]) => (
            <button
              key={key}
              onClick={() => updateForm("pageSize", key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                form.pageSize === key
                  ? "border-stone-800 bg-stone-800 text-white shadow-md"
                  : "border-stone-200 bg-white hover:border-stone-300"
              }`}
            >
              <div className="font-medium text-sm">{key}</div>
              <div className={`text-xs mt-0.5 ${form.pageSize === key ? "text-stone-300" : "text-stone-400"}`}>
                {size.label.split("(")[1]?.replace(")", "") || size.label}
              </div>
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
              onClick={() => updateForm("margins", m)}
              className={`p-3 rounded-xl border text-center capitalize transition-all ${
                form.margins === m
                  ? "border-stone-800 bg-stone-800 text-white shadow-md"
                  : "border-stone-200 bg-white hover:border-stone-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2">Font</label>
          <select
            value={form.fontFamily}
            onChange={(e) => updateForm("fontFamily", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
            style={{ fontFamily: form.fontFamily }}
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
            value={form.fontSize}
            onChange={(e) => updateForm("fontSize", Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
          >
            {[10, 11, 12, 13, 14, 16].map((s) => (
              <option key={s} value={s}>{s}pt</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>,

    // Step 2: Theme
    <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      <label className="block text-sm font-medium text-stone-600 mb-2">Choose a Theme</label>
      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => updateForm("theme", theme.id)}
            className={`relative p-4 rounded-xl border text-left transition-all ${
              form.theme === theme.id
                ? "border-stone-800 shadow-md ring-1 ring-stone-800"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            {form.theme === theme.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-stone-800 text-white flex items-center justify-center">
                <Check size={12} />
              </div>
            )}
            <div
              className="w-full h-20 rounded-lg mb-3 border border-stone-100"
              style={{ backgroundColor: theme.pageBackground }}
            >
              <div className="p-3 space-y-1.5">
                <div className="h-1.5 rounded-full w-16" style={{ backgroundColor: theme.textColor, opacity: 0.3 }} />
                <div className="h-1 rounded-full w-full" style={{ backgroundColor: theme.textColor, opacity: 0.15 }} />
                <div className="h-1 rounded-full w-10/12" style={{ backgroundColor: theme.textColor, opacity: 0.15 }} />
                <div className="h-1 rounded-full w-11/12" style={{ backgroundColor: theme.textColor, opacity: 0.15 }} />
              </div>
            </div>
            <div className="font-medium text-sm text-stone-800">{theme.name}</div>
            <div className="text-xs text-stone-500 mt-0.5">{theme.description}</div>
          </button>
        ))}
      </div>
    </motion.div>,
  ];

  const stepLabels = ["Book Details", "Page Setup", "Theme"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setCurrentView("welcome")}
            className="p-2 rounded-xl hover:bg-stone-200/60 transition-colors"
          >
            <ArrowLeft size={18} className="text-stone-600" />
          </button>
          <div className="flex items-center gap-2">
            <Feather size={18} className="text-stone-500" />
            <span className="text-sm text-stone-500 font-medium">Create New Book</span>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                  i === step
                    ? "bg-stone-800 text-white"
                    : i < step
                    ? "bg-stone-200 text-stone-700"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs font-medium">
                  {i < step ? <Check size={10} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < stepLabels.length - 1 && (
                <div className={`w-6 h-px ${i < step ? "bg-stone-400" : "bg-stone-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm mb-6">
          <AnimatePresence mode="wait">
            {steps[step]}
          </AnimatePresence>
        </div>

        {/* Live Preview */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="text-sm font-medium text-stone-500 mb-3">Live Preview</div>
            <div className="flex justify-center">
              <div
                className="w-48 h-64 rounded-sm shadow-xl flex flex-col items-center justify-center p-6 border border-stone-100"
                style={{
                  backgroundColor: selectedTheme.pageBackground,
                  color: selectedTheme.textColor,
                  fontFamily: selectedTheme.bodyFont,
                }}
              >
                <div className="text-xs opacity-40 tracking-widest uppercase mb-4"
                  style={{ fontFamily: selectedTheme.chapterTitleFont }}>
                  Chapter I
                </div>
                <div className="text-center mb-3" style={{ fontFamily: selectedTheme.chapterTitleFont }}>
                  <div className="text-sm font-semibold">{form.title || "Your Book"}</div>
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="h-[2px] rounded-full w-full" style={{ backgroundColor: selectedTheme.textColor, opacity: 0.12 }} />
                  <div className="h-[2px] rounded-full w-11/12" style={{ backgroundColor: selectedTheme.textColor, opacity: 0.12 }} />
                  <div className="h-[2px] rounded-full w-full" style={{ backgroundColor: selectedTheme.textColor, opacity: 0.12 }} />
                  <div className="h-[2px] rounded-full w-9/12" style={{ backgroundColor: selectedTheme.textColor, opacity: 0.12 }} />
                  <div className="h-[2px] rounded-full w-full" style={{ backgroundColor: selectedTheme.textColor, opacity: 0.12 }} />
                  <div className="h-[2px] rounded-full w-10/12" style={{ backgroundColor: selectedTheme.textColor, opacity: 0.12 }} />
                </div>
                <div className="mt-auto text-[8px] opacity-30">1</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : setCurrentView("welcome")}
            className="px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-200/60 transition-colors text-sm font-medium"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && (!form.title.trim() || !form.author.trim())}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 text-white hover:bg-stone-700 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={createBook}
              disabled={isCreating || !form.title.trim() || !form.author.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-800 text-white hover:bg-stone-700 transition-colors text-sm font-medium disabled:opacity-40"
            >
              {isCreating ? (
                <span className="animate-pulse">Creating...</span>
              ) : (
                <>
                  Create Book
                  <Check size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
