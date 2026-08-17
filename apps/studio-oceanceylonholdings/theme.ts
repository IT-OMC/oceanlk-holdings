import {buildTheme} from '@sanity/themer'

// White background in both light and dark mode, so the Studio always
// reads clean and consistent regardless of the editor's OS/browser
// color-scheme preference or the in-app appearance toggle.
export const theme = buildTheme({
  accent: '#0284c7', // matches the brand blue in components/StudioLogo.tsx
  text: '#1f2937',
  background: {light: '#ffffff', dark: '#ffffff'},
  contrast: 90,
})
