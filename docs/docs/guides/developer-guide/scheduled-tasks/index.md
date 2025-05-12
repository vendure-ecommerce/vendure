---
title: "Scheduled Tasks"
showtoc: true
---

Scheduled tasks are a way of executing some code at pre-defined intervals. There are many examples of work that can be done using scheduled tasks, 
such as:

- Generating a sitemap
- Synchronizing data between different systems
- Sending abandoned cart emails
- Cleaning up old data

In Vendure you can create scheduled tasks by defining a [standalone script](/guides/developer-guide/stand-alone-scripts/) which can then 
be executed via any scheduling mechanism you like, such as a cron job or similar mechanism provided by your hosting provider.

## Creating a Scheduled Task

Let's imagine that you have created a plugin that exposes a `SitemapService` which generates a sitemap for your store. You want to run this
task every night at midnight. 

First we need to create a standalone script which will run the task. This script will look something like this:

```ts title="scheduled-tasks.ts"
import { bootstrapWorker, Logger, RequestContextService } from '@vendure/core';
import { SitemapService } from './plugins/sitemap';

import { config } from './vendure-config';

if (require.main === module) {
    generateSitemap()
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function generateSitemap() {
    // This will bootstrap an instance of the Vendure Worker, providing
    // us access to all of the services defined in the Vendure core.
    // (but without the unnecessary overhead of the API layer).
    const { app } = await bootstrapWorker(config);

    // Using `app.get()` we can grab an instance of _any_ provider defined in the
    // Vendure core as well as by our plugins.
    const sitemapService = app.get(SitemapService);

    // For most service methods, we'll need to pass a RequestContext object.
    // We can use the RequestContextService to create one.
    const ctx = await app.get(RequestContextService).create({
        apiType: 'admin',
    });
    
    await sitemapService.generateSitemap(ctx);

    Logger.info(`Completed sitemap generation`);
}
```

### Schedule the task

Each hosting provider has its own way of scheduling tasks. A common way is to use a cron job. 
For example, to run the above script every night at midnight, you could add the following line to your crontab:

```bash
0 0 * * * node /path/to/scheduled-tasks.js
```

This will run the script `/path/to/scheduled-tasks.js` every night at midnight.

### Long-running tasks

What if the scheduled task does a significant amount of work that would take many minutes to complete? In this case
you should consider using the [job queue](/guides/developer-guide/worker-job-queue/#using-job-queues-in-a-plugin) to
execute the work on the worker.

Taking the above example, let's now imagine that the `SitemapService` exposes a `triggerGenerate()` method which
adds a new job to the job queue. The job queue will then execute the task in the background, allowing the scheduled
task to complete quickly.

```ts title="scheduled-tasks.ts"
import { bootstrapWorker, Logger, RequestContextService } from '@vendure/core';
import { SitemapService } from './plugins/sitemap';

import { config } from './vendure-config';

if (require.main === module) {
    generateSitemap()
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function generateSitemap() {
    const { app } = await bootstrapWorker(config);
    const sitemapService = app.get(SitemapService);
    const ctx = await app.get(RequestContextService).create({
        apiType: 'admin',
    });
    
    await sitemapService.triggerGenerate(ctx);

    Logger.info(`Sitemap generation triggered`);
}
```

## Using @nestjs/schedule

NestJS provides a [dedicated package for scheduling tasks](https://docs.nestjs.com/techniques/task-scheduling), called `@nestjs/schedule`. 

You can also use this approach to schedule tasks, but you need to aware of a very important caveat:

:::warning
When using `@nestjs/schedule`, any method decorated with the `@Cron()` decorator will run
on _all_ instances of the application. This means it will run on the server _and_ on the 
worker. If you are running multiple instances, then it will run on all instances.
:::

You can, for instance, inject the ProcessContext into the service and check if the current instance is the worker or the server.

```ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';


@Injectable()
export class SitemapService {
    constructor(private processContext: ProcessContext) {}

    @Cron('0 0 * * *')
    async generateSitemap() {
        if (this.processContext.isWorker) {
            // Only run on the worker
            await this.triggerGenerate();
        }
    }
}
```

The above code will run the `generateSitemap()` method every night at midnight, but only on the worker instance.

Again, if you have multiple worker instances running, it would run on all instances.
