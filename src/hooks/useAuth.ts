"use client";

import { useRouter } from "next/navigation";

const SESSION_KEY = "bkmrk_s";
const CREDENTIALS = { username: "admin", password: "bookmarks" };

export function useAuth() {
  const router = useRouter();

  function isAuthed(): boolean {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) === "1";
  }

  function login(username: string, password: string): boolean {
    if (
      username === CREDENTIALS.username &&
      password === CREDENTIALS.password
    ) {
      sessionStorage.setItem(SESSION_KEY, "1");
      return true;
    }
    return false;
  }

  function logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    router.replace("/login");
  }

  return { isAuthed, login, logout };
}
