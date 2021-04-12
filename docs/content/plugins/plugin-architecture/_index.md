---
title: "Plugin Architecture"
weight: 0
showtoc: true
---
 
# Plugin Architecture

{{< figure src="plugin_architecture.png" >}}

A plugin in Vendure is a specialized Nestjs Module which is decorated with the [`VendurePlugin` class decorator]({{< relref "vendure-plugin" >}}). This diagram illustrates the how a plugin can integrate with and extend Vendure.
 
1. A Plugin may define logic to be run by the [Vendure Worker]({{< relref "vendure-worker" >}}). This is suitable for long-running or resource-intensive tasks and is done by providing controllers via the [`workers` metadata property]({{< relref "vendure-plugin-metadata" >}}#workers).
2. A Plugin can modify any aspect of server configuration via the [`configuration` metadata property]({{< relref "vendure-plugin-metadata" >}}#configuration).
3. A Plugin can extend the GraphQL APIs via the [`shopApiExtensions` metadata property]({{< relref "vendure-plugin-metadata" >}}#shopapiextensions) and the [`adminApiExtensions` metadata property]({{< relref "vendure-plugin-metadata" >}}#adminapiextensions).
4. A Plugin can interact with Vendure by importing the [`PluginCommonModule`]({{< relref "plugin-common-module" >}}), by which it may inject any of the core Vendure services (which are responsible for all interaction with the database as well as business logic). Additionally a plugin may define new database entities via the [`entities` metadata property]({{< relref "vendure-plugin-metadata" >}}#entities) and otherwise define any other providers and controllers just like any [Nestjs module](https://docs.nestjs.com/modules).
5. A Plugin can run arbitrary code, which allows it to make use of external services. For example, a plugin could interface with a cloud storage provider, a payment gateway, or a video encoding service.
