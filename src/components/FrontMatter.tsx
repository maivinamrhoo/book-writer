"use client";

import { useEditorStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  BookOpen,
  Copyright,
  Heart,
  Quote,
  Users,
  List,
  FileText,
  User,
  Check,
  Trash2,
  Eye,
  Sparkles,
} from "lucide-react";
import { useState, useRef } from "react";
import { THEMES } from "@/lib/types";

type PageType = "cover" | "title" | "copyright" | "dedication" | "epigraph" | "toc" | "preface" | "acknowledgements" | "aboutAuthor" | "preview";

interface FrontMatterData {
  coverImage?: string;
  includeTitlePage: boolean;
  includeCopyright: boolean;
  copyrightYear: string;
  copyrightHolder: string;
  publisher: string;
  isbn: string;
  rights: string;
  includeDedication: boolean;
  dedicationText: string;
  includeEpigraph: boolean;
  epigraphText: string;
  epigraphAuthor: string;
  includeAcknowledgements: boolean;
  acknowledgementsText: string;
  includeToc: boolean;
  includePreface: boolean;
  prefaceText: string;
  includeAboutAuthor: boolean;
  aboutAuthorText: string;
  aboutAuthorImage?: string;
}

const defaultFrontMatter: FrontMatterData = {
  includeTitlePage: true,
  includeCopyright: true,
  copyrightYear: new Date().getFullYear().toString(),
  copyrightHolder: "",
  publisher: "",
  isbn: "",
  rights: "All rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, without the prior written permission of the publisher.",
  includeDedication: false,
  dedicationText: "",
  includeEpigraph: false,
  epigraphText: "",
  epigraphAuthor: "",
  includeAcknowledgements: false,
  acknowledgementsText: "",
  includeToc: true,
  includePreface: false,
  prefaceText: "",
  includeAboutAuthor: false,
  aboutAuthorText: "",
};

export default function FrontMatter() {
  const { currentBook, chapters, setCurrentView, updateBookSettings } = useEditorStore();
  const [activeTab, setActiveTab] = useState<PageType>("cover");
  const [frontMatter, setFrontMatter] = useState<FrontMatterData>(() => ({
    ...defaultFrontMatter,
    copyrightHolder: currentBook?.author || "",
    ...(currentBook?.frontMatter as Partial<FrontMatterData> || {}),
  }));
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authorImageRef = useRef<HTMLInputElement>(null);

  const theme = THEMES.find((t) => t.id === currentBook?.theme) || THEMES[0];

  if (!currentBook) return null;

  const updateFrontMatter = (key: keyof FrontMatterData, value: string | boolean) => {
    setFrontMatter((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "author") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (type === "cover") {
        updateFrontMatter("coverImage", base64);
      } else {
        updateFrontMatter("aboutAuthorImage", base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveFrontMatter = async () => {
    setSaving(true);
    try {
      await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentBook.id,
          frontMatter: frontMatter,
        }),
      });
      updateBookSettings({ frontMatter: frontMatter as unknown as typeof currentBook.frontMatter });
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const tabs = [
    { id: "cover" as PageType, label: "Cover", icon: ImageIcon },
    { id: "title" as PageType, label: "Title Page", icon: BookOpen },
    { id: "copyright" as PageType, label: "Copyright", icon: Copyright },
    { id: "dedication" as PageType, label: "Dedication", icon: Heart },
    { id: "epigraph" as PageType, label: "Epigraph", icon: Quote },
    { id: "toc" as PageType, label: "Contents", icon: List },
    { id: "preface" as PageType, label: "Preface", icon: FileText },
    { id: "acknowledgements" as PageType, label: "Acknowledgements", icon: Users },
    { id: "aboutAuthor" as PageType, label: "About Author", icon: User },
    { id: "preview" as PageType, label: "Preview All", icon: Eye },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "cover":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Book Cover</h3>
              <p className="text-sm text-stone-500 mb-4">Upload your book cover image. Recommended size: 1600 × 2400 pixels (2:3 ratio).</p>
            </div>

            {frontMatter.coverImage ? (
              <div className="relative">
                <img
                  src={frontMatter.coverImage}
                  alt="Book cover"
                  className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                />
                <button
                  onClick={() => updateFrontMatter("coverImage", "")}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xs mx-auto h-80 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-stone-400 hover:bg-stone-50 transition-all cursor-pointer"
              >
                <Upload size={32} className="text-stone-400" />
                <span className="text-sm text-stone-500">Click to upload cover image</span>
                <span className="text-xs text-stone-400">PNG, JPG up to 5MB</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "cover")}
              className="hidden"
            />
          </div>
        );

      case "title":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800">Title Page</h3>
                <p className="text-sm text-stone-500">Auto-generated from your book details</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={frontMatter.includeTitlePage}
                  onChange={(e) => updateFrontMatter("includeTitlePage", e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-600">Include</span>
              </label>
            </div>

            {/* Preview */}
            <div
              className="w-full max-w-sm mx-auto aspect-[2/3] rounded-lg shadow-lg flex flex-col items-center justify-center p-8 text-center"
              style={{ backgroundColor: theme.pageBackground, color: theme.textColor }}
            >
              <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: theme.chapterTitleFont }}>
                  {currentBook.title}
                </h1>
                {currentBook.subtitle && (
                  <p className="text-sm opacity-70 mb-4">{currentBook.subtitle}</p>
                )}
                <div className="w-16 h-px bg-current opacity-20 mb-4" />
                <p className="text-base" style={{ fontFamily: theme.bodyFont }}>
                  {currentBook.author}
                </p>
              </div>
            </div>
          </div>
        );

      case "copyright":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800">Copyright Page</h3>
                <p className="text-sm text-stone-500">Legal information for your book</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={frontMatter.includeCopyright}
                  onChange={(e) => updateFrontMatter("includeCopyright", e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-600">Include</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Copyright Year</label>
                <input
                  type="text"
                  value={frontMatter.copyrightYear}
                  onChange={(e) => updateFrontMatter("copyrightYear", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Copyright Holder</label>
                <input
                  type="text"
                  value={frontMatter.copyrightHolder}
                  onChange={(e) => updateFrontMatter("copyrightHolder", e.target.value)}
                  placeholder={currentBook.author}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Publisher (optional)</label>
                <input
                  type="text"
                  value={frontMatter.publisher}
                  onChange={(e) => updateFrontMatter("publisher", e.target.value)}
                  placeholder="Self-Published"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">ISBN (optional)</label>
                <input
                  type="text"
                  value={frontMatter.isbn}
                  onChange={(e) => updateFrontMatter("isbn", e.target.value)}
                  placeholder="978-0-00-000000-0"
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Rights Statement</label>
              <textarea
                value={frontMatter.rights}
                onChange={(e) => updateFrontMatter("rights", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300 text-sm"
              />
            </div>
          </div>
        );

      case "dedication":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800">Dedication</h3>
                <p className="text-sm text-stone-500">A personal message to someone special</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={frontMatter.includeDedication}
                  onChange={(e) => updateFrontMatter("includeDedication", e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-600">Include</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Dedication Text</label>
              <textarea
                value={frontMatter.dedicationText}
                onChange={(e) => updateFrontMatter("dedicationText", e.target.value)}
                rows={4}
                placeholder="For my family, who believed in me from the start..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>

            {/* Preview */}
            {frontMatter.dedicationText && (
              <div
                className="w-full max-w-sm mx-auto aspect-[2/3] rounded-lg shadow-lg flex items-center justify-center p-8"
                style={{ backgroundColor: theme.pageBackground, color: theme.textColor }}
              >
                <p className="text-center italic" style={{ fontFamily: theme.bodyFont }}>
                  {frontMatter.dedicationText}
                </p>
              </div>
            )}
          </div>
        );

      case "epigraph":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800">Epigraph</h3>
                <p className="text-sm text-stone-500">An inspiring quote to set the tone</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={frontMatter.includeEpigraph}
                  onChange={(e) => updateFrontMatter("includeEpigraph", e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-600">Include</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Quote</label>
              <textarea
                value={frontMatter.epigraphText}
                onChange={(e) => updateFrontMatter("epigraphText", e.target.value)}
                rows={3}
                placeholder="The only way to do great work is to love what you do."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Attribution</label>
              <input
                type="text"
                value={frontMatter.epigraphAuthor}
                onChange={(e) => updateFrontMatter("epigraphAuthor", e.target.value)}
                placeholder="— Steve Jobs"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>
          </div>
        );

      case "toc":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800">Table of Contents</h3>
                <p className="text-sm text-stone-500">Auto-generated from your chapters</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={frontMatter.includeToc}
                  onChange={(e) => updateFrontMatter("includeToc", e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-600">Include</span>
              </label>
            </div>

            {/* Preview */}
            <div
              className="w-full max-w-sm mx-auto aspect-[2/3] rounded-lg shadow-lg p-8 overflow-auto"
              style={{ backgroundColor: theme.pageBackground, color: theme.textColor }}
            >
              <h2 className="text-lg font-semibold mb-6 text-center" style={{ fontFamily: theme.chapterTitleFont }}>
                Contents
              </h2>
              <div className="space-y-3">
                {chapters.map((ch, i) => (
                  <div key={ch.id} className="flex items-end gap-2 text-sm" style={{ fontFamily: theme.bodyFont }}>
                    <span>{ch.title}</span>
                    <span className="flex-1 border-b border-dotted border-current opacity-30" />
                    <span className="opacity-50">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "preface":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800">Preface / Foreword</h3>
                <p className="text-sm text-stone-500">An introduction to your book</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={frontMatter.includePreface}
                  onChange={(e) => updateFrontMatter("includePreface", e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-600">Include</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Preface Text</label>
              <textarea
                value={frontMatter.prefaceText}
                onChange={(e) => updateFrontMatter("prefaceText", e.target.value)}
                rows={8}
                placeholder="Write about why you wrote this book, what inspired you, or what readers can expect..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>
          </div>
        );

      case "acknowledgements":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800">Acknowledgements</h3>
                <p className="text-sm text-stone-500">Thank those who helped you</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={frontMatter.includeAcknowledgements}
                  onChange={(e) => updateFrontMatter("includeAcknowledgements", e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-600">Include</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Acknowledgements Text</label>
              <textarea
                value={frontMatter.acknowledgementsText}
                onChange={(e) => updateFrontMatter("acknowledgementsText", e.target.value)}
                rows={8}
                placeholder="I would like to thank my editor, my family, and everyone who supported me during this journey..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>
          </div>
        );

      case "aboutAuthor":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800">About the Author</h3>
                <p className="text-sm text-stone-500">Tell readers about yourself (back matter)</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={frontMatter.includeAboutAuthor}
                  onChange={(e) => updateFrontMatter("includeAboutAuthor", e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <span className="text-sm text-stone-600">Include</span>
              </label>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {frontMatter.aboutAuthorImage ? (
                  <div className="relative">
                    <img
                      src={frontMatter.aboutAuthorImage}
                      alt="Author"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <button
                      onClick={() => updateFrontMatter("aboutAuthorImage", "")}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => authorImageRef.current?.click()}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-stone-300 flex flex-col items-center justify-center gap-1 hover:border-stone-400 hover:bg-stone-50 transition-all"
                  >
                    <User size={20} className="text-stone-400" />
                    <span className="text-[10px] text-stone-400">Add Photo</span>
                  </button>
                )}
                <input
                  ref={authorImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "author")}
                  className="hidden"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-stone-600 mb-1">Bio</label>
                <textarea
                  value={frontMatter.aboutAuthorText}
                  onChange={(e) => updateFrontMatter("aboutAuthorText", e.target.value)}
                  rows={6}
                  placeholder={`${currentBook.author} is the author of... They live in... When not writing, they enjoy...`}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300"
                />
              </div>
            </div>
          </div>
        );

      case "preview":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Preview All Pages</h3>
              <p className="text-sm text-stone-500">See how your front and back matter will appear</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Cover */}
              {frontMatter.coverImage && (
                <PreviewPage title="Cover">
                  <img src={frontMatter.coverImage} alt="Cover" className="w-full h-full object-cover" />
                </PreviewPage>
              )}

              {/* Title Page */}
              {frontMatter.includeTitlePage && (
                <PreviewPage title="Title Page" theme={theme}>
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <h1 className="text-sm font-bold mb-1" style={{ fontFamily: theme.chapterTitleFont }}>
                      {currentBook.title}
                    </h1>
                    {currentBook.subtitle && <p className="text-[8px] opacity-70 mb-2">{currentBook.subtitle}</p>}
                    <div className="w-8 h-px bg-current opacity-20 mb-2" />
                    <p className="text-[10px]">{currentBook.author}</p>
                  </div>
                </PreviewPage>
              )}

              {/* Copyright */}
              {frontMatter.includeCopyright && (
                <PreviewPage title="Copyright" theme={theme}>
                  <div className="text-[6px] text-center space-y-1 opacity-70">
                    <p>© {frontMatter.copyrightYear} {frontMatter.copyrightHolder || currentBook.author}</p>
                    {frontMatter.publisher && <p>Published by {frontMatter.publisher}</p>}
                    {frontMatter.isbn && <p>ISBN: {frontMatter.isbn}</p>}
                  </div>
                </PreviewPage>
              )}

              {/* Dedication */}
              {frontMatter.includeDedication && frontMatter.dedicationText && (
                <PreviewPage title="Dedication" theme={theme}>
                  <p className="text-[8px] italic text-center">{frontMatter.dedicationText.slice(0, 100)}...</p>
                </PreviewPage>
              )}

              {/* Epigraph */}
              {frontMatter.includeEpigraph && frontMatter.epigraphText && (
                <PreviewPage title="Epigraph" theme={theme}>
                  <div className="text-center">
                    <p className="text-[8px] italic">&ldquo;{frontMatter.epigraphText.slice(0, 80)}...&rdquo;</p>
                    {frontMatter.epigraphAuthor && <p className="text-[7px] mt-1 opacity-70">{frontMatter.epigraphAuthor}</p>}
                  </div>
                </PreviewPage>
              )}

              {/* TOC */}
              {frontMatter.includeToc && (
                <PreviewPage title="Contents" theme={theme}>
                  <div className="text-[6px] space-y-0.5">
                    {chapters.slice(0, 5).map((ch, i) => (
                      <div key={ch.id} className="flex justify-between">
                        <span className="truncate">{ch.title}</span>
                        <span>{i + 1}</span>
                      </div>
                    ))}
                    {chapters.length > 5 && <p className="opacity-50">...</p>}
                  </div>
                </PreviewPage>
              )}

              {/* About Author */}
              {frontMatter.includeAboutAuthor && (
                <PreviewPage title="About Author" theme={theme}>
                  <div className="flex flex-col items-center text-center gap-1">
                    {frontMatter.aboutAuthorImage && (
                      <img src={frontMatter.aboutAuthorImage} alt="Author" className="w-8 h-8 rounded-full object-cover" />
                    )}
                    <p className="text-[6px]">{frontMatter.aboutAuthorText?.slice(0, 60) || currentBook.author}...</p>
                  </div>
                </PreviewPage>
              )}
            </div>
          </div>
        );
    }
  };

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
          <div>
            <h1 className="text-lg font-medium text-stone-800" style={{ fontFamily: "Playfair Display" }}>
              Front & Back Matter
            </h1>
            <p className="text-xs text-stone-400">Cover, title page, copyright, and more</p>
          </div>
        </div>
        <button
          onClick={() => { saveFrontMatter().then(() => setCurrentView("editor")); }}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 text-white hover:bg-stone-700 transition-colors text-sm"
        >
          {saving ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <Check size={14} />
              Save & Return
            </>
          )}
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-6 flex gap-6">
        {/* Tabs */}
        <div className="w-52 space-y-1 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 mb-3">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Pages</span>
          </div>
          {tabs.map((tab) => {
            const isEnabled =
              tab.id === "cover" ||
              tab.id === "preview" ||
              (tab.id === "title" && frontMatter.includeTitlePage) ||
              (tab.id === "copyright" && frontMatter.includeCopyright) ||
              (tab.id === "dedication" && frontMatter.includeDedication) ||
              (tab.id === "epigraph" && frontMatter.includeEpigraph) ||
              (tab.id === "toc" && frontMatter.includeToc) ||
              (tab.id === "preface" && frontMatter.includePreface) ||
              (tab.id === "acknowledgements" && frontMatter.includeAcknowledgements) ||
              (tab.id === "aboutAuthor" && frontMatter.includeAboutAuthor);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-stone-800 text-white shadow-sm"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <tab.icon size={16} className={isEnabled && tab.id !== "preview" && tab.id !== "cover" ? "text-green-500" : ""} />
                <span className="flex-1 text-left">{tab.label}</span>
                {isEnabled && tab.id !== "preview" && tab.id !== "cover" && activeTab !== tab.id && (
                  <Check size={12} className="text-green-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-stone-200/80 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PreviewPage({
  title,
  theme,
  children,
}: {
  title: string;
  theme?: typeof THEMES[0];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] text-stone-400 font-medium">{title}</span>
      <div
        className="aspect-[2/3] rounded-lg shadow-md flex items-center justify-center p-3 overflow-hidden"
        style={{
          backgroundColor: theme?.pageBackground || "#fff",
          color: theme?.textColor || "#333",
          fontFamily: theme?.bodyFont || "serif",
        }}
      >
        {children}
      </div>
    </div>
  );
}
