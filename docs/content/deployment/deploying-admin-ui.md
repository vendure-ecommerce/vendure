---
title: "Deploying the Admin UI"
showtoc: true
---

## Deploying the Admin UI

If you have customized the Admin UI with extensions, you should [compile your extensions ahead of time as part of the deployment process]({{< relref "/plugins/extending-the-admin-ui" >}}#compiling-as-a-deployment-step).

### Deploying a stand-alone Admin UI

Usually, the Admin UI is served from the Vendure server via the AdminUiPlugin. However, you may wish to deploy the Admin UI app elsewhere. Since it is just a static Angular app, it can be deployed to any static hosting service such as Vercel or Netlify.

#### Metrics

The AdminUiPlugin not only serves the Admin UI app, but also provides a `metricSummary` query which is used to display the order metrics on the dashboard. If you wish to deploy the Admin UI app stand-alone (not served by the AdminUiPlugin), but still want to display the metrics on the dashboard, you'll need to include the AdminUiPlugin in your server's plugins array, but do not call `init()`:

```TypeScript
import { AdminUiPlugin } from '\@vendure/admin-ui-plugin';

const config: VendureConfig = {
  plugins: [
    AdminUiPlugin, // <== include the plugin, but don't call init()
  ],
  // ...
};
```

#### Example Script

Here's an example script that can be run as part of your host's `build` command, which will generate a stand-alone app bundle and configure it to point to your remote server API.

This example is for Vercel, and assumes:

* A `BASE_HREF` environment variable to be set to `/`
* A public (output) directory set to `build/dist`
* A build command set to `npm run build` or `yarn build`
* A package.json like this:
    ```json
    {
      "name": "standalone-admin-ui",
      "version": "0.1.0",
      "private": true,
      "scripts": {
        "build": "ts-node compile.ts"
      },
      "devDependencies": {
        "@vendure/ui-devkit": "^1.4.5",
        "ts-node": "^10.2.1",
        "typescript": "~4.3.5"
      }
    }
    ```

```TypeScript
// compile.ts
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import { DEFAULT_BASE_HREF } from '@vendure/ui-devkit/compiler/constants';
import path from 'path';
import { promises as fs } from 'fs';

/**
 * Compiles the Admin UI. If the BASE_HREF is defined, use that. 
 * Otherwise, go back to the default admin route.
 */
compileUiExtensions({
  outputPath: path.join(__dirname, 'build'),
  baseHref: process.env.BASE_HREF ?? DEFAULT_BASE_HREF,
  extensions: [
      /* any UI extensions would go here, or leave empty */
  ],
})
  .compile?.()
  .then(() => {
    // If building for Vercel deployment, replace the config to make 
    // api calls to api.example.com instead of localhost.
    if (process.env.VERCEL) {
      console.log('Overwriting the vendure-ui-config.json for Vercel deployment.');
      return fs.writeFile(
        path.join(__dirname, 'build', 'dist', 'vendure-ui-config.json'),
        JSON.stringify({
          apiHost: 'https://api.example.com',
          apiPort: '443',
          adminApiPath: 'admin-api',
          tokenMethod: 'cookie',
          defaultLanguage: 'en',
          availableLanguages: ['en', 'de'],
          hideVendureBranding: false,
          hideVersion: false,
        }),
      );
    }
  })
  .then(() => {
    process.exit(0);
  });
```
