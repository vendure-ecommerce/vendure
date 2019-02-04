---
title: "AdminUiPlugin"
---

# AdminUiPlugin

This plugin starts a static server for the Admin UI app, and proxies it via the `/admin/` path of the main Vendure server.

The Admin UI allows you to administer all aspects of your store, from inventory management to order tracking. It is the tool used by store administrators on a day-to-day basis for the management of the store.


```ts 
const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    new AdminUiPlugin({ port: 3002 }),
  ],
};
```
