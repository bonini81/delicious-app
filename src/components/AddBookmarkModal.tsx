"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import type { Bookmark } from "@/lib/types";

interface AddBookmarkModalProps {
  isOpen: boolean;
  editingBookmark: Bookmark | null;
  categories: string[];
  onSave: (data: BookmarkFormData) => void;
  onClose: () => void;
}

export interface BookmarkFormData {
  url: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
}

interface FormState {
  url: string;
  title: string;
  category: string;
  newCategory: string;
  tags: string;
  description: string;
  urlError: boolean;
  titleError: boolean;
}

const EMPTY_FORM: FormState = {
  url: "",
  title: "",
  category: "",
  newCategory: "",
  tags: "",
  description: "",
  urlError: false,
  titleError: false,
};

export default function AddBookmarkModal({
  isOpen,
  editingBookmark,
  categories,
  onSave,
  onClose,
}: AddBookmarkModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const nextForm = editingBookmark
      ? {
          url: editingBookmark.url,
          title: editingBookmark.title,
          category: editingBookmark.category ?? "",
          newCategory: "",
          tags: editingBookmark.tags.join(", "),
          description: editingBookmark.description ?? "",
          urlError: false,
          titleError: false,
        }
      : EMPTY_FORM;
    startTransition(() => setForm(nextForm));
    setTimeout(() => urlInputRef.current?.focus(), 80);
  }, [isOpen, editingBookmark]);

  function patch(updates: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function handleSave() {
    const trimmedUrl = form.url.trim();
    const trimmedTitle = form.title.trim();
    if (!trimmedUrl || !trimmedTitle) {
      patch({ urlError: !trimmedUrl, titleError: !trimmedTitle });
      return;
    }

    const resolvedCategory = form.newCategory.trim() || form.category;
    const parsedTags = form.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    onSave({
      url: trimmedUrl,
      title: trimmedTitle,
      category: resolvedCategory,
      tags: parsedTags,
      description: form.description.trim(),
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && e.ctrlKey) handleSave();
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className={`overlay${isOpen ? " open" : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={editingBookmark ? "Edit bookmark" : "Add bookmark"}
    >
      <div className="modal" onKeyDown={handleKeyDown}>
        <div className="modal-head">
          <span className="modal-title">
            {editingBookmark ? "// edit bookmark" : "// add bookmark"}
          </span>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-fields">
          <div className="field">
            <label htmlFor="f-url">url *</label>
            <input
              id="f-url"
              type="url"
              ref={urlInputRef}
              placeholder="https://…"
              value={form.url}
              onChange={(e) =>
                patch({ url: e.target.value, urlError: false })
              }
              style={form.urlError ? { borderColor: "var(--red)" } : undefined}
            />
          </div>

          <div className="field">
            <label htmlFor="f-title">title *</label>
            <input
              id="f-title"
              type="text"
              placeholder="page title"
              value={form.title}
              onChange={(e) =>
                patch({ title: e.target.value, titleError: false })
              }
              style={
                form.titleError ? { borderColor: "var(--red)" } : undefined
              }
            />
          </div>

          <div className="modal-row">
            <div className="field">
              <label htmlFor="f-cat">category</label>
              <select
                id="f-cat"
                value={form.category}
                onChange={(e) => patch({ category: e.target.value })}
              >
                <option value="">— select category —</option>
                {categories.sort().map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="f-newcat">new category</label>
              <input
                id="f-newcat"
                type="text"
                placeholder="or type to create"
                value={form.newCategory}
                onChange={(e) => patch({ newCategory: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="f-tags">tags — comma separated</label>
            <input
              id="f-tags"
              type="text"
              placeholder="e.g. css, tutorial, reference"
              value={form.tags}
              onChange={(e) => patch({ tags: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="f-desc">description (optional)</label>
            <textarea
              id="f-desc"
              placeholder="a short note about this bookmark…"
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            → save bookmark
          </button>
        </div>
      </div>
    </div>
  );
}
