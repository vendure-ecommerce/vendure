import { vendureDashboardPlugin } from '@vendure/dashboard/plugin';
import path from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('./dev-config.ts'),
            adminUiConfig: { apiHost: 'http://localhost', apiPort: 3000 },
            gqlTadaOutputPath: path.resolve(__dirname, './graphql/'),
        }) as any,
    ],
});
