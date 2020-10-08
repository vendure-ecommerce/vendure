---
title: "Announcing Vendure v0.15.0"
date: 2020-08-27T08:00:00
draft: false
author: "Michael Bromley"
images: 
    - "/blog/2020/08/announcing-vendure-v0.15.0/vendure-0.15.0-banner-01.jpg"
---

We are excited to announce the release of Vendure v0.15.0! Read this blog post to learn about the major new features and breaking changes in this release.

<!--more-->

{{< figure src="./vendure-0.15.0-banner-01.jpg" >}}

{{< vimeo id="452181786" >}}

## List type in Custom Fields

Custom fields enable the built-in entities (Order, Customer, Product etc) to be extended with new data fields specific to your business needs. With this release, custom fields can now be _lists_ (arrays) of the specified type. For example, you may wish to define "keywords" on your Product entity for use in SEO. This can be done with a list of strings:

```TypeScript
export const config: VendureConfig = {
  // ...
  customFields: {
    Product: [
      {
        name: 'keywords',
        type: 'string',
        list: true,  // < this makes it a list
      }
    ],
  }
}
```

In the AdminUI you'll then see a list UI which lets you add, remove and re-order the list items:

{{< figure src="./custom-field-list.jpg" >}}

## Channel-aware Orders

Orders are now associated with Channels. This means that if you have more than one Channel set up, e.g. _Shop1_ & _Shop2_, then an Order created on _Shop2_ will not be visible to Administrators who only have access to _Shop1_. This marks a step towards support for the multi-tenant (marketplace) model, one of the most-requested features from the community.

**Note** that this change makes a careful database migration necessary - see the breaking changes section at the end of this post.

## New Promotion options

We're re-worked the way that Promotion conditions and actions are handled internally, making it easier to implement certain rules and UI controls for them. This made it possible to ship a couple of useful new promotion conditions:

* If cart contains more than x of a specific ProductVariant
* If Customer belongs to a specific CustomerGroup

We've also added a new promotion action:

* Discount on specific products

There is also a brand-new [Promotions guide]({{< relref "/docs/developer-guide/promotions" >}}) which contains detailed instructions on creating your own custom promotion conditions and actions.

## New developer guides

We've added some much-needed documentation to the developer guide:

* [Payment integrations guide]({{< relref "/docs/developer-guide/payment-integrations" >}})
* [Promotions guide]({{< relref "/docs/developer-guide/promotions" >}})
* [Shipping integrations guide]({{< relref "/docs/developer-guide/shipping" >}})

We've also improved the documentation for the underlying APIs which these are built on: [ConfigurableOperationDef]({{< relref "configurable-operation-def" >}}).


## Other notable improvements

* Brazilian Portuguese translations for the Admin UI
* A new `removeAllOrderLines` mutation to clear the cart in a single operation
* Pagination & filtering of product variants in the Admin UI
* Ability to filter search results by a Collection's slug, in addition to id.

### 📖 See all changes in the [v0.15.0 Changelog](https://github.com/vendure-ecommerce/vendure/blob/682966f156e239978de4892183a8e147bd32fd72/CHANGELOG.md#0150-2020-08-27)

## BREAKING CHANGES

{{< alert warning >}}
**🚧 Read this section carefully**
{{< /alert >}}


Due to some of the new features described above, there are a bunch of breaking changes which you'll need to account for when updating to v0.15.0. For general instructions on upgrading, please see the new [Updating Vendure guide]({{< relref "updating-vendure" >}}).

### Database migration

1. Generate a migration script as described in the [Migrations guide]({{< relref "migrations" >}}).
2. Now that Orders are associated with Channels, you'll need to manually add the following query to your migration at the end:
   ```TypeScript
   // Assuming the ID of the default Channel is 1.
   // If you are using a UUID strategy, replace 1 with 
   // the ID of the default channel.
    await queryRunner.query(
      'INSERT INTO `order_channels_channel` (orderId, channelId) SELECT id, 1 FROM `order`',
      undefined,
    );
   ```
3. **IMPORTANT** test the migration first on data you are prepared to lose to ensure that it works as expected. Do not run on production data without testing.

### Changes to Admin UI custom field controls

If you use custom field controls in the Admin UI, you'll need to slightly modify the component class: the customFieldConfig property has been renamed to `config` and a required `readonly: boolean;` field should be added. This is part of an effort to unify the way custom input components work across different parts of the Admin UI.

```TypeScript
// before
export class MyCustomControl implements CustomFieldControl {
    customFieldConfig: CustomFieldConfigType;
    formControl: FormControl;
}

// after
export class MyCustomControl implements CustomFieldControl {
    config: CustomFieldConfigType;
    readonly: boolean;
    formControl: FormControl;
}
```

### Type definitions changes
* If you have created custom CollectionFilters of PromotionActions/Conditions using the `'facetValueIds'` type for an argument: the `'facetValueIds'` type has been removed from the `ConfigArgType` type, and replaced by `'ID'` and the `list: true` option. 
* The `ID` type in `@vendure/common/lib/generated-types` & `@vendure/common/lib/generated-shop-types` is now correctly typed as `string | number`, whereas previously it was `string`. If you are using any generated types in your plugin code, this may lead to TypeScript compiler errors which will need to be corrected.

## 💪 Community contributions

Thank you to the following community members who contributed to this release:

* **Hendrik Depauw** implemented [Channel-aware Orders](https://github.com/vendure-ecommerce/vendure/commit/9bb5750f0f93f1f8cf14d68f21a1594cbe15d72b)
* **Anderson Lima** contributed the [Brazilian Portuguese translations for the Admin UI](https://github.com/vendure-ecommerce/vendure/pull/443)
* **Jonathan Célio** implemented the [removeAllOrderLines mutation](https://github.com/vendure-ecommerce/vendure/commit/841e352cc3612fa5429222c595c1fbf038806eae)
* **Thomas Blommaert** contributed several [improvements](https://github.com/vendure-ecommerce/vendure/commit/ce903ade11be10ba8fbfe3e7cb0b107b3c02e6fc) & [fixes](https://github.com/vendure-ecommerce/vendure/commit/9fab7e89ef0a902272694cc17e1b9ab811f7f488) that were included in v0.14.1, but deserve a specific mention here!
