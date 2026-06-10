import type { Bookmark } from "./types";

const STORAGE_KEY = "bkmrk_v1";
const THEME_KEY = "bkmrk_theme";

function minsAgo(mins: number): string {
  return new Date(Date.now() - mins * 60 * 1000).toISOString();
}

const DEMO_BOOKMARKS: Bookmark[] = [
  {
    id: "d01",
    url: "https://github.com",
    title: "GitHub",
    category: "Development",
    tags: ["git", "code", "collaboration"],
    description: "Where the world builds software.",
    date: minsAgo(2),
  },
  {
    id: "d02",
    url: "https://developer.mozilla.org",
    title: "MDN Web Docs",
    category: "Development",
    tags: ["docs", "reference", "javascript", "css"],
    description: "Resources for developers, by developers.",
    date: minsAgo(18),
  },
  {
    id: "d03",
    url: "https://css-tricks.com",
    title: "CSS-Tricks",
    category: "Design",
    tags: ["css", "frontend", "tips"],
    description: "Tips, tricks and techniques on using CSS.",
    date: minsAgo(60 * 2),
  },
  {
    id: "d04",
    url: "https://figma.com",
    title: "Figma",
    category: "Design",
    tags: ["design", "ui", "prototyping"],
    description: "Collaborative interface design tool.",
    date: minsAgo(60 * 6),
  },
  {
    id: "d05",
    url: "https://news.ycombinator.com",
    title: "Hacker News",
    category: "Reading",
    tags: ["news", "tech", "community"],
    description: "Social news about computer science and entrepreneurship.",
    date: minsAgo(60 * 24),
  },
  {
    id: "d06",
    url: "https://linear.app",
    title: "Linear",
    category: "Tools",
    tags: ["productivity", "project-management"],
    description: "Issue tracking built for high-performance teams.",
    date: minsAgo(60 * 24 * 2),
  },
  {
    id: "d07",
    url: "https://stripe.com/docs",
    title: "Stripe Docs",
    category: "Development",
    tags: ["docs", "payments", "api"],
    description: "Full reference for the Stripe APIs.",
    date: minsAgo(60 * 24 * 3),
  },
  {
    id: "d08",
    url: "https://vercel.com",
    title: "Vercel",
    category: "Tools",
    tags: ["deployment", "hosting", "frontend"],
    description: "Deploy web projects with zero configuration.",
    date: minsAgo(60 * 24 * 4),
  },
  {
    id: "d09",
    url: "https://tailwindcss.com",
    title: "Tailwind CSS",
    category: "Development",
    tags: ["css", "framework", "utility"],
    description: "A utility-first CSS framework for rapid UI development.",
    date: minsAgo(60 * 24 * 5),
  },
  {
    id: "d10",
    url: "https://www.typewolf.com",
    title: "Typewolf",
    category: "Design",
    tags: ["typography", "fonts", "inspiration"],
    description: "What's trending in type.",
    date: minsAgo(60 * 24 * 7),
  },
];

export function loadBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Bookmark[];
  } catch {
    // fall through to demo data
  }
  return structuredClone(DEMO_BOOKMARKS);
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
}

export function saveTheme(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
}
