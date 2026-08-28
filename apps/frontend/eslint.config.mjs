import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import next from '@next/eslint-plugin-next'

export default tseslint.config(
  { ignores: ['.next/**', 'dist/**', 'node_modules/**', 'next-env.d.ts'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      '@next/next': next,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,

      // eslint-plugin-react-hooks@7's recommended set added these as errors
      // for React Compiler readiness. They surface pre-existing patterns
      // across the app unrelated to the Vite -> Next.js migration (this repo
      // ran hooks@4, which didn't have them). Downgraded to warnings rather
      // than mass-refactoring unrelated business logic in this migration.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/purity': 'warn',

      // Carried over from .eslintrc.cjs
      // argsIgnorePattern lets a deliberately-unused parameter (e.g. the error
      // in getDerivedStateFromError, kept for its type/readability) be named
      // instead of discarded as a bare `_`, without still tripping this rule.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
