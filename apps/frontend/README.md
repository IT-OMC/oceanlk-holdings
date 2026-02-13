# OceanLK Holdings - Corporate Website 🌊

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.18.0-FF0055.svg)](https://www.framer.com/motion/)

A premium, interactive corporate website for Ocean Ceylon Holdings showcasing their diverse portfolio of subsidiaries across technology, energy, leisure, marine, and capital sectors.

## ✨ Features

- **🎨 Modern Glassmorphic Design** - Premium UI with smooth glassmorphism effects and fluid animations
- **📱 Fully Responsive** - Seamless experience across desktop, tablet, and mobile devices
- **🎬 Dynamic Image Carousel** - Auto-advancing hero section with smooth fade transitions
- **🌀 Interactive 3D Visualizations** - Solar system-style portfolio section with Three.js
- **⚡ Lightning Fast** - Optimized performance with Vite and React 18
- **🎭 Smooth Animations** - Professional micro-interactions using Framer Motion
- **🧭 Multi-Page Navigation** - Complete routing system with React Router DOM
- **♿ Accessible** - WCAG compliant with semantic HTML

## 🚀 Tech Stack

### Core
- **React 18.2** - Modern UI library
- **TypeScript 5.2** - Type-safe development
- **Vite 5.0** - Next-generation frontend tooling

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Custom Design System** - Glassmorphic theme with consistent tokens

### Animation & 3D
- **Framer Motion 10.18** - Production-ready animation library
- **Three.js 0.165** - WebGL 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber

### Routing & Icons
- **React Router DOM 6.21** - Client-side routing
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
OCEANLK/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Hero.tsx        # Dynamic carousel hero section
│   │   ├── Navbar.tsx      # Navigation with dropdowns
│   │   ├── TopBar.tsx      # Corporate top bar
│   │   ├── Portfolio.tsx   # 3D solar system visualization
│   │   ├── Stats.tsx       # Animated statistics
│   │   └── Footer.tsx      # Footer section
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Corporate.tsx   # Corporate information
│   │   ├── Companies.tsx   # Subsidiaries overview
│   │   └── Contact.tsx     # Contact page
│   ├── data/               # Mock data & content
│   │   └── mockData.ts     # Centralized data structure
│   ├── App.tsx             # Main app component
│   ├── index.css           # Global styles
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/oceanlk-holdings.git
   cd oceanlk-holdings
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 📦 Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The optimized production files will be in the `dist/` directory.

## 🚀 Deployment

### Netlify
```bash
npm run build
# Drag and drop the dist folder to Netlify
```

### GitHub Pages
```bash
# Add to vite.config.ts: base: '/repo-name/'
npm run build
# Deploy dist folder to gh-pages branch
```

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

Built with ❤️ using React, TypeScript, and Tailwind CSS
