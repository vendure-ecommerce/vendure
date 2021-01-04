---
title: 'Customize Admin UI'
---

# Customize Admin UI

The Vendure Admin UI is customizable, allowing you to:

* set your brand name
* replace default favicon
* change default logos
* add you own stylesheet
* hide vendure branding
* hide admin ui version
    
## Example: Config code to customize admin ui

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
        faviconPath: path.join(__dirname, 'assets/favicon.ico'),
        smallLogoUrl: 'https://cdn.mystore.com/logo-small.png',
        bigLogoUrl: 'https://cdn.mystore.com/logo-big.png',
        styleUrl: 'https://cdn.mystore.com/my-store-style.css',
        hideVendureBranding: false,
        hideVersion: false,
      }
    }),
  ],
};
```
