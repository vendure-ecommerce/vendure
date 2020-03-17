---
title: "Architecture Overview"
weight: 0
showtoc: true
---

# Vendure Architecture Overview

Vendure is built with an internal architecture based on [NestJS modules](https://docs.nestjs.com/modules). It is not necessary to be familiar with all the internal modules, but a simplified overview can help to see how the major parts fit together.
Here is a simplified diagram of the Vendure application architecture:

{{< figure src="./vendure_architecture.png" >}} 

## Entry Points

As you can see in the diagram, there are two entry points into the application: [`bootstrap()`]({{< relref "bootstrap" >}}) and [`bootstrapWorker()`]({{< relref "bootstrap-worker" >}}), which start the main server and the [worker]({{< relref "vendure-worker" >}}) respectively.

## GraphQL APIs

There are 2 separate GraphQL APIs: shop and admin. 

* The **Shop API** is used by public-facing client applications (web shops, e-commerce apps, mobile apps etc.) to allow customers to find products and place orders. 
    
    [Shop API Documentation]({{< relref "/docs/graphql-api/shop" >}}).
* The **Admin API** is used by administrators to manage products, customers and orders. 

    [Admin API Documentation]({{< relref "/docs/graphql-api/admin" >}}).

## ServiceModule

This is an internal module which contains the bulk of the Vendure business logic for managing products, customers, orders, collections etc.

## Database

Vendure supports multiple databases. Currently it is tested with MySQL/MariaDB, PostgreSQL, SQLite and SQL.js. Since Vendure uses [TypeORM](https://typeorm.io/#/) to manage data access, it can theoretically also work with CockroachDB, Microsoft SQL Server and MongoDB, though these are as yet untested.

## Custom Business Logic (Plugins)

Not shown on the diagram (for the sake of simplicity) are plugins. Plugins are the mechanism by which you extend Vendure with your own business logic and functionality. See [the Plugins docs]({{< relref "/docs/plugins" >}})
