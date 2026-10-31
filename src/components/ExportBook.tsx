"use client";

import { useEditorStore } from "@/lib/store";
import { THEMES } from "@/lib/types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Download,
  File,
  FileType2,
  FileCode,
  CheckCircle2,
} from "lucide-react";
import { useState, useCallback } from "react";

interface FrontMatterData {
  coverImage?: string;
  includeTitlePage?: boolean;
  includeCopyright?: boolean;
  copyrightYear?: string;
  copyrightHolder?: string;
  publisher?: string;
  isbn?: string;
  rights?: string;
  includeDedication?: boolean;
  dedicationText?: string;
  includeEpigraph?: boolean;
  epigraphText?: string;
  epigraphAuthor?: string;
  includeAcknowledgements?: boolean;
  acknowledgementsText?: string;
  includeToc?: boolean;
  includePreface?: boolean;
  prefaceText?: string;
  includeAboutAuthor?: boolean;
  aboutAuthorText?: string;
  aboutAuthorImage?: string;
}

export default function ExportBook() {
  const { currentBook, chapters, setCurrentView } = useEditorStore();
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string | null>(null);

  const theme = THEMES.find((t) => t.id === currentBook?.theme) || THEMES[0];
  const frontMatter = (currentBook?.frontMatter || {}) as FrontMatterData;

  const generateHTML = useCallback(() => {
    if (!currentBook) return "";

    // Generate front matter pages
    let frontMatterHTML = "";

    // Cover page
    if (frontMatter.coverImage) {
      frontMatterHTML += `
        <div class="cover-page" style="page-break-after: always; text-align: center; padding: 0;">
          <img src="${frontMatter.coverImage}" alt="Book Cover" style="max-width: 100%; max-height: 100vh; object-fit: contain;" />
        </div>
      `;
    }

    // Title page
    if (frontMatter.includeTitlePage !== false) {
      frontMatterHTML += `
        <div class="title-page">
          <h1>${currentBook.title}</h1>
          ${currentBook.subtitle ? `<div class="subtitle">${currentBook.subtitle}</div>` : ""}
          <div class="author">${currentBook.author}</div>
        </div>
      `;
    }

    // Copyright page
    if (frontMatter.includeCopyright) {
      frontMatterHTML += `
        <div class="copyright-page" style="page-break-after: always; padding: 60px 40px; font-size: 0.85em;">
          <div style="margin-bottom: 2em;">
            <p style="margin-bottom: 0.5em;"><strong>${currentBook.title}</strong></p>
            ${currentBook.subtitle ? `<p style="opacity: 0.7; margin-bottom: 1em;">${currentBook.subtitle}</p>` : ""}
          </div>
          <p style="margin-bottom: 1em;">Copyright © ${frontMatter.copyrightYear || new Date().getFullYear()} ${frontMatter.copyrightHolder || currentBook.author}</p>
          ${frontMatter.publisher ? `<p style="margin-bottom: 1em;">Published by ${frontMatter.publisher}</p>` : ""}
          ${frontMatter.isbn ? `<p style="margin-bottom: 1em;">ISBN: ${frontMatter.isbn}</p>` : ""}
          <p style="margin-top: 2em; font-size: 0.9em; opacity: 0.8;">${frontMatter.rights || "All rights reserved."}</p>
        </div>
      `;
    }

    // Dedication
    if (frontMatter.includeDedication && frontMatter.dedicationText) {
      frontMatterHTML += `
        <div class="dedication-page" style="page-break-after: always; display: flex; align-items: center; justify-content: center; min-height: 80vh; text-align: center; padding: 60px;">
          <p style="font-style: italic; font-size: 1.1em;">${frontMatter.dedicationText}</p>
        </div>
      `;
    }

    // Epigraph
    if (frontMatter.includeEpigraph && frontMatter.epigraphText) {
      frontMatterHTML += `
        <div class="epigraph-page" style="page-break-after: always; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center; padding: 60px;">
          <blockquote style="font-style: italic; font-size: 1.1em; border: none; padding: 0; max-width: 400px;">
            "${frontMatter.epigraphText}"
          </blockquote>
          ${frontMatter.epigraphAuthor ? `<p style="margin-top: 1em; opacity: 0.7;">${frontMatter.epigraphAuthor}</p>` : ""}
        </div>
      `;
    }

    // Table of Contents
    if (frontMatter.includeToc) {
      const tocItems = chapters.map((ch, i) => `
        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 0.75em;">
          <span>${ch.title}</span>
          <span style="flex: 1; border-bottom: 1px dotted currentColor; opacity: 0.3;"></span>
          <span style="opacity: 0.5;">${i + 1}</span>
        </div>
      `).join("");
      
      frontMatterHTML += `
        <div class="toc-page" style="page-break-after: always; padding: 60px 40px;">
          <h2 style="text-align: center; font-family: '${theme.chapterTitleFont}', serif; margin-bottom: 2em;">Contents</h2>
          ${tocItems}
        </div>
      `;
    }

    // Preface
    if (frontMatter.includePreface && frontMatter.prefaceText) {
      frontMatterHTML += `
        <div class="preface-page" style="page-break-after: always; padding: 60px 40px;">
          <h2 style="text-align: center; font-family: '${theme.chapterTitleFont}', serif; margin-bottom: 2em;">Preface</h2>
          <div style="white-space: pre-wrap;">${frontMatter.prefaceText}</div>
        </div>
      `;
    }

    // Acknowledgements (at the beginning or end - placing at beginning)
    if (frontMatter.includeAcknowledgements && frontMatter.acknowledgementsText) {
      frontMatterHTML += `
        <div class="acknowledgements-page" style="page-break-after: always; padding: 60px 40px;">
          <h2 style="text-align: center; font-family: '${theme.chapterTitleFont}', serif; margin-bottom: 2em;">Acknowledgements</h2>
          <div style="white-space: pre-wrap;">${frontMatter.acknowledgementsText}</div>
        </div>
      `;
    }

    // Chapters
    const chapterHTML = chapters
      .map((ch, i) => {
        return `
          <div class="chapter" style="page-break-before: always;">
            <div class="chapter-header">
              <div class="chapter-number">Chapter ${i + 1}</div>
              <h2 class="chapter-title">${ch.title}</h2>
              <div class="chapter-divider"></div>
            </div>
            <div class="chapter-content">${ch.content || "<p></p>"}</div>
          </div>
        `;
      })
      .join("\n");

    // Back matter - About Author
    let backMatterHTML = "";
    if (frontMatter.includeAboutAuthor && frontMatter.aboutAuthorText) {
      backMatterHTML += `
        <div class="about-author-page" style="page-break-before: always; padding: 60px 40px; text-align: center;">
          <h2 style="font-family: '${theme.chapterTitleFont}', serif; margin-bottom: 2em;">About the Author</h2>
          ${frontMatter.aboutAuthorImage ? `<img src="${frontMatter.aboutAuthorImage}" alt="${currentBook.author}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5em;" />` : ""}
          <p style="max-width: 500px; margin: 0 auto;">${frontMatter.aboutAuthorText}</p>
        </div>
      `;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${currentBook.title} by ${currentBook.author}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(currentBook.fontFamily || theme.bodyFont)}:ital,wght@0,400;0,700;1,400&family=${encodeURIComponent(theme.chapterTitleFont)}:wght@400;600;700&display=swap');
    
    body {
      font-family: '${currentBook.fontFamily || theme.bodyFont}', serif;
      font-size: ${currentBook.fontSize || 12}pt;
      line-height: ${currentBook.lineHeight || "1.8"};
      color: ${theme.textColor};
      background: ${theme.pageBackground};
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .title-page {
      text-align: center;
      padding: 100px 20px;
      page-break-after: always;
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .title-page h1 {
      font-family: '${theme.chapterTitleFont}', serif;
      font-size: 2.5em;
      margin-bottom: 0.5em;
    }
    
    .title-page .subtitle {
      font-size: 1.2em;
      opacity: 0.7;
      margin-bottom: 1em;
    }
    
    .title-page .author {
      font-size: 1.1em;
      letter-spacing: 0.1em;
    }
    
    .chapter-header {
      text-align: center;
      margin-bottom: 3em;
      padding-top: 4em;
    }
    
    .chapter-number {
      font-size: 0.85em;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      opacity: 0.5;
      margin-bottom: 0.5em;
    }
    
    .chapter-title {
      font-family: '${theme.chapterTitleFont}', serif;
      font-size: 1.8em;
      margin-bottom: 1em;
    }
    
    .chapter-divider {
      width: 60px;
      height: 1px;
      background: ${theme.accentColor};
      margin: 0 auto;
      opacity: 0.3;
    }
    
    .chapter-content p {
      text-indent: 1.5em;
      margin-bottom: 0;
    }
    
    .chapter-content p:first-child {
      text-indent: 0;
    }
    
    blockquote {
      border-left: 3px solid ${theme.accentColor};
      padding-left: 1.2em;
      margin: 1.5em 0;
      font-style: italic;
      opacity: 0.85;
    }
    
    @media print {
      body { padding: 0; max-width: none; }
      .chapter { page-break-before: always; }
      .cover-page { page-break-after: always; }
    }
  </style>
</head>
<body>
  ${frontMatterHTML}
  ${chapterHTML}
  ${backMatterHTML}
</body>
</html>`;
  }, [currentBook, chapters, theme, frontMatter]);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format: string) => {
    if (!currentBook) return;
    setExporting(format);

    try {
      const baseFilename = currentBook.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");

      switch (format) {
        case "html": {
          const html = generateHTML();
          downloadFile(html, `${baseFilename}.html`, "text/html");
          break;
        }
        case "txt": {
          const text = chapters
            .map((ch, i) => {
              const plainText = ch.content
                .replace(/<br\s*\/?>/g, "\n")
                .replace(/<\/p><p[^>]*>/g, "\n\n")
                .replace(/<[^>]*>/g, "");
              return `CHAPTER ${i + 1}\n${ch.title}\n\n${plainText}`;
            })
            .join("\n\n---\n\n");

          const fullText = `${currentBook.title}\nby ${currentBook.author}\n${currentBook.subtitle ? `\n${currentBook.subtitle}\n` : ""}\n\n${"=".repeat(40)}\n\n${text}`;
          downloadFile(fullText, `${baseFilename}.txt`, "text/plain");
          break;
        }
        case "pdf": {
          const html = generateHTML();
          const printWindow = window.open("", "_blank");
          if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => {
              printWindow.print();
            }, 500);
          }
          break;
        }
        case "markdown": {
          const md = chapters
            .map((ch, i) => {
              const plainText = ch.content
                .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
                .replace(/<em>(.*?)<\/em>/g, "*$1*")
                .replace(/<u>(.*?)<\/u>/g, "_$1_")
                .replace(/<br\s*\/?>/g, "\n")
                .replace(/<\/p><p[^>]*>/g, "\n\n")
                .replace(/<blockquote><p>(.*?)<\/p><\/blockquote>/g, "> $1")
                .replace(/<h1>(.*?)<\/h1>/g, "# $1\n")
                .replace(/<h2>(.*?)<\/h2>/g, "## $1\n")
                .replace(/<h3>(.*?)<\/h3>/g, "### $1\n")
                .replace(/<[^>]*>/g, "");
              return `## Chapter ${i + 1}: ${ch.title}\n\n${plainText}`;
            })
            .join("\n\n---\n\n");

          const fullMd = `# ${currentBook.title}\n\n**${currentBook.author}**\n\n${currentBook.subtitle ? `*${currentBook.subtitle}*\n\n` : ""}---\n\n${md}`;
          downloadFile(fullMd, `${baseFilename}.md`, "text/markdown");
          break;
        }
      }

      setExported(format);
      setTimeout(() => setExported(null), 3000);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(null);
    }
  };

  if (!currentBook) return null;

  const formats = [
    {
      id: "pdf",
      name: "PDF (Print)",
      description: "Print-ready PDF via browser print dialog",
      icon: File,
      color: "text-red-500 bg-red-50",
    },
    {
      id: "html",
      name: "HTML",
      description: "Styled HTML file with all formatting",
      icon: FileCode,
      color: "text-blue-500 bg-blue-50",
    },
    {
      id: "txt",
      name: "Plain Text",
      description: "Simple text file without formatting",
      icon: FileText,
      color: "text-stone-500 bg-stone-100",
    },
    {
      id: "markdown",
      name: "Markdown",
      description: "Markdown with basic formatting preserved",
      icon: FileType2,
      color: "text-purple-500 bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200/80 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => setCurrentView("editor")}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-medium text-stone-800" style={{ fontFamily: "Playfair Display" }}>
            Export Book
          </h1>
          <p className="text-xs text-stone-400">{currentBook.title} by {currentBook.author}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-8">
        {/* Book Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-stone-200/80 p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-24 rounded-lg shadow-md flex items-center justify-center"
              style={{ backgroundColor: theme.pageBackground, color: theme.textColor }}
            >
              <span style={{ fontFamily: theme.chapterTitleFont, fontSize: "10px" }} className="text-center px-1 truncate">
                {currentBook.title}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-stone-800" style={{ fontFamily: "Playfair Display" }}>
                {currentBook.title}
              </h2>
              <p className="text-sm text-stone-500">{currentBook.author}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                <span>{chapters.length} chapter{chapters.length !== 1 ? "s" : ""}</span>
                <span>·</span>
                <span>{chapters.reduce((sum, c) => sum + c.wordCount, 0).toLocaleString()} words</span>
                <span>·</span>
                <span>{currentBook.theme}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Export Formats */}
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
          Choose Export Format
        </h3>

        <div className="space-y-3">
          {formats.map((format, i) => (
            <motion.button
              key={format.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleExport(format.id)}
              disabled={exporting === format.id}
              className="w-full flex items-center gap-4 p-5 bg-white rounded-xl border border-stone-200/80 hover:border-stone-300 hover:shadow-md transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${format.color}`}>
                <format.icon size={20} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-stone-800">{format.name}</div>
                <div className="text-sm text-stone-500">{format.description}</div>
              </div>
              <div>
                {exporting === format.id ? (
                  <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-800 animate-spin" />
                ) : exported === format.id ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : (
                  <Download size={18} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
