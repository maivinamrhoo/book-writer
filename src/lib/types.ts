export interface BookSettings {
  id: string;
  title: string;
  author: string;
  subtitle?: string;
  genre: string;
  language: string;
  pageSize: string;
  margins: string;
  fontFamily: string;
  fontSize: number;
  theme: string;
  lineHeight: string;
  paragraphSpacing: string;
  headerText?: string;
  footerText?: string;
  pageNumberPosition: string;
  coverData?: CoverData;
  frontMatter?: FrontMatterConfig;
  backMatter?: BackMatterConfig;
  wordCount: number;
}

export interface ChapterData {
  id: string;
  bookId: string;
  title: string;
  content: string;
  order: number;
  isExpanded: boolean;
  wordCount: number;
}

export interface CoverData {
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  titleFont?: string;
  titleColor?: string;
  subtitleColor?: string;
  authorColor?: string;
  opacity?: number;
}

export interface FrontMatterConfig {
  titlePage: boolean;
  copyrightPage: boolean;
  dedication: boolean;
  dedicationText?: string;
  epigraph: boolean;
  epigraphText?: string;
  epigraphAuthor?: string;
  preface: boolean;
  prefaceText?: string;
  acknowledgements: boolean;
  acknowledgementsText?: string;
  tableOfContents: boolean;
}

export interface BackMatterConfig {
  aboutAuthor: boolean;
  aboutAuthorText?: string;
  otherBooks: boolean;
  otherBooksText?: string;
  thankYou: boolean;
  thankYouText?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  pageBackground: string;
  textColor: string;
  chapterTitleFont: string;
  bodyFont: string;
  accentColor: string;
  ornamentStyle: string;
  headerStyle: string;
  footerStyle: string;
  dropCapStyle: boolean;
  chapterNumberStyle: string;
}

export const PAGE_SIZES: Record<string, { width: number; height: number; label: string }> = {
  A5: { width: 148, height: 210, label: "A5 (148 × 210 mm)" },
  A4: { width: 210, height: 297, label: "A4 (210 × 297 mm)" },
  Letter: { width: 216, height: 279, label: "Letter (8.5 × 11 in)" },
  "6x9": { width: 152, height: 229, label: '6" × 9" (Trade)' },
  "5.5x8.5": { width: 140, height: 216, label: '5.5" × 8.5"' },
};

export const FONTS = [
  { value: "Libre Baskerville", label: "Libre Baskerville", category: "serif" },
  { value: "Playfair Display", label: "Playfair Display", category: "serif" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond", category: "serif" },
  { value: "Lora", label: "Lora", category: "serif" },
  { value: "Merriweather", label: "Merriweather", category: "serif" },
  { value: "Crimson Text", label: "Crimson Text", category: "serif" },
  { value: "EB Garamond", label: "EB Garamond", category: "serif" },
  { value: "Cinzel", label: "Cinzel", category: "serif" },
  { value: "Inter", label: "Inter", category: "sans-serif" },
  { value: "Source Serif 4", label: "Source Serif", category: "serif" },
];

export const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Mystery",
  "Thriller",
  "Horror",
  "Poetry",
  "Biography",
  "Self-Help",
  "Children",
  "Academic",
  "Other",
];

export const THEMES: ThemeConfig[] = [
  {
    id: "classic-novel",
    name: "Classic Novel",
    description: "Timeless elegance inspired by literary masterpieces",
    pageBackground: "#FFFEF9",
    textColor: "#2D2A24",
    chapterTitleFont: "Playfair Display",
    bodyFont: "Libre Baskerville",
    accentColor: "#8B7355",
    ornamentStyle: "fleuron",
    headerStyle: "italic",
    footerStyle: "centered",
    dropCapStyle: true,
    chapterNumberStyle: "roman",
  },
  {
    id: "vintage-paper",
    name: "Vintage Paper",
    description: "Warm tones reminiscent of aged parchment",
    pageBackground: "#F5ECD7",
    textColor: "#3C3428",
    chapterTitleFont: "Cormorant Garamond",
    bodyFont: "Crimson Text",
    accentColor: "#8B6914",
    ornamentStyle: "vine",
    headerStyle: "small-caps",
    footerStyle: "centered",
    dropCapStyle: true,
    chapterNumberStyle: "spelled",
  },
  {
    id: "luxury-book",
    name: "Luxury Book",
    description: "Premium design with gold accents",
    pageBackground: "#FAFAFA",
    textColor: "#1A1A1A",
    chapterTitleFont: "Cinzel",
    bodyFont: "EB Garamond",
    accentColor: "#C4A265",
    ornamentStyle: "diamond",
    headerStyle: "uppercase",
    footerStyle: "elegant",
    dropCapStyle: true,
    chapterNumberStyle: "numeral",
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    description: "Easy on the eyes for late-night writing",
    pageBackground: "#1E1E1E",
    textColor: "#E0DDD5",
    chapterTitleFont: "Playfair Display",
    bodyFont: "Lora",
    accentColor: "#A0926B",
    ornamentStyle: "minimal",
    headerStyle: "italic",
    footerStyle: "centered",
    dropCapStyle: false,
    chapterNumberStyle: "numeral",
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    description: "Clean, distraction-free writing surface",
    pageBackground: "#FFFFFF",
    textColor: "#333333",
    chapterTitleFont: "Inter",
    bodyFont: "Inter",
    accentColor: "#666666",
    ornamentStyle: "none",
    headerStyle: "minimal",
    footerStyle: "minimal",
    dropCapStyle: false,
    chapterNumberStyle: "numeral",
  },
  {
    id: "poetry-layout",
    name: "Poetry Layout",
    description: "Spacious layout designed for verse and stanza",
    pageBackground: "#FFFEF5",
    textColor: "#2C2C2C",
    chapterTitleFont: "Cormorant Garamond",
    bodyFont: "Cormorant Garamond",
    accentColor: "#7B6B8A",
    ornamentStyle: "floral",
    headerStyle: "italic",
    footerStyle: "centered",
    dropCapStyle: false,
    chapterNumberStyle: "roman",
  },
  {
    id: "modern-clean",
    name: "Modern Clean",
    description: "Contemporary design with sharp typography",
    pageBackground: "#FDFDFD",
    textColor: "#222222",
    chapterTitleFont: "Inter",
    bodyFont: "Source Serif 4",
    accentColor: "#0066CC",
    ornamentStyle: "line",
    headerStyle: "minimal",
    footerStyle: "minimal",
    dropCapStyle: false,
    chapterNumberStyle: "numeral",
  },
  {
    id: "sepia",
    name: "Sepia Warmth",
    description: "Warm sepia tones for a cozy reading experience",
    pageBackground: "#F4ECD8",
    textColor: "#433422",
    chapterTitleFont: "Lora",
    bodyFont: "Merriweather",
    accentColor: "#8B6F47",
    ornamentStyle: "fleuron",
    headerStyle: "italic",
    footerStyle: "centered",
    dropCapStyle: true,
    chapterNumberStyle: "roman",
  },
];
