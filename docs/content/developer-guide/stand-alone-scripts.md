---
title: "Stand-alone CLI Scripts"
showtoc: true
---

# Stand-alone CLI Scripts

It is possible to create stand-alone scripts that can be run from the command-line by using the [bootstrapWorker function]({{< relref "bootstrap-worker" >}}). This can be useful for a variety of use-cases such as running cron jobs or importing data.

```TypeScript
// run-sync.ts

import { bootstrapWorker, Logger } from '@vendure/core';

import { config } from './vendure-config';
import { DataSyncPlugin, DataSyncService } from './plugins/data-sync';

const loggerCtx = 'DataSync script';

runDataSync()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

async function runDataSync() {
  // This will bootstrap an instance of the Vendure Worker
  const { app } = await bootstrapWorker({
    ...config,
    plugins: [
      ...config.plugins,
      DataSyncPlugin,
    ]
  });
  
  // Using `app.get()` we can grab an instance of _any_ provider defined in the
  // Vendure core as well as by our plugins.
  const dataSyncService = app.get(DataSyncService);
  
  Logger.info('Syncing data...', loggerCtx);
  
  try {
    const result = await dataSyncService.runSync();
    Logger.info(`Completed sync: ${result.count} items processed`, loggerCtx);
  } catch (e) {
    Logger.error(e.message, loggerCtx, e.stack);
    throw e;
  }
}
```

This script can then be run from the command-line:

```shell
yarn ts-node run-sync.ts
```
