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

Every Vendure server always has a **default Channel**, which contains _all_ entities. Subsequent channels can then contain a subset of the above entities.

Use-cases of Channels include:

* Multi-region stores, where there is a distinct website for each territory with its own available inventory, pricing, tax and shipping rules.
* Creating distinct rules and inventory for different sales channels such as Amazon.
* Specialized stores offering a subset of the main inventory.

## Multi-Tenant (Marketplace) Support

In its current form, the Channels feature is not suitable for a multi-tenant or marketplace solution. This is because many entities are still shared across all Channels, e.g. Orders, Customers, Assets.

Multi-tenancy could still be achieved through a dedicated plugin, but would require significant custom work. An out-of-the-box solution will be considered for a future plugin offering.
