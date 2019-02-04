---
title: "Plugins"
weight: 2
showtoc: false
---
 
# Plugins

Plugins in Vendure allow one to:

1. Modify the [VendureConfig]({{< relref "vendure-config" >}}) object.
2. Extend the GraphQL API, including modifying existing types and adding completely new queries and mutations.
3. Define new database entities and interact directly with the database.
4. Run code before the server bootstraps, such as starting webservers.

These abilities make plugins a very versatile and powerful means of implementing custom business requirements.

This section details the built-in plugins which ship with Vendure as well as a guide to writing your own plugins.
