---
title: "Channels"
showtoc: true
---

# Channels

Channels are a feature of Vendure which allows multiple sales channels to be represented in a single Vendure instance. A Channel allows you to:

* Set Channel-specific currency, language, tax and shipping defaults
* Assign only specific Products to the Channel (with Channel-specific prices)
* Create Administrator roles limited to the Channel
* Assign specific StockLocations, Assets, Facets, Collections, Promotions, ShippingMethods & PaymentMethods to the Channel
* Have Orders and Customers associated with specific Channels.

Every Vendure server always has a **default Channel**, which contains _all_ entities. Subsequent channels can then contain a subset of the above entities.

{{< figure src="channels_diagram.png" >}}

Use-cases of Channels include:

* Multi-region stores, where there is a distinct website for each territory with its own available inventory, pricing, tax and shipping rules.
* Creating distinct rules and inventory for different sales channels such as Amazon.
* Specialized stores offering a subset of the main inventory.
* Implementing [multi-vendor marketplace]({{< relref "multi-vendor-marketplaces" >}}) applications.

## Channels, Currencies & Prices

Each Channel has a set of `availableCurrencyCodes`, and one of these is designated as the `defaultCurrencyCode`, which sets the currency for all monetary values in that channel.

{{< figure src="channels_currencies_diagram.png" >}}

Internally, there is a one-to-many relation from [ProductVariant]({{< relref "product-variant" >}}) to [ProductVariantPrice]({{< relref "product-variant-price" >}}). So the ProductVariant does _not_ hold a price for the product - this is actually stored on the ProductVariantPrice entity, and there will be at least one for each Channel to which the ProductVariant has been assigned.

{{< figure src="channels_prices_diagram.png" >}}

{{< alert "warning" >}}
**Note:** in the diagram above that the ProductVariant is **always assigned to the default Channel**, and thus will have a price in the default channel too. Likewise, the default Channel also has a defaultCurrencyCode.
{{< /alert >}}

### Use-case: single shop

This is the simplest set-up. You just use the default Channel for everything

### Use-case: Multiple separate shops

Let's say you are running multiple distinct businesses, each with its own distinct inventory and possibly different currencies. In this case, you set up a Channel for each shop and create the Product & Variants in the relevant shop's Channel.

The default Channel can then be used by the superadmin for administrative purposes, but other than that the default Channel would not be used. Storefronts would only target a specific shop's Channel.

### Use-case: Multiple shops sharing inventory

Let's say you have a single inventory but want to split it between multiple shops. There might be overlap in the inventory, e.g. the US & EU shops share 80% of inventory, and then the rest is specific to either shop.

In this case, you can create the entire inventory in the default Channel and then assign the Products & ProductVariants to each Channel as needed, setting the price as appropriate for the currency used by each shop.

{{< alert "warning" >}}
**Note:** When creating a new Product & ProductVariants inside a sub-Channel, it will also **always get assigned to the default Channel**. If your sub-Channel uses a different currency from the default Channel, you should be aware that in the default Channel, that ProductVariant will be assigned the **same price** as it has in the sub-Channel. If the currency differs between the Channels, you need to make sure to set the correct price in the default Channel if you are exposing it to Customers via a storefront. 
{{< /alert >}}

### Use-case: Multi-vendor marketplace

This is the most advanced use of channels. For a detailed guide to this use-case, see our [Multi-vendor marketplace guide]({{< relref "multi-vendor-marketplaces" >}}).


## How to set the channel when using the GraphQL API

To specify which channel to use when making an API call, set the `'vendure-token'` header to match the token of the desired Channel.

