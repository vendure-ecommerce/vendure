---
title: "Vendure Documentation"
weight: 0
---

# Vendure Documentation

## Quick links

<div class="flex space-x-4 w-full">
{{< alert >}}
**Developers**

Learn how to build with Vendure in our [Developer Guide]({{< relref "developer-guide" >}})
{{< /alert >}}

{{< alert "success" >}}
**Administrators**

Learn how to run your store in our [Administrator Guide]({{< relref "user-guide" >}})
{{< /alert >}}
</div>

## What is Vendure?

Vendure is a headless e-commerce framework.

* *Headless* is a term which means that it does not concern itself with rendering the HTML pages of a website. Rather, it exposes a GraphQL API which which can be *queried* for data ("Give me a list of available products") or issued with *mutation* instructions ("Add product '123' to the current order") by a *client application*. Thus the client is responsible for how the e-commerce "storefront" looks and how it works. Vendure is responsible for the rest.
* Vendure is a *framework* in that it supplies core e-commerce functionality, but is open to further extension by the developer.

## Who should use Vendure?

Vendure is intended to be used by developers who wish to create a modern e-commerce solution. While we aim for a seamless and simple developer experience, Vendure is not aimed at non-technical users.

## What technologies is Vendure built on?

* Vendure is written in [TypeScript](https://www.typescriptlang.org/).
* [Node.js](https://nodejs.org/en/) is the runtime platform.
* The data layer is handled by [TypeORM](http://typeorm.io/), which is compatible with most popular relational databases.
* [Nest](https://nestjs.com/) is used as the underlying architecture.
* The API is [GraphQL](https://graphql.org/) powered by [Apollo Server](https://www.apollographql.com/docs/apollo-server/).
* The Admin UI application is built with [Angular](https://angular.io/).
