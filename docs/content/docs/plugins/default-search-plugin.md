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
Note that the quality of the fulltext search capabilities varies depending on the underlying database being used. For example, the MySQL & Postgres implementations will typically yield better results than the SQLite implementation.
{{% /alert %}}
