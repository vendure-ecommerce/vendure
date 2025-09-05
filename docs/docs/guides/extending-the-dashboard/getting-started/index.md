---
title: 'Getting Started'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::warning
The `@vendure/dashboard` package is currently **RC.1** (release candiate) and can be used in production. 
There won't be any _major_ breaking API changes anymore. **The official release is targeted for the end of September 2025.**
:::

Our new React-based dashboard is currently in the release candidate phase, and you can try it out now!

The goal of the new dashboard:

- Improve the developer experience to make it significantly easier and faster to build customizations
- Reduce boilerplate (repetitive code) by using schema-driven UI generation
- Modern, AI-ready stack using React, Tailwind & Shadcn.
- Built-in type-safety with zero extra configuration

Because the dashboard is in the release candidate phase, not all planned features are available yet. However, enough has been implemented that
you can try it out and give us feedback.

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
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';
import { resolve, join } from 'path';

export default defineConfig({
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
from your build.

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
        "vite.*.*ts"
        // highlight-end
    ],
    "references": [
        {
            "path": "./tsconfig.dashboard.json"
        }
    ]
}
```

Now create a new `tsconfig.dashboard.json` to allow your IDE
to correctly resolve imports of GraphQL types & interpret JSX in your dashboard extensions:

```json title="tsconfig.dashboard.json"
{
    "compilerOptions": {
        "module": "nodenext",
        "moduleResolution": "nodenext",
        "jsx": "react-jsx",
        "paths": {
            // Import alias for the GraphQL types
            // Please adjust to the location that you have set in your `vite.config.mts`
            "@/gql": ["./src/gql/graphql.ts"],
            // This line allows TypeScript to properly resolve internal
            // Vendure Dashboard imports, which is necessary for
            // type safety in your dashboard extensions.
            // This path assumes a root-level tsconfig.json file.
            // You may need to adjust it if your project structure is different.
            "@/vdb/*": ["./node_modules/@vendure/dashboard/src/lib/*"]
        }
    },
    "include": ["src/plugins/**/dashboard/*", "src/gql/**/*.ts"]
}
```

## Running the Dashboard

Now you can run the dashboard in development mode with:

```bash
npx vite
```

To stop the running dashboard, type `q` and hit enter.

## What's Next?

Now that you have the dashboard up and running, you can start extending it:

- [Extending the Dashboard](/guides/extending-the-dashboard/extending-overview/) - Core concepts and best practices
- [Navigation](/guides/extending-the-dashboard/navigation/) - Add custom navigation sections and menu items
- [Page Blocks](/guides/extending-the-dashboard/page-blocks/) - Add custom blocks to existing pages
- [Action Bar Items](/guides/extending-the-dashboard/action-bar-items/) - Add custom buttons to page action bars
- [Tech Stack](/guides/extending-the-dashboard/tech-stack/) - Learn about the technologies used in the dashboard
- [Dashboard Theming](/guides/extending-the-dashboard/theming) - Customize the look and feel of the dashboard
- [CMS Tutorial](/guides/extending-the-dashboard/cms-tutorial/) - Complete tutorial showing how to build a CMS plugin with custom pages and forms

## Still to come

We hope this gives you a taste of what is possible with the new dashboard.

We're still working to bring feature-parity with the existing Admin UI - so support for things like:

- history timeline components
- translations of the dashboard itself

The final release (expected Q3 2025) will also include much more extensive documentation & guides.
