export interface Bookmark {
  id: string;
  url: string;
  title: string;
  category: string;
  tags: string[];
  description?: string;
  date: string; // ISO 8601
}

export interface AppState {
  bookmarks: Bookmark[];
  activeCategory: string | null;
  activeTags: string[];
  search: string;
  editingId: string | null;
  pendingDeleteId: string | null;
}
