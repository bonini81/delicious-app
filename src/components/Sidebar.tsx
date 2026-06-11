"use client";

import type { Bookmark } from "@/lib/types";

interface SidebarProps {
  bookmarks: Bookmark[];
  activeCategory: string | null;
  activeTags: string[];
  onCategorySelect: (category: string | null) => void;
  onTagToggle: (tag: string) => void;
}

export default function Sidebar({
  bookmarks,
  activeCategory,
  activeTags,
  onCategorySelect,
  onTagToggle,
}: SidebarProps) {
  const categories = getCategories(bookmarks);
  const tags = getAllTags(bookmarks);
  const total = bookmarks.length;

  return (
    <nav className="sidebar" aria-label="Bookmark filters">
      <div className="s-section">
        <div className="s-label">library</div>
        <button
          className={`s-item${activeCategory === null ? " active" : ""}`}
          onClick={() => onCategorySelect(null)}
        >
          <span>all bookmarks</span>
          <span className="s-count">{total}</span>
        </button>
      </div>

      <div className="s-section">
        <div className="s-label">categories</div>
        {Object.entries(categories)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([cat, count]) => (
            <button
              key={cat}
              className={`s-item${activeCategory === cat ? " active" : ""}`}
              onClick={() => onCategorySelect(cat)}
            >
              <span>{cat.toLowerCase()}</span>
              <span className="s-count">{count}</span>
            </button>
          ))}
      </div>

      {Object.keys(tags).length > 0 && (
        <div className="s-section">
          <div className="s-label">tags</div>
          <div className="tag-cloud">
            {Object.entries(tags)
              .sort((a, b) => b[1] - a[1])
              .map(([tag]) => (
                <button
                  key={tag}
                  className={`tag-chip${activeTags.includes(tag) ? " active" : ""}`}
                  onClick={() => onTagToggle(tag)}
                >
                  #{tag}
                </button>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function getCategories(bookmarks: Bookmark[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const bm of bookmarks) {
    const key = bm.category || "Uncategorized";
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

function getAllTags(bookmarks: Bookmark[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const bm of bookmarks) {
    for (const tag of bm.tags ?? []) {
      result[tag] = (result[tag] ?? 0) + 1;
    }
  }
  return result;
}
