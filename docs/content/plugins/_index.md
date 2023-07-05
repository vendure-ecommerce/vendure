---
title: "Plugins"
weight: 1
---

# Vendure Plugins

The heart of Vendure is its plugin system. Plugins not only allow you to instantly add new functionality to your Vendure server, they are also the means by which you build out the custom business logic of your application.

Plugins in Vendure allow one to:

* Modify the [VendureConfig]({{< ref "/typescript-api/configuration" >}}#vendureconfig) object, such as defining [custom fields]({{< relref "customizing-models" >}}) on existing entities.
* Extend the GraphQL APIs, including modifying existing types and adding completely new queries and mutations.
* Define new database entities and interact directly with the database.
* Interact with external systems that you need to integrate with.
* Respond to [events]({{< relref "event-bus" >}}) such as new orders being placed.
* Trigger background tasks to run on the worker process.
* ... and more!

In a typical Vendure application, custom logic and functionality is implemented as a set of plugins which are usually independent of one another. For example, there could be a plugin for each of the following: wishlists, product reviews, loyalty points, gift cards, etc. This allows for a clean separation of concerns and makes it easy to add or remove functionality as needed.

## Core Plugins

Vendure provides a set of **core plugins** covering common functionality such as assets handling, email sending, and search. For 
documentation on these, see the [Core Plugins section]({{< relref "core-plugins" >}}).
