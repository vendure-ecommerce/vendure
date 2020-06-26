---
title: "Configuration"
showtoc: true
---

# Configuration

Every aspect of the Vendure server is configured via a single, central `VendureConfig` object. This object is passed into the [`bootstrap`]({{< relref "bootstrap" >}}) and [`bootstrapWorker`]({{< relref "bootstrap-worker" >}}) functions to start up the Vendure server and worker respectively.

The `VendureConfig` object is organised into sections, grouping related settings together. For example, [`VendureConfig.apiOptions`]({{< relref "api-options" >}}) contains all the config for the GraphQL APIs, whereas [`VendureConfig.authOptions`]({{< relref "auth-options" >}}) deals with authentication.

## Working with the VendureConfig object

Since the VendureConfig is just a JavaScript object, it can be managed and manipulated according to your needs. For example:

### Using environment variables

Environment variables can be used when you don't want to hard-code certain values which may change, e.g. depending on whether running locally, in staging or in production:

```TypeScript
export const config: VendureConfig = {
  apiOptions: {
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
  }
  // ...
};
```

They are also useful so that sensitive credentials do not need to be hard-coded and committed to source control:

```TypeScript
export const config: VendureConfig = {
  dbConnectionOptions: {
    type: 'postgres',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'vendure',
  },
  // ...
}
```

### Splitting config across files

If the config object grows too large, you can split it across several files. For example, the `plugins` array in a real-world project can easily grow quite big:

```TypeScript
// vendure-config-plugins.ts

export const plugins: VendureConfig['plugins'] = [
  CustomPlugin,
  AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, 'assets'),
      port: 5002,
  }),
  DefaultJobQueuePlugin,
  ElasticsearchPlugin.init({
      host: 'localhost',
      port: 9200,
  }),
  EmailPlugin.init({
    // ...lots of lines of config
  }),
];
```

```TypeScript
// vendure-config.ts

import { plugins } from 'vendure-config-plugins';

export const config: VendureConfig = {
  plugins,
  // ...
}
```

## Important Configuration Settings

In this guide we will take a look at those configuration options needed for getting the server up-and-running.

{{< alert "primary" >}}
A description of every available configuration option can be found in the [VendureConfig API documentation]({{< relref "vendure-config" >}}).
{{< /alert >}}

### Specifying API hostname & port etc

The [`VendureConfig.apiOptions`]({{< relref "api-options" >}}) object is used to set the hostname, port, as well as other API-related concerns. Express middleware and Apollo Server plugins may also be specified here.

Example:

```TypeScript
export const config: VendureConfig = {
  apiOptions: {
    hostname: 'localhost',
    port: 3000,
    adminApiPath: '/admin',
    shopApiPath: '/shop',
    middleware: [{
      // add some Express middleware to the Shop API route
      handler: timeout('5s'),
      route: 'shop',
    }]
  },
  // ...
}
```

### Connecting to the database

The database connection is configured with the `VendureConfig.dbConnectionOptions` object. This object is actually the [TypeORM configuration object](https://typeorm.io/#/connection-options) and is passed directly to TypeORM.

Example:

```TypeScript
export const config: VendureConfig = {
  dbConnectionOptions: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    synchronize: false,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'vendure',
    migrations: [path.join(__dirname, 'migrations/*.ts')],
  },
  // ...
}
```

### Configuring authentication

Authentication settings are configured with [`VendureConfig.authOptions`]({{< relref "auth-options" >}}). The most important setting here is whether the storefront client will use cookies or bearer tokens to manage user sessions. For more detail on this topic, see [the Managing Sessions guide]({{< relref "managing-sessions" >}}).

The username and default password of the superadmin user can also be specified here. In production, it is advisable to use environment variables for these settings.

Example:

```TypeScript
export const config: VendureConfig = {
  authOptions: {
    tokenMethod: 'cookie',
    sessionSecret: process.env.COOKIE_SESSION_SECRET,
    requireVerification: true,
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
  },
  // ...
}
```

### Connecting to the worker

The Vendure worker is configured with [`VendureConfig.workerOptions`]({{< relref "worker-options" >}}). The worker is a [Nestjs microservice](https://docs.nestjs.com/microservices/basics) which runs in another process (and can be located on another server or in another container) from the main server.

By default, the worker communication happens over TCP. If you want to run the worker in a separate container or physical server to the server, please see the [deployment guide]({{< relref "deployment" >}}#deploying-the-worker).

```TypeScript
export const config: VendureConfig = {
  workerOptions: {
    options: {
      host: 'localhost',
      port: 3020,
    },
  },
  // ...
}
```
