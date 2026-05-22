import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 👈 1. IMPORT TAILWIND V4 PLUGIN

export default defineConfig({
    plugins: [
        tailwindcss(), // 👈 2. JALANKAN PLUGIN TAILWIND DI SINI
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});