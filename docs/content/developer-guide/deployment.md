---
title: "Deployment"
showtoc: true
---

# Deploying a Vendure Application

A Vendure application is essentially a Node.js application, and can be deployed to any environment that supports Node.js.

The bare minimum requirements are:

* A server with Node.js installed
* A database server (if using MySQL/Postgres)

A typical pattern is to run the Vendure app on the server, e.g. at `http://localhost:3000` and then use [nginx as a reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) to direct requests from the Internet to the Vendure application.

Here is a good guide to setting up a production-ready server for an app such as Vendure: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04

## Database Timezone

Vendure internally treats all dates & times as UTC. However, you may sometimes run into issues where dates are offset by some fixed amount of hours. E.g. you place an order at 17:00, but it shows up in the Admin UI as being placed at 19:00. Typically, this is caused by the timezone of your database not being set to UTC.

You can check the timezone in **MySQL/MariaDB** by executing:

```SQL
SELECT TIMEDIFF(NOW(), UTC_TIMESTAMP);
```
and you should expect to see `00:00:00`.

In **Postgres**, you can execute:
```SQL
show timezone;
```
and you should expect to see `UTC` or `Etc/UTC`.


## Security Considerations

For a production Vendure server, there are a few security-related points to consider when deploying:

* Set the [Superadmin credentials]({{< relref "auth-options" >}}#superadmincredentials) to something other than the default.
* Disable introspection in the [ApiOptions]({{< relref "api-options" >}}#introspection) (this option is available in v1.5+).
* Consider taking steps to harden your GraphQL APIs against DOS attacks. Use the [ApiOptions]({{< relref "api-options" >}}) to set up appropriate Express middleware for things like [request timeouts](https://github.com/expressjs/express/issues/3330) and [rate limits](https://www.npmjs.com/package/express-rate-limit). A tool such as [graphql-query-complexity](https://github.com/slicknode/graphql-query-complexity) can be used to mitigate resource-intensive GraphQL queries. 
* You may wish to restrict the Admin API to only be accessed from trusted IPs. This could be achieved for instance by configuring an nginx reverse proxy that sits in front of the Vendure server.
* By default, Vendure uses auto-increment integer IDs as entity primary keys. While easier to work with in development, sequential primary keys can leak information such as the number of orders or customers in the system. For this reason you should consider using the [UuidIdStrategy]({{< relref "entity-id-strategy" >}}#uuididstrategy) for production.
  ```TypeScript
  import { UuidIdStrategy, VendureConfig } from '@vendure/core';
  
  export const config: VendureConfig = {
    entityIdStrategy: new UuidIdStrategy(),
    // ...
  }
  ```
* Consider using [helmet](https://github.com/helmetjs/helmet) as middleware (add to the `apiOptions.middleware` array) to handle security-related headers. 

## Serverless / multi-instance deployments

Vendure supports running in a serverless or multi-instance (horizontally scaled) environment. The key consideration in configuring Vendure for this scenario is to ensure that any persistent state is managed externally from the Node process, and is shared by all instances. Namely:

* The JobQueue should be stored externally using the [DefaultJobQueuePlugin]({{< relref "default-job-queue-plugin" >}}) (which stores jobs in the database) or the [BullMQJobQueuePlugin]({{< relref "bull-mqjob-queue-plugin" >}}) (which stores jobs in Redis), or some other custom JobQueueStrategy.
* A custom [SessionCacheStrategy]({{< relref "session-cache-strategy" >}}) must be used which stores the session cache externally (such as in the database or Redis), since the default strategy stores the cache in-memory and will cause inconsistencies in multi-instance setups.
* When using cookies to manage sessions, make sure all instances are using the _same_ cookie secret:
    ```TypeScript
    const config: VendureConfig = {
      authOptions: {
        cookieOptions: {
          secret: 'some-secret'
        }
      }
    }
    ```
* Channel and Zone data gets cached in-memory as this data is used in virtually every request. The cache time-to-live defaults to 30 seconds, which is probably fine for most cases, but it can be configured in the [EntityOptions]({{< relref "entity-options" >}}#channelcachettl).

## Health/Readiness Checks

If you wish to deploy with Kubernetes or some similar system, you can make use of the health check endpoints. 

### Server

This is a regular REST route (note: _not_ GraphQL), available at `/health`.

```text 
REQUEST: GET http://localhost:3000/health
```
 
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

Health checks are built on the [Nestjs Terminus module](https://docs.nestjs.com/recipes/terminus). You can also add your own health checks by creating plugins that make use of the [HealthCheckRegistryService]({{< relref "health-check-registry-service" >}}).

### Worker

Although the worker is not designed as an HTTP server, it contains a minimal HTTP server specifically to support HTTP health checks. To enable this, you need to call the `startHealthCheckServer()` method after bootstrapping the worker:

```TypeScript
bootstrapWorker(config)
  .then(worker => worker.startJobQueue())
  .then(worker => worker.startHealthCheckServer({ port: 3020 }))
  .catch(err => {
    console.log(err);
  });
```
This will make the `/health` endpoint available. When the worker instance is running, it will return the following:

```text 
REQUEST: GET http://localhost:3020/health
```

```json
{
  "status": "ok"
}
```
{{< alert >}}
**Note:** there is also an _internal_ health check mechanism for the worker, which does not uses HTTP. This is used by the server's own health check to verify whether at least one worker is running. It works by adding a `check-worker-health` job to the JobQueue and checking that it got processed.
{{< /alert >}}

## Admin UI

If you have customized the Admin UI with extensions, you should [compile your extensions ahead-of-time as part of the deployment process]({{< relref "/docs/plugins/extending-the-admin-ui" >}}#compiling-as-a-deployment-step).

### Deploying a stand-alone Admin UI

Usually, the Admin UI is served from the Vendure server via the AdminUiPlugin. However, you may wish to deploy the Admin UI app elsewhere. Since it is just a static Angular app, it can be deployed to any static hosting service such as Vercel or Netlify.

Here's an example script that can be run as part of your host's `build` command, which will generate a stand-alone app bundle and configure it to point to your remote server API.

This example is for Vercel, and assumes:

* A `BASE_HREF` environment variable to be set to `/`
* A public (output) directory set to `build/dist`
* A build command set to `npm run build` or `yarn build`
* A package.json like this:
    ```json
    {
      "name": "standalone-admin-ui",
      "version": "0.1.0",
      "private": true,
      "scripts": {
        "build": "ts-node compile.ts"
      },
      "devDependencies": {
        "@vendure/ui-devkit": "^1.4.5",
        "ts-node": "^10.2.1",
        "typescript": "~4.3.5"
      }
    }
    ```

```TypeScript
// compile.ts
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import { DEFAULT_BASE_HREF } from '@vendure/ui-devkit/compiler/constants';
import path from 'path';
import { promises as fs } from 'fs';

/**
 * Compiles the Admin UI. If the BASE_HREF is defined, use that. 
 * Otherwise, go back to the default admin route.
 */
compileUiExtensions({
  outputPath: path.join(__dirname, 'build'),
  baseHref: process.env.BASE_HREF ?? DEFAULT_BASE_HREF,
  extensions: [
      /* any UI extensions would go here, or leave empty */
  ],
})
  .compile?.()
  .then(() => {
    // If building for Vercel deployment, replace the config to make 
    // api calls to api.example.com instead of localhost.
    if (process.env.VERCEL) {
      console.log('Overwriting the vendure-ui-config.json for Vercel deployment.');
      return fs.writeFile(
        path.join(__dirname, 'build', 'dist', 'vendure-ui-config.json'),
        JSON.stringify({
          apiHost: 'https://api.example.com',
          apiPort: '443',
          adminApiPath: 'admin-api',
          tokenMethod: 'cookie',
          defaultLanguage: 'en',
          availableLanguages: ['en', 'de'],
          hideVendureBranding: false,
          hideVersion: false,
        }),
      );
    }
  })
  .then(() => {
    process.exit(0);
  });
```


## Docker & Kubernetes

For a production ready Vendure server running on Kubernetes you can use the following Dockerfile and Kubernetes configuration. 

### Docker

Assuming a project which has been scaffolded using `@vendure/create`, create a 
Dockerfile in the root directory that looks like this:

```Dockerfile
FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN yarn install --production
RUN yarn build
```

Build your Docker container using `docker build -t vendure-shop:latest .`

### Kubernetes Deployment

This deployment starts the shop container we created above as both worker and server.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vendure-shop
spec:
  selector:
    matchLabels:
      app: vendure-shop
  replicas: 1
  template:
    metadata:
      labels:
        app: vendure-shop
    spec:
      containers:
        - name: server
          image: vendure-shop:latest
          command:
            - node
          args:
            - "dist/index.js"
          env:
          # your env config here
          ports:
            - containerPort: 3000

        - name: worker
          image: vendure-shop:latest
          imagePullPolicy: Always
          command:
            - node
          args:
            - "dist/index-worker.js"
          env:
          # your env config here
          ports:
            - containerPort: 3000
```
