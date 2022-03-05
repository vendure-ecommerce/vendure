---
title: 'Multi-Tenant'
showtoc: true
---

# Multi-tenancy Support

Vendure supports multi-tenant headless commerce solutions through its powerful [Channels]({{< relref "channels" >}}) feature.

Channels allow us to segment our business entities per tenant. To do this, you would create a separate Channel per tenant.

## Creating Tenants

Let's say we want to use a single Vendure instance to run 2 separate e-commerce businesses: **Ace Parts** and **Best Choice**. First we need to create a new Channel for each:

{{< figure src="create-channel.png" title="Creating a new Channel via the Admin UI" >}}

Do this for both of our tenants: `ace-parts` and `best-choice`.

## Defining Roles

The next requirement is being able to create Administrators who have permissions only for a given tenant. This is supported by Vendure's role-based access control system.

First we will create a new Role, and grant all permissions on the `ace-parts` Channel only:

{{< figure src="create-role.png" title="Creating a Channel-specific Role" >}}

Next we create a new Administrator, and assign the Role that was just created.

{{< figure src="create-admin.png" title="Creating a Channel-specific Administrator" >}}

Repeat the steps of creating a Role and Administrator for the `best-choice` Channel.

Now you've successfully set up your two tenants and you have an admin account for each.

## Mechanics of Multi-Tenancy

Each tenant is modelled as a Channel, and both of our new Channels can be considered "children" of the **default Channel**. That is, the default Channel contains every Product, Customer, Order, Promotion etc., no matter which Channel they were created in.

{{< figure src="../channels/channels_diagram.png" >}}

In this way, the default Channel can be used by the superadmin account to get an overview of the entire instance, whereas the admins of each tenant will only have access to the entities assigned to their respective Channels.

The following entities are "channel-aware", i.e. they can be assigned to a specific Channel:

* Asset
* Collection
* Customer
* Facet/FacetValue
* Order
* PaymentMethod
* Product/ProductVariant
* Promotion
* Role
* ShippingMethod

In the Admin UI, you can switch between active Channels using the switcher component in the top bar:

{{< figure src="channel-selector.png" title="Switching between Channels" >}}

For example, switching to the `ace-parts` Channel, and then creating a new Product will assign that new Product to the `ace-parts` Channel (_and_ the default Channel, since _everything_ is assigned to the default Channel).

{{< alert "warning" >}}
**Note:** Care must be taken if you log in with the superadmin account in the default Channel, especially with regard to prices and currencies.

See more details see the Channels guide on [Channels, currencies & prices]({{< relref "/docs/developer-guide/channels" >}}#channels-currencies--prices), and in particular the [multiple shops use-cases]({{< relref "/docs/developer-guide/channels" >}}#use-case-multiple-separate-shops)
{{< /alert >}}

## The Storefront

Your storefront applications will need to specify which channel they are interested in. This is done by adding a **query parameter** or **header** to each API requests, with the key being `vendure-token` and the value being the target Channel's `token` property.

```text
https://my-vendure-server.com/shop-api?vendure-token=best-choice
```

## Determining the Active Channel

When developing plugins and writing custom server code in general, you'll often want to know the Channel that the current request is using. This can be determined from the [RequestContext.channel]({{< relref "/docs/typescript-api/request/request-context" >}}#channel) property.

```TypeScript
createPayment: async (ctx, order, amount, args) => {
  if (ctx.channel.code === 'ace-parts') {
    // Use the Ace Parts account to process
    // the payment  
  } else {
    // Use the Best Choice account to process
    // the payment  
  }
}
```
