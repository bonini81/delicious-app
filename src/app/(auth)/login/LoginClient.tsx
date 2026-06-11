"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export default function LoginClient() {
  const router = useRouter();
  const { isAuthed, login } = useAuth();
  const { toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthed()) {
      router.replace("/bookmarks");
    }
  }, [isAuthed, router]);

  function handleSubmit() {
    const ok = login(username.trim(), password);
    if (ok) {
      router.replace("/bookmarks");
    } else {
      setError(true);
    }
  }

  function handleUserKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") passwordRef.current?.focus();
  }

  function handlePassKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="login-screen">
      <div className="login-theme-toggle">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          ◐
        </button>
      </div>

      <div className="login-box">
        <div className="logo">
          bkmrk<em>.</em>
        </div>
        <div className="login-sub">{"// private bookmark manager"}</div>

        <div className="login-fields">
          <div className="field">
            <label htmlFor="l-user">username</label>
            <input
              id="l-user"
              type="text"
              placeholder="enter username"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              onKeyDown={handleUserKeyDown}
            />
          </div>

          <div className="field">
            <label htmlFor="l-pass">password</label>
            <input
              id="l-pass"
              type="password"
              placeholder="enter password"
              autoComplete="current-password"
              ref={passwordRef}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              onKeyDown={handlePassKeyDown}
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              {"// invalid credentials — try again"}
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "4px" }}
            onClick={handleSubmit}
          >
            → access bookmarks
          </button>
        </div>

        <div className="login-hint">
          {"// default credentials:"} <strong>admin</strong> /{" "}
          <strong>bookmarks</strong>
        </div>
      </div>
    </div>
  );
}
