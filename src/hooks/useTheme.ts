"use client";

import { saveTheme } from "@/lib/storage";

export function useTheme() {
  function toggleTheme() {
    if (typeof window === "undefined") return;
    const current =
      (document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark") ?? "light";
    const next = current === "dark" ? "light" : "dark";
    saveTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return { toggleTheme };
}
