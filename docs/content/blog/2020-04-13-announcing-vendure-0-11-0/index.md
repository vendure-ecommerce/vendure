---
title: "Announcing Vendure v0.11.0"
date: 2020-04-13T12:00:00
draft: false
author: "Michael Bromley"
images: 
    - "/blog/2020/04/announcing-vendure-v0.11.0/vendure-0.11.0-banner-01.jpg"
---

We're very excited to announce the release of version 0.11.0 of Vendure! This release includes a complete re-write of the Vendure job queue system, upgrades the underlying Nest framework to v7, and much more.

{{< figure src="./vendure-0.11.0-banner-01.jpg" >}}

## New Job Queue

A job queue allows you to defer certain tasks to be run later, outside the request-response cycle. One example is updating the search index - you don't want the Admin UI to hang while you wait for 10,000 products to be re-indexed. A better way is to add the "reindex" task to a queue, and return the response immediately.

Prior versions of Vendure used a queue-like mechanism that ran purely in-memory and was severely limited.

Vendure v0.11.0 introduces a powerful new job queue which allows multiple queues to be defined, each with their own concurrency controls and the ability to retry tasks in the case of failure.

The job queue is backed by a [configurble storage strategy]({{< relref "job-queue-strategy" >}}) which allows you to persist your jobs using the storage technology of your choice: relational database, Redis, or anything else. This means that even if your Vendure server stops for any reason, any **pending jobs will still be processed as soon as the server starts up again**.

{{< figure src="./job-queue.jpg" caption="The new job queue UI" >}}

One side-benefit of this new job queue system is that, assuming a shared storage strategy is used (e.g. the [SqlJobQueueStrategy]({{< relref "sql-job-queue-strategy" >}})), this will allow multiple instances of Vendure to share a single job queue. This is a key part of an on-going effort to adapt Vendure for cloud / multi-instance deployments by making the server as stateless as possible.

{{% alert "warning" %}}
**Note:** If you are upgrading an existing Vendure project, by default the built-in [InMemoryJobQueueStrategy]({{< relref "in-memory-job-queue-strategy" >}}) will be used. You'll probably want to replace this with a persistent storage strategy by adding the [DefaultJobQueuePlugin]({{< relref "default-job-queue-plugin" >}}) to your VendureConfig.
{{% /alert %}}

### 📖 See our new documentation: [The Vendure Job Queue]({{< relref "/docs/developer-guide/job-queue" >}})

## Nestjs v7

Vendure is built on top of the [Nest framework](https://nestjs.com/), which recently [released a new major version 7](https://trilon.io/blog/announcing-nestjs-7-whats-new). This Vendure release updates the underlying Nest dependency to v7, allowing Vendure developers to take advantage of the latest Nest features and bugfixes.

{{% alert "warning" %}}
**Note:** If your Vendure project makes use of Nest APIs as part of your plugins (e.g. if you have custom GraphQL resolvers), you'll need to consult the [Nest migration guide](https://docs.nestjs.com/migration-guide) as part of the update process as there are a few small changes.
{{% /alert %}}

## Other notable improvements

* Assets can now be deleted via the Admin UI & GraphQL Admin API.
* Several bug fixes relating to using languages other than English as the server default.
* The Vendure core and all packages have been updated to [TypeScript 3.8.5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html). 
* The `@vendure/admin-ui` package has been upgraded to Angular v9.1.0. If you are building custom Admin UI extensions, you should see some good performance improvements.

### 📃 All changes in the [Vendure 0.11.0 Changelog](https://github.com/vendure-ecommerce/vendure/blob/e97cb93282f77fe91634fc8a2177d23fe44cb628/CHANGELOG.md#0110-2020-04-13)
