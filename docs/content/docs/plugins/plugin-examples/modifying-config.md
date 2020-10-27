---
title: "Modifying the VendureConfig"
showtoc: true
---

# Modifying the VendureConfig

The VendureConfig object defines all aspects of how a Vendure server works. A plugin may modify any part of it by defining a `configuration` function in the VendurePlugin metadata.

This example shows how to modify the VendureConfig, in this case by adding a custom field to allow product ratings.

```TypeScript
// my-plugin.ts
import { VendurePlugin } from '@vendure/core';

@VendurePlugin({
  configuration: config => {
    config.customFields.Product.push({
      name: 'rating',
      type: 'float',
      min: 0,
      max: 5,
    });
    return config;
  },
})
class ProductRatingPlugin {}
```
