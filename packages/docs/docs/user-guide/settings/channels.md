---
title: "Channels"
---

# Channels

Channels allow you to split your store into multiple sub-stores, each of which can have its own selection of inventory, customers, orders, shipping methods etc.

There are various reasons why you might want to do this:

* Creating distinct stores for different countries, each with country-specific pricing, shipping and payment rules.
* Implementing a multi-tenant application where many merchants have their own store, each confined to its own channel.
* Implementing a marketplace where each seller has their own channel.

Each channel defines some basic default settings - currency, language, tax options.

There is _always_ a **default channel** - this is the "root" channel which contains _everything_, and any sub-channels can then contain a subset of the contents of the default channel.
  
