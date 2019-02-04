---
title: "Configuration"
weight: 9
showtoc: false
---

# Vendure Configuration Docs

All configuration is done by way of the [`VendureConfig`]({{< ref "vendure-config" >}}) object which is passed to Vendure's `bootstrap()` function.

```TypeScript
bootstrap({
    authOptions: {
        sessionSecret: 'BD95F861369DCD684AA668A926E86F8B',
    },
    port: 3000,
    apiPath: 'api',
    // ...
});
```

This section contains a description of all available configuration options for Vendure.

{{% alert %}}
All documentation in this section is auto-generated from the TypeScript source of the Vendure server.
{{% /alert %}}
