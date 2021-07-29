---
title: "Deployment"
showtoc: true
---

# Deploying a Vendure Application

A Vendure application is essentially a Node.js application, and can be deployed to any environment that supports Node.js.

The bare minimum requirements are:

* A server with Node.js installed
* A database server (if using MySQL/Postgres)

A typical pattern is to run the Vendure app on the server, e.g. at `http://localhost:3000` an then use [nginx as a reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) to direct requests from the Internet to the Vendure application.

Here is a good guide to setting up a production-ready server for an app such as Vendure: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04

## Security Considerations

For a production Vendure server, there are a few security-related points to consider when deploying:

* Set the [Superadmin credentials]({{< relref "auth-options" >}}#superadmincredentials) to something other than the default.
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

If you have customized the Admin UI with extensions, it can make sense to [compile your extensions ahead-of-time as part of the deployment process]({{< relref "/docs/plugins/extending-the-admin-ui" >}}#compiling-as-a-deployment-step).
