---
name: nextjs-expert
description: Next.js best practices, architecture, and performance guidelines
---

# Next.js Best Practices

## Architecture & Components
- **Default to React Server Components (RSC):** Fetch data and render on the server by default to reduce client-side bundle size.
- **Client Components (`"use client"`):** Use exclusively for interactivity (hooks like `useState`, browser APIs, event listeners).
- **Component Tree Placement:** Push Client Components as far down the tree as possible (leaves, not roots) to maximize server rendering.
- **Interleaving:** Pass Server Components as `children` or props to Client Components to avoid converting the entire subtree into Client Components.

## Data Fetching & State
- **Server-Side Fetching:** Fetch data directly in Server Components; NEVER use `useEffect` for data fetching unless absolutely necessary (e.g., polling).
- **Parallel Fetching:** Use `Promise.all` for independent data fetching to avoid network waterfalls.
- **Mutations:** Prefer **Server Actions** for form submissions and mutations over traditional API routes (`/app/api`). *Exception in this repo:* there's no `app/api` and no Server Actions here — the frontend is a pure client of the separate Spring Boot backend (`apps/backend`). Use `fetch()` against `NEXT_PUBLIC_API_BASE_URL` (`src/utils/api.ts`) instead.
- **Caching & Revalidation:** Utilize the Next.js cache directive (`force-cache`, `no-store`) and route segment configs (`export const revalidate = 3600`) appropriately.

## Performance & Optimization
- **Images:** Always use the `next/image` component for automatic optimization, WebP/AVIF conversion, and responsive sizing. Add `priority` to LCP (Largest Contentful Paint) images.
- **Fonts:** Use `next/font` to automatically host fonts and prevent Layout Shift.
- **Links:** Use `next/link` for prefetching and client-side navigation.

## SEO & Metadata
- **Static Metadata:** Export a `metadata` object in `layout.tsx` or `page.tsx`.
- **Dynamic Metadata:** Use `generateMetadata` for dynamic pages to boost SEO (e.g., dynamic OpenGraph tags).
