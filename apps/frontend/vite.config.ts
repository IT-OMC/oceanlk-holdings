/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const config = {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        build: {
            // Production optimizations
            rollupOptions: {
                output: {
                    manualChunks: {
                        // Vendor chunks for better caching
                        'react-vendor': ['react', 'react-dom'],
                        'router': ['react-router-dom'],
                        'ui': ['lucide-react', 'framer-motion'],
                        '3d': ['three', '@react-three/fiber', '@react-three/drei'],
                        'maps': ['@react-google-maps/api', '@vis.gl/react-google-maps'],
                    },
                },
            },
            chunkSizeWarningLimit: 1000,
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true, // Remove console.logs in production
                    drop_debugger: true,
                },
            },
            sourcemap: false, // Disable sourcemaps in production for security
        },
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    secure: false,
                },
                '/uploads': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        test: {
            globals: true,
            environment: 'happy-dom',
            setupFiles: './src/setupTests.ts',
            server: {
                deps: {
                    inline: ['@asamuzakjp/css-color'],
                },
            },
        },
    };

    if (mode === 'test') {
        // Mock ThreeGlobe to avoid 3D dependencies issues
        config.resolve.alias['../components/ThreeGlobe'] = path.resolve(__dirname, './src/__mocks__/ThreeGlobeMock.tsx');
        config.resolve.alias['./components/ThreeGlobe'] = path.resolve(__dirname, './src/__mocks__/ThreeGlobeMock.tsx');
        config.resolve.alias['@/components/ThreeGlobe'] = path.resolve(__dirname, './src/__mocks__/ThreeGlobeMock.tsx');

        // Mock problematic ESM dependency
        config.resolve.alias['@asamuzakjp/css-color'] = path.resolve(__dirname, './src/__mocks__/css-color-mock.js');
    }

    return config;
})
