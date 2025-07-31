# Dashboard Plugin

This plugin serves the static files of the Vendure Dashboard UI and provides the GraphQL extensions needed for the order metrics on the dashboard index page.

## Installation

```bash
yarn add @vendure/dashboard-plugin
```

or

```bash
npm install @vendure/dashboard-plugin
```

## Usage

### Basic usage - serving the Dashboard UI

```typescript
import { DashboardPlugin } from '@vendure/dashboard-plugin';

const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    DashboardPlugin.init({ route: 'dashboard' }),
  ],
};
```

The Dashboard UI will be served at the `/dashboard/` path.

### Using only the metrics API

If you are building a stand-alone version of the Dashboard UI app and don't need this plugin to serve the Dashboard UI, you can still use the `metricSummary` query by adding the `DashboardPlugin` to the `plugins` array without calling the `init()` method:

```typescript
import { DashboardPlugin } from '@vendure/dashboard-plugin';

const config: VendureConfig = {
  plugins: [
    DashboardPlugin, // <-- no call to .init()
  ],
  // ...
};
```

### Custom Dashboard UI build

You can also provide a custom build of the Dashboard UI:

```typescript
import { DashboardPlugin } from '@vendure/dashboard-plugin';

const config: VendureConfig = {
  plugins: [
    DashboardPlugin.init({ 
      route: 'dashboard',
      app: path.join(__dirname, 'custom-dashboard-build'),
    }),
  ],
};
```

## API

### DashboardPluginOptions

- `route: string` - The route at which the Dashboard UI will be served (default: `'dashboard'`)
- `app?: string` - Optional path to a custom build of the Dashboard UI