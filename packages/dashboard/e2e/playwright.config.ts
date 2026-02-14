import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VENDURE_PORT = 3050;
const VITE_PORT = 5174;

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? 'github' : 'html',
    globalSetup: './global-setup.ts',
    globalTeardown: './global-teardown.ts',
    use: {
        baseURL: `http://localhost:${VITE_PORT}`,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
        },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: path.join(__dirname, '.auth/admin.json'),
            },
            dependencies: ['setup'],
        },
    ],
    webServer: {
        command: `npx vite --port ${VITE_PORT}`,
        port: VITE_PORT,
        cwd: path.join(__dirname, '..'),
        reuseExistingServer: !process.env.CI,
        env: {
            VITE_ADMIN_API_PORT: String(VENDURE_PORT),
            VITE_ADMIN_API_HOST: 'http://localhost',
        },
        timeout: 120_000,
    },
});
