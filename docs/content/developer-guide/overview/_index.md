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

As you can see in the diagram, there are two entry points into the application: [`bootstrap()`]({{< relref "bootstrap" >}}) and [`bootstrapWorker()`]({{< relref "bootstrap-worker" >}}), which start the main server and the [worker]({{< relref "/developer-guide/vendure-worker" >}}) respectively. Communication between server and worker(s) is done via the [Job Queue]({{< relref "/developer-guide/job-queue" >}}).

## GraphQL APIs

There are 2 separate GraphQL APIs: shop and admin. 

* The **Shop API** is used by public-facing client applications (web shops, e-commerce apps, mobile apps etc.) to allow customers to find products and place orders. 
    
    [Shop API Documentation]({{< relref "/graphql-api/shop" >}}).
* The **Admin API** is used by administrators to manage products, customers and orders. 

    [Admin API Documentation]({{< relref "/graphql-api/admin" >}}).

## Database

Vendure officially supports multiple databases: MySQL/MariaDB, PostgreSQL, SQLite and SQL.js, plus API-compatible cloud versions of these such as Amazon Aurora. Since Vendure uses [TypeORM](https://typeorm.io/#/) to manage data access, it can theoretically also work with other relational databases supported by TypeORM such as CockroachDB, Microsoft SQL Server, though these are not guaranteed to work in all cases, as they are not covered in our testing.

## Custom Business Logic (Plugins)

Not shown on the diagram (for the sake of simplicity) are plugins. Plugins are the mechanism by which you extend Vendure with your own business logic and functionality. See [the Plugins docs]({{< relref "/plugins" >}})
