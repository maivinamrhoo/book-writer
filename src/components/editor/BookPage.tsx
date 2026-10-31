"use client";

import { useEditorStore } from "@/lib/store";
import type { ChapterData, ThemeConfig, BookSettings } from "@/lib/types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TipTapImage from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import { useEffect, useCallback, useRef } from "react";
import FormattingBar from "./FormattingBar";

const MARGINS: Record<string, string> = {
  narrow: "px-8 py-6",
  normal: "px-12 py-10",
  wide: "px-16 py-14",
};

const CHAPTER_ORNAMENTS: Record<string, string> = {
  fleuron: "❧",
  vine: "❦",
  diamond: "◆",
  minimal: "—",
  none: "",
  floral: "✿",
  line: "———",
};

interface BookPageProps {
  chapter: ChapterData;
  theme: ThemeConfig;
  book: BookSettings;
}

export default function BookPage({ chapter, theme, book }: BookPageProps) {
  const { updateChapterContent } = useEditorStore();
  const isSettingContent = useRef(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        horizontalRule: {},
        blockquote: {},
        bulletList: {},
        orderedList: {},
      }),
      Placeholder.configure({
        placeholder: "Click here and start writing your story...",
        emptyEditorClass: "is-editor-empty",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TipTapImage.configure({ inline: false }),
      Typography,
    ],
    content: chapter.content || "",
    editorProps: {
      attributes: {
        class: "tiptap prose-custom focus:outline-none",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (!isSettingContent.current) {
        const html = ed.getHTML();
        updateChapterContent(chapter.id, html);
      }
    },
    autofocus: "end",
  });

  // Sync content from store when switching chapters
  useEffect(() => {
    if (editor && editor.getHTML() !== chapter.content) {
      isSettingContent.current = true;
      editor.commands.setContent(chapter.content || "");
      isSettingContent.current = false;
    }
  }, [chapter.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus editor when clicking on page
  const handlePageClick = useCallback(() => {
    if (editor && !editor.isFocused) {
      editor.commands.focus("end");
    }
  }, [editor]);

  const chapterIndex = useEditorStore.getState().chapters.findIndex(c => c.id === chapter.id);
  const chapterNumber = chapterIndex + 1;

  const getChapterNumberDisplay = useCallback(() => {
    switch (theme.chapterNumberStyle) {
      case "roman":
        return toRoman(chapterNumber);
      case "spelled":
        return spellNumber(chapterNumber);
      default:
        return String(chapterNumber);
    }
  }, [theme.chapterNumberStyle, chapterNumber]);

  const marginClass = MARGINS[book.margins] || MARGINS.normal;
  const ornament = CHAPTER_ORNAMENTS[theme.ornamentStyle] || "";

  return (
    <div className="relative">
      {/* Formatting Bar */}
      {editor && <FormattingBar editor={editor} />}

      {/* The Book Page */}
      <div
        className="book-page relative mx-auto transition-all duration-300 cursor-text"
        onClick={handlePageClick}
        style={{
          width: "595px",
          minHeight: "842px",
          backgroundColor: theme.pageBackground,
          color: theme.textColor,
          fontFamily: book.fontFamily || theme.bodyFont,
          fontSize: `${book.fontSize || 12}pt`,
          lineHeight: book.lineHeight || "1.8",
        }}
      >
        {/* Header */}
        <div
          className="absolute top-0 left-0 right-0 px-12 pt-4 flex items-center justify-between text-[9pt] opacity-40 pointer-events-none"
          style={{ fontFamily: theme.bodyFont }}
        >
          <span className={theme.headerStyle === "italic" ? "italic" : theme.headerStyle === "small-caps" ? "tracking-widest text-[8pt]" : "uppercase text-[8pt] tracking-wider"}>
            {book.author}
          </span>
          <span className={theme.headerStyle === "italic" ? "italic" : "tracking-wider text-[8pt]"}>
            {book.title}
          </span>
        </div>

        {/* Page Content */}
        <div className={`${marginClass} pt-16 pb-12`}>
          {/* Chapter Opening */}
          <div className="text-center mb-12 mt-8 pointer-events-none select-none">
            {/* Ornament */}
            {ornament && (
              <div className="chapter-ornament mb-4" style={{ color: theme.accentColor }}>
                {ornament}
              </div>
            )}

            {/* Chapter Number */}
            <div
              className="text-sm tracking-[0.3em] uppercase opacity-50 mb-3"
              style={{ fontFamily: theme.chapterTitleFont }}
            >
              Chapter {getChapterNumberDisplay()}
            </div>

            {/* Chapter Title */}
            <h2
              className="text-2xl font-semibold mb-4"
              style={{
                fontFamily: theme.chapterTitleFont,
                color: theme.textColor,
              }}
            >
              {chapter.title}
            </h2>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 opacity-30">
              <div className="w-12 h-px" style={{ backgroundColor: theme.accentColor }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accentColor }} />
              <div className="w-12 h-px" style={{ backgroundColor: theme.accentColor }} />
            </div>
          </div>

          {/* Editor - The Writing Area */}
          <div
            ref={editorContainerRef}
            className={`${theme.dropCapStyle ? "drop-cap" : ""} min-h-[400px] writing-area`}
            style={{
              fontFamily: book.fontFamily || theme.bodyFont,
              fontSize: `${book.fontSize || 12}pt`,
              lineHeight: book.lineHeight || "1.8",
            }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Footer / Page Number */}
        <div className="absolute bottom-0 left-0 right-0 px-12 pb-4 flex items-center justify-center text-[9pt] opacity-30 pointer-events-none"
          style={{ fontFamily: theme.bodyFont }}>
          <span>{chapterNumber}</span>
        </div>
      </div>
    </div>
  );
}

function toRoman(num: number): string {
  const lookup: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  let remaining = num;
  for (const [value, symbol] of lookup) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

function spellNumber(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty"];
  if (num < 20) return ones[num];
  if (num < 60) return tens[Math.floor(num / 10)] + (num % 10 ? "-" + ones[num % 10] : "");
  return String(num);
}
