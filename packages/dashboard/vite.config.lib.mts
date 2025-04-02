import { vendureDashboardPlugin } from './vite/vite-plugin-vendure-dashboard.js';
import path from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { lingui } from '@lingui/vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { configLoaderPlugin } from './vite/vite-plugin-config-loader.js';
import { adminApiSchemaPlugin } from './vite/vite-plugin-admin-api-schema.js';
import { dashboardMetadataPlugin } from './vite/vite-plugin-dashboard-metadata.js';
import { uiConfigPlugin } from './vite/vite-plugin-ui-config.js';
import { getNormalizedVendureConfigPath } from './vite/vite-plugin-vendure-dashboard.js';

const tempDir = path.join(import.meta.dirname, './.vendure-dashboard-temp');
const normalizedVendureConfigPath = getNormalizedVendureConfigPath(pathToFileURL('./sample-vendure-config.ts'));

/**
 * This config file is for building the dashboard library (the shared components, hooks etc).
 */
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/lib/index.ts'),
            formats: ['es'],
        },
        rollupOptions: {
            external: ['react', 'react/jsx-runtime', 'react-dom', 'lucide-react', '@lingui/react'],
        },
        outDir: path.resolve(__dirname, 'dist', 'lib'),
        sourcemap: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/lib'),
        },
    },
    plugins: [
        lingui(),
        react({
            babel: {
                plugins: ['@lingui/babel-plugin-lingui-macro'],
            },
        }),
        configLoaderPlugin({ vendureConfigPath: normalizedVendureConfigPath, tempDir }),
        adminApiSchemaPlugin(),
        dashboardMetadataPlugin({ rootDir: tempDir }),
        uiConfigPlugin({ adminUiConfig: {} }),
        dts({
            include: ['src/lib/**/*.ts', 'src/lib/**/*.tsx'],
        }),
    ],
});
