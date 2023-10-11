---
title: "Horizontal scaling"
showtoc: true
weight: 2
---

# Horizontal scaling

"Horizontal scaling" refers to increasing the performance capacity of your application by running multiple instances.

This type of scaling has two main advantages:

1. It can enable increased throughput (requests/second) by distributing the incoming requests between multiple instances.
2. It can increase resilience because if a single instance fails, the other instances will still be able to service requests.

As discussed in the [Server resource requirements guide](/guides/deployment/server-resource-requirements), horizontal scaling can be the most cost-effective way of deploying your Vendure server due to the single-threaded nature of Node.js.

In Vendure, both the server and the worker can be scaled horizontally. Scaling the server will increase the throughput of the GraphQL APIs, whereas scaling the worker can increase the speed with which the job queue is processed by allowing more jobs to be run in parallel.

## Multi-instance configuration

In order to run Vendure in a multi-instance configuration, there are some important configuration changes you'll need to make. The key consideration in configuring Vendure for this scenario is to ensure that any persistent state is managed externally from the Node process, and is shared by all instances. Namely:

* The JobQueue should be stored externally using the [DefaultJobQueuePlugin](/reference/typescript-api/job-queue/default-job-queue-plugin/) (which stores jobs in the database) or the [BullMQJobQueuePlugin](/reference/core-plugins/job-queue-plugin/bull-mqjob-queue-plugin) (which stores jobs in Redis), or some other custom JobQueueStrategy. **Note:** the BullMQJobQueuePlugin is much more efficient than the DefaultJobQueuePlugin, and is recommended for production applications.
* A custom [SessionCacheStrategy](/reference/typescript-api/auth/session-cache-strategy/) must be used which stores the session cache externally (such as in the database or Redis), since the default strategy stores the cache in-memory and will cause inconsistencies in multi-instance setups. [Example Redis-based SessionCacheStrategy](/reference/typescript-api/auth/session-cache-strategy/)
* When using cookies to manage sessions, make sure all instances are using the _same_ cookie secret:
    ```ts title="src/vendure-config.ts"
    const config: VendureConfig = {
      authOptions: {
        cookieOptions: {
          secret: 'some-secret'
        }
      }
    }
    ```
* Channel and Zone data gets cached in-memory as this data is used in virtually every request. The cache time-to-live defaults to 30 seconds, which is probably fine for most cases, but it can be configured in the [EntityOptions](/reference/typescript-api/configuration/entity-options/#channelcachettl).

## Using Docker or Kubernetes

One way of implementing horizontal scaling is to use Docker to wrap your Vendure server & worker in a container, which can then be run as multiple instances.

Some hosting providers allow you to provide a Docker image and will then run multiple instances of that image. Kubernetes can also be used to manage multiple instances
of a Docker image.

For a more complete guide, see the [Using Docker guide](/guides/deployment/using-docker).

## Using PM2

[PM2](https://pm2.keymetrics.io/) is a process manager which will spawn multiple instances of your server or worker, as well as re-starting any instances that crash. PM2 can be used on VPS hosts to manage multiple instances of Vendure without needing Docker or Kubernetes.

PM2 must be installed on your server:

```sh
npm install pm2@latest -g
```

Your processes can then be run in [cluster mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/) with the following command:

```sh
pm2 start ./dist/index.js -i 4
```

The above command will start a cluster of 4 instances. You can also instruct PM2 to use the maximum number of available CPUs with `-i max`.

Note that if you are using pm2 inside a Docker container, you should use the `pm2-runtime` command:

```dockerfile
# ... your existing Dockerfile config
RUN npm install pm2 -g

CMD ["pm2-runtime", "app.js", "-i", "max"]
```
