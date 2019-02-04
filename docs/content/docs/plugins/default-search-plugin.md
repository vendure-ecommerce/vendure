---
title: "DefaultSearchPlugin"
---

# DefaultSearchPlugin

The DefaultSearchPlugin provides a full-text Product search based on the full-text searching capabilities of the underlying database.

```ts
const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    new DefaultSearchPlugin(),
  ],
};
```

{{% alert "warning" %}}
Note that the current implementation of the DefaultSearchPlugin is only implemented and tested against a MySQL/MariaDB database. In addition, the search result quality has not yet been optimized.
{{% /alert %}}
