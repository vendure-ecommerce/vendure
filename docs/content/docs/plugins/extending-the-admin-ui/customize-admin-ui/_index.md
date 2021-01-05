---
title: 'Customize Admin UI'
---

# Customize Admin UI

The Vendure Admin UI is customizable, allowing you to:

* set your brand name
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
        hideVendureBranding: false,
        hideVersion: false,
      }
    }),
  ],
};
```
