---
title: "Plugins"
weight: 1
---

# Vendure Plugins

Plugins are the method by which the built-in functionality of Vendure can be extended. Plugins in Vendure allow one to:

* Modify the [VendureConfig]({{< ref "/docs/typescript-api/configuration" >}}#vendureconfig) object.
* Extend the GraphQL API, including modifying existing types and adding completely new queries and mutations.
* Define new database entities and interact directly with the database.
* Run code before the server bootstraps, such as starting webservers.
* Respond to events such as new orders being placed.
* Trigger background tasks to run on the worker process.
* ... and more!


These abilities make plugins a very versatile and powerful means of implementing custom business requirements.

This section details the official Vendure plugins included in the main Vendure repo, as well as a guide on writing your own plugins for Vendure.
