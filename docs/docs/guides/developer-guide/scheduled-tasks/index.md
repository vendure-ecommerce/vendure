---
title: 'Scheduled Tasks'
showtoc: true
---

Scheduled tasks are a way of executing some code at pre-defined intervals. There are many examples of work that can be done using scheduled tasks,
such as:

- Generating a sitemap
- Synchronizing data between different systems
- Sending abandoned cart emails
- Cleaning up old data

Since Vendure v3.3, there is a built-in mechanism which allows you to define scheduled tasks in a convenient and powerful way.

:::info
All the information on page applies to Vendure v3.3+

For older versions, there is no built-in support for scheduled tasks, but you can
instead use a [stand-alone script](/guides/developer-guide/stand-alone-scripts/) triggered by a cron job.
:::

## Setting up the DefaultSchedulerPlugin

In your Vendure config, import and add the [DefaultSchedulerPlugin](/reference/typescript-api/scheduled-tasks/default-scheduler-plugin) to your
plugins array. If you created your project with a version newer than v3.3, this should already be configured.

```ts title="vendure-config.ts"
import { DefaultSchedulerPlugin, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
    // ...
    plugins: [DefaultSchedulerPlugin.init()],
};
```

When you first add this plugin to your config, you'll need to [generate a migration](/guides/developer-guide/migrations/) because the
plugin will make use of a new database table in order to guarantee only-once execution of tasks.

You can then start adding tasks. Vendure ships with a task that will clean up old sessions from the database.

:::note
The `cleanSessionsTask` task is actually configured by default from v3.3+, so normally you won't have to specify this
manually unless you wish to change any of the default configuration using the `.configure()` method.
:::

```ts title="vendure-config.ts"
import { cleanSessionsTask, DefaultSchedulerPlugin, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
    // ...
    schedulerOptions: {
        tasks: [
            // Use the task as is
            cleanSessionsTask,
            // or further configure the task
            cleanSessionsTask.configure({
                // Run the task every day at 3:00am
                // The default schedule is every day at 00:00am
                schedule: cron => cron.everyDayAt(3, 0),
                params: {
                    // How many sessions to process in each batch
                    // Default: 10_000
                    batchSize: 5_000,
                },
            }),
        ],
    },
    plugins: [DefaultSchedulerPlugin.init()],
};
```

## Creating a Scheduled Task

Let's imagine that you have created a `SitemapPlugin` that exposes a `SitemapService` which generates a sitemap for your store. You want to run this
task every night at midnight.

Inside the plugin, you would first define a new [ScheduledTask](/reference/typescript-api/scheduled-tasks/scheduled-task) instance:

```ts title="/plugins/sitemap/config/generate-sitemap-task.ts"
import { ScheduledTask, RequestContextService } from '@vendure/core';

import { SitemapService } from '../services/sitemap.service';

export const generateSitemapTask = new ScheduledTask({
    // Give your task a unique ID
    id: 'generate-sitemap',
    // A human-readable description of the task
    description: 'Generates a sitemap file',
    // Params can be used to further configure aspects of the
    // task. They get passed in to the `execute` function as the
    // second argument.
    // They can be later modified using the `.configure()` method on the instance
    params: {
        shopBaseUrl: 'https://www.myshop.com',
    },
    // Define a default schedule. This can be modified using the
    // `.configure()` method on the instance later.
    schedule: cron => cron.everyDayAt(0, 0),
    // This is the function that will be executed per the schedule.
    async execute({injector, params}) {
        // Using `app.get()` we can grab an instance of _any_ provider defined in the
        // Vendure core as well as by our plugins.
        const sitemapService = app.get(SitemapService);

        // For most service methods, we'll need to pass a RequestContext object.
        // We can use the RequestContextService to create one.
        const ctx = await app.get(RequestContextService).create({
            apiType: 'admin',
        });

        // Here's the actual work we want to perform.
        const result = await sitemapService.generateSitemap(ctx);

        // The return value from the `execute` function will be available
        // as the `lastResult` property when viewing tasks.
        return { result };
    },
});
```

## Using a task

Now that the task has been defined, we need to tell Vendure to use it.

To do so we need to add it to the [schedulerOptions.tasks](/reference/typescript-api/scheduled-tasks/scheduler-options#tasks) array.

### Adding directly in Vendure config

This can be done directly in your Vendure config file:

```ts title="vendure-config.ts"
import { cleanSessionsTask, DefaultSchedulerPlugin, VendureConfig } from '@vendure/core';

// highlight-next-line
import { SitemapPlugin, generateSitemapTask } from './plugins/sitemap';

export const config: VendureConfig = {
    // ...
    schedulerOptions: {
        tasks: [
            cleanSessionsTask,
            // highlight-start
            // Here's an example of overriding the
            // default params using the `configure()` method.
            generateSitemapTask.configure({
                params: {
                    shopBaseUrl: 'https://www.shoes.com'
                }
            }),
            // highlight-end
        ],
    },
    plugins: [
        // highlight-next-line
        SitemapPlugin,
        DefaultSchedulerPlugin.init()
    ],
};
```

### Adding in plugin configuration function

An alternative is that a plugin can automatically add the task to the config using the
plugin's [configuration function](/reference/typescript-api/plugin/vendure-plugin-metadata#configuration), which allows plugins to alter the Vendure config.

This allows a plugin to encapsulate any scheduled tasks so that the plugin consumer only needs to add the plugin, and not worry about
separately adding the task to the tasks array.

```ts title="src/plugins/sitemap/sitemap.plugin.ts"
import { VendurePlugin, PluginCommonModule, Type, ScheduledTask, VendureConfig } from '@vendure/core';

import { PLUGIN_OPTIONS } from './constants';
import { SitemapPluginOptions } from './types';
import { SitemapService } from './services/sitemap.service';
import { generateSitemapTask } from './config/generate-sitemap-task';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [SitemapService],
    configuration: (config: VendureConfig) => {
        // highlight-start
        // Add the task to the schedulerOptions.tasks array
        config.schedulerOptions.tasks.push(
            generateSitemapTask.configure({
                params: {
                    shopBaseUrl: SitemapPlugin.options.shopBaseUrl,
                }
            })
        );
        // highlight-end
        return config;
    },
})
export class SitemapPlugin {
    static options: SitemapPluginOptions;

    static init(options?: SitemapPluginOptions) {
        this.options = {
            shopBaseUrl: '',
            ...(options ?? {}),
        }
    }
}
```

This plugin can now be consumed like this:

```ts title="vendure-config.ts"
import { DefaultSchedulerPlugin, VendureConfig } from '@vendure/core';

// highlight-next-line
import { SitemapPlugin } from './plugins/sitemap';

export const config: VendureConfig = {
    // ...
    plugins: [
        // highlight-start
        SitemapPlugin.init({
            shopBaseUrl: 'https://www.shoes.com'
        }),
        // highlight-end
        DefaultSchedulerPlugin.init()
    ],
};
```

## How scheduled tasks work

The key problems solved by Vendure's task scheduler are:

- Ensuring that a task is only run a single time per scheduled execution, even when you have multiple instances of servers and workers running.
- Keeping scheduled task work away from the server instances, so that it does not affect API responsiveness.

The first problem is handled by the [SchedulerStrategy](/reference/typescript-api/scheduled-tasks/scheduler-strategy), which implements a locking
mechanism to ensure that the task is executed only once.

The second problem is handled by having tasks only executed on worker processes.

## Scheduled tasks vs job queue

There is some overlap between the use of a scheduled task and a [job queue job](/guides/developer-guide/worker-job-queue/). They both perform some
task on the worker, independent of requests coming in to the server.

The first difference is that jobs must be triggered explicitly, whereas scheduled tasks are triggered automatically according to the schedule.

Secondly, jobs are put in a _queue_ and executed once any prior pending jobs have been processed. On the other hand, scheduled tasks are executed
as soon as the schedule dictates.

It is possible to combine the two: namely, you can define a scheduled task which adds a job to the job queue. This is, for instance, how the
built-in [cleanSessionsTask](/reference/typescript-api/scheduled-tasks/clean-sessions-task) works. This pattern is something you should
consider if the scheduled task may take a significant amount of time or resources and you want to let the job queue manage that.

It also has the advantage of giving you a record of results for that work that has been put on the job queue, whereas scheduled tasks
only record that result of the last execution.


## A note on @nestjs/schedule

NestJS provides a [dedicated package for scheduling tasks](https://docs.nestjs.com/techniques/task-scheduling), called `@nestjs/schedule`.

You can also use this approach to schedule tasks, but you need to aware of a very important caveat:

:::warning
When using `@nestjs/schedule`, any method decorated with the `@Cron()` decorator will run
on _all_ instances of the application. This means it will run on the server _and_ on the
worker. If you are running multiple instances, then it will run on all instances.

This is the specific issue solved by the built-in ScheduledTask system described above.
Therefore it is not recommended to use the `@nestjs/schedule` package under normal
circumstances.
:::

You can, for instance, inject the [ProcessContext](/reference/typescript-api/common/process-context) into the service and check if the current instance is the worker or the server.

```ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SitemapService {
    constructor(private processContext: ProcessContext) {}

    @Cron('0 0 * * *')
    async generateSitemap() {
        // highlight-start
        if (this.processContext.isWorker) {
            // Only run on the worker
            await this.triggerGenerate();
        }
        // highlight-end
    }
}
```

The above code will run the `generateSitemap()` method every night at midnight, but only on the worker instance.

Again, if you have multiple worker instances running, it would run on all instances.
