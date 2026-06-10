"use client";

import { useState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { loadBookmarks, saveBookmarks } from "@/lib/storage";
import type { Bookmark } from "@/lib/types";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BookmarkCard from "@/components/BookmarkCard";
import AddBookmarkModal, {
  type BookmarkFormData,
} from "@/components/AddBookmarkModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function BookmarksClient() {
  const router = useRouter();
  const { toggleTheme } = useTheme();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const authed =
      typeof window !== "undefined" &&
      sessionStorage.getItem("bkmrk_s") === "1";
    if (!authed) {
      router.replace("/login");
      return;
    }
    const data = loadBookmarks();
    startTransition(() => {
      setBookmarks(data);
      setMounted(true);
    });
  }, [router]);

  if (!mounted) return null;

  const filtered = getFiltered(bookmarks, activeCategory, activeTags, search);
  const categories = getCategories(bookmarks);
  const editingBookmark = editingId
    ? bookmarks.find((b) => b.id === editingId) ?? null
    : null;

  function handleAddOpen() {
    setEditingId(null);
    setModalOpen(true);
  }

  function handleEditOpen(id: string) {
    setEditingId(id);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditingId(null);
  }

  function handleSave(data: BookmarkFormData) {
    let updated: Bookmark[];
    if (editingId) {
      updated = bookmarks.map((bm) =>
        bm.id === editingId ? { ...bm, ...data } : bm
      );
    } else {
      const newBookmark: Bookmark = {
        id: Date.now().toString(36),
        date: new Date().toISOString(),
        ...data,
      };
      updated = [newBookmark, ...bookmarks];
    }
    setBookmarks(updated);
    saveBookmarks(updated);
    handleModalClose();
  }

  function handleDeleteRequest(id: string) {
    setPendingDeleteId(id);
  }

  function handleDeleteConfirm() {
    if (!pendingDeleteId) return;
    const updated = bookmarks.filter((b) => b.id !== pendingDeleteId);
    setBookmarks(updated);
    saveBookmarks(updated);
    setPendingDeleteId(null);
  }

  function handleDeleteCancel() {
    setPendingDeleteId(null);
  }

  function handleTagToggle(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleTagClick(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev : [...prev, tag]
    );
  }

  function handleTagRemove(tag: string) {
    setActiveTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleLogout() {
    sessionStorage.removeItem("bkmrk_s");
    router.replace("/login");
  }

  const headingText = activeCategory
    ? activeCategory.toLowerCase()
    : "all bookmarks";

  return (
    <div className="app">
      <Header
        search={search}
        onSearchChange={setSearch}
        onAddBookmark={handleAddOpen}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <div className="app-body">
        <Sidebar
          bookmarks={bookmarks}
          activeCategory={activeCategory}
          activeTags={activeTags}
          onCategorySelect={setActiveCategory}
          onTagToggle={handleTagToggle}
        />

        <main className="main-content">
          <div className="main-top">
            <span className="main-heading">{headingText}</span>
            <span className="main-sub">
              {"// "}{filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {activeTags.length > 0 && (
            <div className="filter-row">
              {activeTags.map((tag) => (
                <button
                  key={tag}
                  className="filter-badge"
                  onClick={() => handleTagRemove(tag)}
                  aria-label={`Remove filter: ${tag}`}
                >
                  #{tag} ×
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◻</div>
              <h3>nothing here yet</h3>
              <p>{"// try a different filter, or add a new bookmark"}</p>
            </div>
          ) : (
            <div className="bm-list">
              {filtered.map((bm) => (
                <BookmarkCard
                  key={bm.id}
                  bookmark={bm}
                  onEdit={handleEditOpen}
                  onDelete={handleDeleteRequest}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="app-footer">
        <span>
          {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
        </span>
        <div className="footer-gap" />
        <span>bkmrk v1.0 — personal use</span>
      </footer>

      <AddBookmarkModal
        isOpen={modalOpen}
        editingBookmark={editingBookmark}
        categories={Object.keys(categories)}
        onSave={handleSave}
        onClose={handleModalClose}
      />

      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

function getFiltered(
  bookmarks: Bookmark[],
  activeCategory: string | null,
  activeTags: string[],
  search: string
): Bookmark[] {
  let list = bookmarks;

  if (activeCategory) {
    list = list.filter(
      (bm) => (bm.category || "Uncategorized") === activeCategory
    );
  }

  if (activeTags.length > 0) {
    list = list.filter((bm) =>
      activeTags.every((t) => (bm.tags ?? []).includes(t))
    );
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (bm) =>
        bm.title.toLowerCase().includes(q) ||
        bm.url.toLowerCase().includes(q) ||
        (bm.description ?? "").toLowerCase().includes(q) ||
        (bm.tags ?? []).some((t) => t.includes(q))
    );
  }

  return [...list].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
