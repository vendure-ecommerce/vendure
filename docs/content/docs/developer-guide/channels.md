---
title: "Channels"
showtoc: true
---

# Channels

Channels are a feature of Vendure which allows multiple sales channels to be represented in a single Vendure instance. A Channel allows you to:

* Set a channel-specific currency, tax and shipping defaults
* Assign only specific Products to the Channel (with Channel-specific prices)
* Create Administrator roles limited to the Channel
* Assign only specific Promotions, Collections & ShippingMethods to the Channel (to be implemented)
* Have Orders and Customers associated with specific Channels.

Every Vendure server always has a **default Channel**, which contains _all_ entities. Subsequent channels can then contain a subset of the above entities.

Use-cases of Channels include:

* Multi-region stores, where there is a distinct website for each territory with its own available inventory, pricing, tax and shipping rules.
* Creating distinct rules and inventory for different sales channels such as Amazon.
* Specialized stores offering a subset of the main inventory.

## Multi-Tenant (Marketplace) Support

In its current form, the Channels feature is not suitable for an out-fo-the-box multi-tenant or marketplace solution. This is because several entities which should be isolated in a true multi-tenant system are still shared across all Channels.

Multi-tenancy could still be achieved through a dedicated plugin, and indeed there are some community projects underway in this direction, but would require significant custom work. An out-of-the-box solution will be considered for a future plugin offering.
