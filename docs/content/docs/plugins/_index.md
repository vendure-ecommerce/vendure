---
title: "Plugins"
weight: 2
showtoc: false
---
 
# Plugins

Plugins are the method by which the built-in functionality of Vendure can be extended. Plugins in Vendure allow one to:

1. Modify the [VendureConfig]({{< relref "vendure-config" >}}) object.
2. Extend the GraphQL API, including modifying existing types and adding completely new queries and mutations.
3. Define new database entities and interact directly with the database.
4. Run code before the server bootstraps, such as starting webservers.

These abilities make plugins a very versatile and powerful means of implementing custom business requirements.

This section details the official Vendure plugins included in the main Vendure repo, as well as a guide on writing your own plugins for Vendure.

## Plugin Architecture

{{< figure src="plugin_architecture.png" >}}

This diagram illustrates the how a plugin can integrate with and extend Vendure.

1. A Plugin may define logic to be run by the Vendure Worker. This is suitable for long-running or resource-intensive tasks and is done by providing controllers via the [`VendurePlugin.defineWorkers()` method]({{< relref "vendure-plugin" >}}#defineworkers).
2. A Plugin can modify any aspect of server configuration via the [`VendurePlugin.configure()` method]({{< relref "vendure-plugin" >}}#configure).
3. A Plugin can extend the GraphQL APIs via the [`VendurePlugin.extendShopAPI()` method]({{< relref "vendure-plugin" >}}#extendshopapi) and the [`VendurePlugin.extendAdminAPI()` method]({{< relref "vendure-plugin" >}}#extendadminapi).
4. A Plugin has full access to the ServiceModule, which means it may inject and of the core Vendure services (which are responsible for all interaction with the database as well as business logic). Additionally a plugin may define its own services via the [`VendurePlugin.defineProviders()` method]({{< relref "vendure-plugin" >}}#defineproviders) and may define new database entities via the [`VendurePlugin.defineEntities()` method]({{< relref "vendure-plugin" >}}#defineentities).
5. A Plugin can run arbitrary code, which allows it to make use of external services. For example, a plugin could interface with a cloud storage provider, a payment gateway, or a video encoding service.
