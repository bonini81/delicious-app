"use client";

import { useState } from "react";
import type { Bookmark } from "@/lib/types";
import { formatRelativeDate, getDomain, getFaviconUrl } from "@/lib/utils";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export default function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
  onTagClick,
}: BookmarkCardProps) {
  const [faviconFailed, setFaviconFailed] = useState(false);
  const faviconUrl = getFaviconUrl(bookmark.url);

  return (
    <article className="bm-card">
      <div className="bm-actions">
        <button
          className="bm-btn"
          onClick={() => onEdit(bookmark.id)}
          title="Edit"
          aria-label={`Edit ${bookmark.title}`}
        >
          ✎
        </button>
        <button
          className="bm-btn del"
          onClick={() => onDelete(bookmark.id)}
          title="Delete"
          aria-label={`Delete ${bookmark.title}`}
        >
          ✕
        </button>
      </div>

      <div className="bm-top">
        <div className="bm-fav" aria-hidden="true">
          {faviconUrl && !faviconFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={faviconUrl}
              alt=""
              onError={() => setFaviconFailed(true)}
            />
          ) : (
            "◻"
          )}
        </div>
        <div className="bm-info">
          <a
            className="bm-title"
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {bookmark.title}
          </a>
          <span className="bm-url">{getDomain(bookmark.url)}</span>
        </div>
      </div>

      <div className="bm-bottom">
        {bookmark.category && (
          <>
            <span className="bm-cat-badge">{bookmark.category}</span>
            <span className="bm-dot" aria-hidden="true">
              ·
            </span>
          </>
        )}
        {bookmark.tags.length > 0 && (
          <div className="bm-tags">
            {bookmark.tags.map((tag) => (
              <button
                key={tag}
                className="bm-tag"
                onClick={() => onTagClick(tag)}
                aria-label={`Filter by tag ${tag}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
        <span className="bm-date">{formatRelativeDate(bookmark.date)}</span>
      </div>

      {bookmark.description && (
        <p className="bm-desc">{bookmark.description}</p>
      )}
    </article>
  );
}
