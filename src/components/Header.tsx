"use client";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddBookmark: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export default function Header({
  search,
  onSearchChange,
  onAddBookmark,
  onToggleTheme,
  onLogout,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-logo">
        bkmrk<em>.</em>
      </div>
      <div className="header-sep" />

      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">
          ○
        </span>
        <input
          type="text"
          placeholder="search title, url, tags…"
          autoComplete="off"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search bookmarks"
        />
      </div>

      <div className="header-gap" />

      <div className="header-right">
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          ◐
        </button>

        <button className="btn-add-bm" onClick={onAddBookmark}>
          + add bookmark
        </button>

        <button
          className="icon-btn"
          onClick={onLogout}
          aria-label="Sign out"
          title="Sign out"
          style={{ fontSize: "11px" }}
        >
          ⏻
        </button>
      </div>
    </header>
  );
}
