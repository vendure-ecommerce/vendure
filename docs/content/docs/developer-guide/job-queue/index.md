---
title: 'Job Queue'
showtoc: true
---

# The Vendure Job Queue

## What is a job queue?

Vendure uses a [job queue](https://en.wikipedia.org/wiki/Job_queue) to handle the processing of certain tasks which are typically too slow to run in the normal request-response cycle. A normal request-response looks like this:

{{< figure src="./job_queue_req_res.png" >}}

In the normal request-response, all intermediate tasks (looking up data in the database, performing business logic etc.) occur before the response can be returned. For most operations this is fine, since those intermediate tasks are very fast.

Some operations however will need to perform much longer-running tasks. For example, updating the search index on thousands of products could take up to a minute or more. In this case, we certainly don't want to delay the reponse until that processing has completed. That's where a job queue comes in:

{{< figure src="./job_queue_req_res_with_queue.png" >}}

## What does Vendure use the job queue for?

-   Re-building the search index
-   Updating the search index when changes are made to Products, ProductVariants, Assets etc.
-   Updating the contents of Collections
-   Sending transactional emails

## Job Queue persistence

When a job is added to the queue, that fact must be persisted to some kind of storage. In Vendure, the storage mechanism is defined by the [JobQueueStrategy]({{< relref "job-queue-strategy" >}}).

By default, Vendure uses an [in-memory store]({{< relref "in-memory-job-queue-strategy" >}}) of the contents of each queue. While this has the advantage of requiring no external dependencies, it is not suitable for production because when the server is stopped, the entire queue will be lost and any pending jobs will never be processed.

A better alternative is to use the [DefaultJobQueuePlugin]({{< relref "default-job-queue-plugin" >}}), which configures Vendure to use the [SqlJobQueueStrategy]({{< relref "sql-job-queue-strategy" >}}). This means that event if the Vendure server stops, pending jobs will be persisted and upon re-start, they will be processed.

It is also possible to implement your own JobQueueStrategy to enable other persistence mechanisms, e.g. Redis.

## Using Job Queues in a plugin

If you create a [Vendure plugin]({{< relref "/docs/plugins" >}}) which involves some long-running tasks, you can also make use of the job queue. See the [JobQueue plugin example]({{< relref "plugin-examples" >}}#using-the-jobqueueservice) for a detailed annotated example.

{{% alert "primary" %}}
Note: The [JobQueueService]({{< relref "job-queue-service" >}}) combines well with the [WorkerService]({{< relref "worker-service" >}}).

A real example of this can be seen in the [EmailPlugin source](https://github.com/vendure-ecommerce/vendure/blob/07e1958f1ad1766e6fd3dae80f526bb688c0288e/packages/email-plugin/src/plugin.ts#L201-L210)
{{% /alert %}}
