---
title: 'Admin UI Theming & Branding'
---

# Admin UI Theming & Branding

The Vendure Admin UI can be themed to your company's style and branding.
    
## AdminUiPlugin branding settings

The `AdminUiPlugin` allows you to specify your "brand" name, and allows you to control whether to display the Vendure name and version in the UI. Specifying a brand name will also set it as the title of the Admin UI in the browser.

```TypeScript
// vendure-config.ts
import path from 'path';
import { VendureConfig } from '@vendure/core';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';

export const config: VendureConfig = {
  // ...
  plugins: [
    AdminUiPlugin.init({
      adminUiConfig:{
        brand: 'My Store',
        hideVendureBranding: false,
        hideVersion: false,
      }
    }),
  ],
};
```

## Specifying custom logos

You can replace the Vendure logos and favicon with your own brand logo:

1. Install `@vendure/ui-devkit`
2. Configure the AdminUiPlugin to compile a custom build featuring your logos:
    ```TypeScript
    import path from 'path';
    import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
    import { VendureConfig } from '@vendure/core';
    import { compileUiExtensions, setBranding } from '@vendure/ui-devkit/compiler';
    
    export const config: VendureConfig = {
      // ...
      plugins: [
        AdminUiPlugin.init({
          app: compileUiExtensions({
            outputPath: path.join(__dirname, 'admin-ui'),
            extensions: [
              setBranding({
                // The small logo appears in the top left of the screen  
                smallLogoPath: path.join(__dirname, 'images/my-logo-sm.png'),
                // The large logo is used on the login page  
                largeLogoPath: path.join(__dirname, 'images/my-logo-lg.png'),
                faviconPath: path.join(__dirname, 'images/my-favicon.ico'),
              }),
            ],
          }),
        }),
      ],
    }
    ```

## Theming

Much of the visual styling of the Admin UI can be customized by providing your own themes in a Sass stylesheet. The Admin UI uses [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) to control colors and other styles. Here's a simple example which changes the color of links:

1. Install `@vendure/ui-devkit`
2. Create a custom stylesheet which overrides one or more of the CSS custom properties used in the Admin UI:
    ```css
    /* my-theme.scss */
    :root {
      --clr-link-active-color: hsl(110, 65%, 57%);
      --clr-link-color: hsl(110, 65%, 57%);
      --clr-link-hover-color: hsl(110, 65%, 57%);
      --clr-link-visited-color: hsl(110, 55%, 75%);
    }
    ```
   To get an idea of which custom properties are avaiable for theming, take a look at the source of the [Default theme](https://github.com/vendure-ecommerce/vendure/tree/master/packages/admin-ui/src/lib/static/styles/theme/default.scss) and the [Dark theme](https://github.com/vendure-ecommerce/vendure/tree/master/packages/admin-ui/src/lib/static/styles/theme/dark.scss)
3. Set this as a globalStyles extension:   
    ```TypeScript
    import path from 'path';
    import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
    import { VendureConfig } from '@vendure/core';
    import { compileUiExtensions, setBranding } from '@vendure/ui-devkit/compiler';
    
    export const config: VendureConfig = {
      // ...
      plugins: [
        AdminUiPlugin.init({
          app: compileUiExtensions({
            outputPath: path.join(__dirname, 'admin-ui'),
            extensions: [{
              globalStyles: path.join(__dirname, 'my-theme.scss')
            }],
          }),
        }),
      ],
    }
    ```
