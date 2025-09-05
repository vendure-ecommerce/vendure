---
title: 'Deployment'
---

The Vendure Dashboard offers flexible deployment options. You can either serve it directly through your Vendure Server using the `DashboardPlugin`, or host it independently as a static site.

## Deployment Options

### Option 1: Serve with DashboardPlugin

The `DashboardPlugin` integrates seamlessly with your Vendure Server by:

- Serving the React dashboard as static files
- Handling routing for the dashboard UI
- Providing a unified deployment experience

### Option 2: Standalone Hosting

The Vendure Dashboard can be hosted independently as a static site, since the build produces standard web assets (index.html, CSS, and JS files). This approach offers maximum flexibility for deployment on any static hosting service.

## Serving with DashboardPlugin

To configure the DashboardPlugin, follow these steps:

### 1. Configure Vite Base Path

Update your `vite.config.mts` to set the base path where the dashboard will be served:

```typescript title="vite.config.mts"
import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import path from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
    // highlight-start
    base: '/dashboard/',
    // highlight-end
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('./src/vendure-config.ts'),
            api: {
                host: 'http://localhost',
                port: 3000,
            },
            gqlOutputPath: path.resolve(__dirname, './src/gql/'),
        }),
    ],
});
```

### 2. Add DashboardPlugin to Vendure Config

:::warning Angular Admin UI compatibilityMode
If you want to use the Admin UI and the Dashboard together please change the [compatibilityMode](/reference/core-plugins/admin-ui-plugin/admin-ui-plugin-options#compatibilitymode) to true.
:::


Add the DashboardPlugin to your `vendure-config.ts`:

```typescript title="src/vendure-config.ts"
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import path from 'path';

export const config: VendureConfig = {
    // ... other config
    plugins: [
        // ... other plugins
        DashboardPlugin.init({
            // highlight-start
            // Important: This must match the base path from vite.config.mts (without slashes)
            route: 'dashboard',
            // highlight-end
            // Path to the Vite build output directory
            appDir: path.join(__dirname, './dist'),
        }),
    ],
};
```

## Building for Production

Before deploying your Vendure application, build the dashboard:

```bash
npx vite build
```

This command creates optimized production files in the `dist` directory that the DashboardPlugin will serve.

## Accessing the Dashboard

Once configured and built, your dashboard will be accessible at:

```
http://your-server-url/dashboard/
```

## Configuration Options

### DashboardPlugin Options

| Option   | Type     | Description                                                                   |
| -------- | -------- | ----------------------------------------------------------------------------- |
| `route`  | `string` | The URL path where the dashboard will be served (must match Vite's base path) |
| `appDir` | `string` | Path to the directory containing the built dashboard files                    |

## Best Practices

1. **Consistent Paths**: Always ensure the `route` in DashboardPlugin matches the `base` in your Vite config
2. **Build Before Deploy**: Add the Vite build step to your deployment pipeline
3. **Production Builds**: Use `npx vite build` for optimized production builds

## Example Deployment Script

```json title="package.json"
{
    "scripts": {
        "build": "npm run build:server && npm run build:dashboard",
        "build:server": "tsc",
        "build:dashboard": "vite build",
        "start:prod": "node ./dist/index.js"
    }
}
```

## Standalone Hosting

The dashboard can be hosted independently from your Vendure Server on any static hosting service (Netlify, Vercel, AWS S3, etc.).

### Configuration

When hosting standalone, you must configure the dashboard to connect to your Admin API endpoint:

```typescript title="vite.config.mts"
import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('./src/vendure-config.ts'),
            // highlight-start
            api: {
                host: process.env.VENDURE_API_HOST || 'https://api.mystore.com',
                port: parseInt(process.env.VENDURE_API_PORT || '443'),
            },
            // highlight-end
            gqlOutputPath: path.resolve(__dirname, './src/gql/'),
        }),
    ],
});
```

:::warning Build-Time Variables
Environment variables are resolved at **build time** and embedded as static strings in the final bundles. Ensure these variables are available during the build process, not just at runtime.
:::

### Build and Deploy

1. **Build the dashboard:**
   ```bash
   npx vite build
   ```

2. **Deploy the contents of the `dist` directory to your hosting service**

### CORS Configuration

When hosting the dashboard separately, configure CORS on your Vendure Server:

```typescript title="src/vendure-config.ts"
export const config: VendureConfig = {
    apiOptions: {
        cors: {
            origin: ['https://dashboard.mystore.com'],
            credentials: true,
        },
    },
    // ... other config
};
```

## Troubleshooting

### Dashboard Not Loading (DashboardPlugin)

- Verify the `route` matches the `base` path in Vite config
- Check that the build output exists in the specified `appDir`
- Ensure the DashboardPlugin is properly initialized in your plugins array

### 404 Errors on Dashboard Routes

- Confirm the base path includes trailing slashes where needed
- Verify the server is running and the plugin is loaded

### Connection Issues (Standalone)

- Verify the API host and port are correct
- Check CORS configuration on your Vendure Server
- Ensure environment variables were available during build
