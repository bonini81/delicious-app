<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-context -->
## Project Context & Domain
- **App:** Personal bookmarking application (similar to delicious.com).
- **Domain:** Private user data requiring authentication. All routes should be protected except for the Login page.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Backend:** Express.js (REST API decoupling)
- **Database & Auth:** Firebase (Firestore & Firebase Authentication)
- **Hosting:** Firebase Hosting

## Coding Standards & Conventions
- **React/Next.js:** Default to Server Components. Only use `"use client"` at the top of the file when React hooks (`useState`, `useEffect`), context, or browser DOM APIs are strictly required.
- **TypeScript:** Use strict typing. Avoid using `any` or `@ts-ignore`. Prefer `interface` over `type`.
- **Accessibility (a11y):** This project uses `axe-core`. Ensure all new UI components are accessible, use semantic HTML, and include proper ARIA attributes.
- **Linting:** Follow the configured ESLint rules (including `@typescript-eslint/stylistic`). 

## File Structure Guidelines
- `app/`: Routing, pages, layouts, and route handlers.
- `components/`: Reusable, stateless UI components.
- `lib/`: Shared utilities, helpers, and business logic.
- `types/`: Global TypeScript definitions.

## Git & Commits
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- Keep PRs small and focused on a single responsibility.
<!-- END:project-context -->
