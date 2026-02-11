import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock ThreeGlobe to avoid 3D/ESM issues during tests
vi.mock('./components/ThreeGlobe', () => ({
    default: () => React.createElement('div', { 'data-testid': 'three-globe-mock' }, 'ThreeGlobe Mock')
}));

// Also mock absolute import if used
vi.mock('@/components/ThreeGlobe', () => ({
    default: () => React.createElement('div', { 'data-testid': 'three-globe-mock' }, 'ThreeGlobe Mock')
}));

// Determine relative path from Hero/Home to ThreeGlobe if needed, but module mock is usually sufficient if path matches.
// Trying to cover common paths.
vi.mock('../components/ThreeGlobe', () => ({
    default: () => React.createElement('div', { 'data-testid': 'three-globe-mock' }, 'ThreeGlobe Mock')
}));

// Mock react-three-fiber and drei if they cause issues
vi.mock('@react-three/fiber', () => ({
    Canvas: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'canvas-mock' }, children),
    useFrame: vi.fn(),
    useThree: () => ({ camera: { position: { x: 0, y: 0, z: 0 } } }),
}));

vi.mock('@react-three/drei', () => ({
    OrbitControls: () => null,
    Stars: () => null,
    // Add others if needed
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: () => new Promise(() => { }),
        },
    }),
    initReactI18next: {
        type: '3rdParty',
        init: () => { },
    }
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
    Toaster: () => null,
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock window.scrollTo
window.scrollTo = vi.fn();
