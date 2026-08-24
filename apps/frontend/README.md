# OceanLK Holdings - Corporate Website 🌊

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.1.1-FF0055.svg)](https://www.framer.com/motion/)

A premium, interactive corporate website for Ocean Ceylon Holdings showcasing their diverse portfolio of subsidiaries across technology, energy, leisure, marine, and capital sectors.

Migrated from a Vite SPA to Next.js 16 (App Router); see `docs/migration/` for the full plan and rationale.

## ✨ Features

- **🎨 Modern Glassmorphic Design** - Premium UI with smooth glassmorphism effects and fluid animations
- **📱 Fully Responsive** - Seamless experience across desktop, tablet, and mobile devices
- **🎬 Dynamic Image Carousel** - Auto-advancing hero section with smooth fade transitions
- **🌀 Interactive 3D Visualizations** - Solar system-style portfolio section with Three.js
- **⚡ Server-Rendered** - Public pages fetch and render on the server (Next.js App Router, SSG/ISR per route); the admin console stays a client-rendered SPA
- **🎭 Smooth Animations** - Professional micro-interactions using Framer Motion
- **🧭 File-Based Routing** - Next.js App Router, with route groups for the public site vs. the admin console
- **🌍 Internationalized** - 13 languages via i18next, locale bundles lazy-loaded per visitor
- **♿ Accessible** - WCAG compliant with semantic HTML

## 🚀 Tech Stack

### Core
- **Next.js 16.3** - App Router, Turbopack, Server Components
- **React 19.2** - Modern UI library
- **TypeScript 5.9** - Type-safe development

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **next/font** - Self-hosted Saira Semi Condensed, no Google Fonts requests
- **Custom Design System** - Glassmorphic theme with consistent tokens

### Animation & 3D
- **Framer Motion 13.1** - Production-ready animation library
- **Three.js 0.185** - WebGL 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber

### Icons & i18n
- **Lucide React** - Icon library (a handful of brand/social icons live in `src/components/icons/BrandIcons.tsx` — lucide dropped them)
- **i18next / react-i18next** - 13-language support, cookie-based detection, lazy-loaded locale bundles

## 📁 Project Structure

```
apps/frontend/
├── app/                      # Routes (Next.js App Router — file-based)
│   ├── (site)/               # Public marketing site route group
│   │   ├── page.tsx          # /
│   │   ├── companies/        # /companies, /companies/[id]
│   │   ├── corporate/        # /corporate/profile, /corporate/leadership
│   │   ├── careers/          # culture, opportunities, talent-pool
│   │   ├── news/              # blogs, articles, media (+ [id] detail routes)
│   │   └── contact/
│   ├── admin/                 # Admin console
│   │   ├── page.tsx          # /admin — login, no auth gate
│   │   └── (protected)/      # everything behind AuthGate
│   ├── health/route.ts       # Health check endpoint
│   ├── sitemap.ts, robots.ts
│   └── layout.tsx             # Root layout — fonts, i18n provider, globals.css
├── src/
│   ├── views/                 # Page-level components rendered by app/**/page.tsx
│   │   ├── Home.tsx, Contact.tsx
│   │   └── companies/, corporate/, careers/, news/, admin/
│   ├── components/            # Reusable UI components
│   │   ├── Hero.tsx          # Dynamic carousel hero section
│   │   ├── Navbar.tsx        # Navigation with dropdowns
│   │   ├── AuthGate.tsx      # Admin route auth gate
│   │   └── icons/             # Brand icons lucide-react no longer ships
│   ├── layouts/                # MainLayout, AdminLayout
│   ├── data/                   # Mock/static data (mockData.ts, etc.)
│   ├── i18n/                   # i18next config + per-language locale JSON
│   └── hooks/, services/, types/, utils/
├── public/                     # Static assets
├── next.config.ts               # Rewrites to the backend, images, security headers
├── tailwind.config.mjs
└── tsconfig.json
```

`app/` owns routing; `src/` owns everything else (components, data, i18n, etc.) — the `@/*` import alias resolves to `./src/*`.

## 🛠️ Installation

### Prerequisites
- Node.js 20.9+ (Next.js 16's hard minimum) and npm/yarn/pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/oceanlk-holdings.git
   cd oceanlk-holdings/apps/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # fill in NEXT_PUBLIC_API_BASE_URL, API_BASE_URL, NEXT_PUBLIC_SITE_URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```
   (The dev server is pinned to Vite's old port via `next dev -p 5173`, not Next's default 3000.)

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack, port 5173) |
| `npm run build` | Build for production (`next build`) |
| `npm run start` | Serve the production build (`next start -p 5173`) |
| `npm run lint` | Run ESLint (`next build` no longer lints as of Next 16) |
| `npm run typecheck` | `tsc --noEmit` |

## 📦 Build for Production

```bash
# Build the project
npm run build

# Serve the production build locally
npm run start
```

The build output goes to `.next/` (not `dist/` — that was the Vite-era directory).

## 🚀 Deployment

Deploys to **Vercel** — see `vercel.json` (both the one here and the one at the repo root). Framework preset: Next.js. Root Directory (repo-root Vercel project): `apps/frontend`.

```bash
# Vercel CLI, from apps/frontend/
vercel deploy        # preview
vercel deploy --prod # production
```

CI (`.github/workflows/deploy-frontend.yml`) lints, type-checks, and builds on every push/PR to `main`, then deploys via `amondnet/vercel-action`.

There is no Docker image or nginx container for the frontend anymore (`apps/frontend/Dockerfile` and `nginx.conf` were retired in the migration) — `docker-compose.yml` at the repo root now runs the backend and Redis only.

## 🎨 Design Philosophy

The website follows a **"Fluid & Weightless"** design philosophy:
- Glassmorphic UI elements with backdrop blur effects
- Smooth, physics-based animations
- Minimalist color palette with gradients
- Premium typography and spacing
- Interactive micro-animations on hover/click

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is proprietary and confidential.

## 🤝 Contributing

This is a private corporate website. For contributions or inquiries, please contact the development team.

## 📧 Contact

**Ocean Ceylon Holdings**
- Website: [oceanceylonholdings.com](https://oceanceylonholdings.com)
- Email: info@oceanceylon.com

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
