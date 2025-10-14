---
title: 'Getting Started'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
From Vendure v3.5.0, the `@vendure/dashboard` package and configuration comes as standard with new projects that are started with
the `npx @vendure/create` command.

This guide serves mainly for those adding the Dashboard to existing project set up prior to v3.5.0.
:::

## Installation & Setup

:::note
This guide assumes an existing project based on the `@vendure/create` folder structure.
If you have a different setup (e.g. an Nx monorepo), you may need to adapt the instructions accordingly.
:::

First install the `@vendure/dashboard` package:

```bash
npm install @vendure/dashboard
```

Then create a `vite.config.mts` file in the root of your project (on the same level as your `package.json`) with the following content:

```ts title="vite.config.mts"
import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/dashboard',
    build: {
        outDir: join(__dirname, 'dist/dashboard'),
    },
    plugins: [
        vendureDashboardPlugin({
            // The vendureDashboardPlugin will scan your configuration in order
            // to find any plugins which have dashboard extensions, as well as
            // to introspect the GraphQL schema based on any API extensions
            // and custom fields that are configured.
            vendureConfigPath: pathToFileURL('./src/vendure-config.ts'),
            // Points to the location of your Vendure server.
            api: { host: 'http://localhost', port: 3000 },
            // When you start the Vite server, your Admin API schema will
            // be introspected and the types will be generated in this location.
            // These types can be used in your dashboard extensions to provide
            // type safety when writing queries and mutations.
            gqlOutputPath: './src/gql',
        }),
    ],
    resolve: {
        alias: {
            // This allows all plugins to reference a shared set of
            // GraphQL types.
            '@/gql': resolve(__dirname, './src/gql/graphql.ts'),
        },
    },
});
```

You should also add the following to your existing `tsconfig.json` file to exclude the dashboard extensions and Vite config
from your build, and reference a new `tsconfig.dashboard.json` that will have compiler settings for the Dashboard code.

```json title="tsconfig.json"
{
    // ... existing options
    "exclude": [
        "node_modules",
        "migration.ts",
        "src/plugins/**/ui/*",
        "admin-ui",
        // highlight-start
        "src/plugins/**/dashboard/*",
        "src/gql/*",
        "vite.*.*ts"
        // highlight-end
    ],
    // highlight-start
    "references": [
        {
            "path": "./tsconfig.dashboard.json"
        }
    ]
    // highlight-end
}
```

Now create a new `tsconfig.dashboard.json` to allow your IDE
to correctly resolve imports of GraphQL types & interpret JSX in your dashboard extensions:

```json title="tsconfig.dashboard.json"
{
    "compilerOptions": {
        "composite": true,
        "module": "nodenext",
        "moduleResolution": "nodenext",
        "jsx": "react-jsx",
        "paths": {
            // Import alias for the GraphQL types
            // Please adjust to the location that you have set in your `vite.config.mts`
            "@/gql": [
                "./src/gql/graphql.ts"
            ],
            // This line allows TypeScript to properly resolve internal
            // Vendure Dashboard imports, which is necessary for
            // type safety in your dashboard extensions.
            // This path assumes a root-level tsconfig.json file.
            // You may need to adjust it if your project structure is different.
            "@/vdb/*": [
                "./node_modules/@vendure/dashboard/src/lib/*"
            ]
        }
    },
    "include": [
        "src/plugins/**/dashboard/*",
        "src/gql/**/*.ts"
    ]
}
```

## The DashboardPlugin

In your `vendure-config.ts` file, you should also import and configure the [DashboardPlugin](/reference/core-plugins/dashboard-plugin/).

```ts title="src/vendure-config.ts"
import { DashboardPlugin } from '@vendure/dashboard/plugin';

const config: VendureConfig = {
    plugins: [
        // ... existing plugins
        // highlight-start  
        DashboardPlugin.init({
            // The route should correspond to the `base` setting
            // in the vite.config.mts file
            route: 'dashboard',
            // This appDir should correspond to the `build.outDir`
            // setting in the vite.config.mtx file
            appDir: './dist/dashboard',
        }),
        // highlight-end  
    ],
};
```

The `DashboardPlugin` adds the following features that enhance the use of the Dashboard:

- It exposes a set of queries which power the Insights page metrics.
- It registers SettingsStore entries that are used to store your personal display settings on the server side, which
  allow administrators to enjoy a consistent experience across browsers and devices.
- It serves the dashboard with a static server at the `/dashboard` route (by default), meaning you do not
  need to set up a separate web server.

## Running the Dashboard

Once the above is set up, you can run `npm run dev` to start your Vendure server, and then visit

```
http://localhost:3000/dashboard
```

which will display a developer placeholder until you start the Vite dev server using

```bash
npx vite
```

To stop the running dashboard, type `q` and hit enter.

:::warning Compatibility with the legacy Admin UI
If you still need to run the legacy Angular-based Admin UI in parallel with the Dashboard,
this is totally possible.

You just need to make sure to set the [compatibilityMode](/reference/core-plugins/admin-ui-plugin/admin-ui-plugin-options#compatibilitymode) setting in the
AdminUiPlugin's init options.

```ts
AdminUiPlugin.init({
  // ...
  // highlight-next-line  
  compatibilityMode: true,  
})
```
:::

