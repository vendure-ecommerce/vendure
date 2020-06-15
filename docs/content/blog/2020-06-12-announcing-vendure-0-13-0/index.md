---
title: "Vendure v0.13.0: The Customer is Always Right"
date: 2020-06-12T12:00:00
draft: false
author: "Michael Bromley"
images: 
    - "/blog/2020/06/vendure-v0.13.0-the-customer-is-always-right/vendure-0.13.0-banner-01.jpg"
---

The formula of a successful e-commerce business contains many ingredients, but one is more important than all others: the customer. To that end, we're *very* excited to announce the release of version 0.13.0 of Vendure!
 
{{< figure src="./vendure-0.13.0-banner-01.jpg" >}}
 
 This release includes a host of new features and fixes relating to customer management, and in this blog post and video we'll explore some highlights.


{{< vimeo id="429221236" >}}

## Customer Groups

Customer groups are a brand-new feature which allow customers to be grouped together. Groups can be both functional (e.g. allowing certain business logic to apply to members of that group), or purely informational (e.g. marking a certain set of customers with a "tag"). For example, you may have some B2B customers who should have special tax rules, or certain customers who qualify for a specific promotion. 

Customer groups will be used in the future to enable powerful new possibilities in selective shipping, promotions, taxes, marketing segmentation and more.

## Customer History
Customers now have a full history timeline just like orders do. Now you can see the exact date and time a customer registered and verified their email address; when they requested a password reset; when they updated an address, and more. And just like with orders, notes can also be added to the customer timeline.

The customer history gives store admins rich contextual information for each customer, improving customer service and making debugging issues with customers much more transparent.

## Other Customer-related improvements
The customer's phone number can now be viewed and edited in the customer detail screen, and customers can be deleted via the customer list. It's important to note that the deletion of a customer is a "soft delete", so the actual customer data is not erased from the database. In countries that are subject to the [GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation), more work is needed in order  to comply with data deletion requests from customers. Right now this can be implemented as a custom plugin, and in future Vendure will have official support for this case.


## Collection Slugs
One major missing feature has been the lack of slugs for collections. Slugs allow a custom url to be used to point to a collection in the storefront, enabling urls like `/collection/electronics` rather than `/collection/5`.

This release brings support from collection slugs, and the ability to look up a collection by its slug in the GraphQL APIs. Just like with product slugs, collections can define localized slugs for each supported language.

Check out our updated [demo storefront](https://demo.vendure.io/storefront/) to see collection slugs in action!


## Other notable changes
* Added support for Traditional Chinese to the Admin UI. 
* Added a high-level [configuration guide]({{< relref "/docs/developer-guide/configuration" >}}) to the docs.
* Order notes can now be edited and deleted
* Better control over [Database logging]({{< relref "vendure-config" >}}#logger) - no more getting swamped by sql queries when attempting to debug.
* When using the `search` query, you can now control whether to combine any `facetValueIds` with a logical `AND` or `OR` operator ([see SearchInput docs]({{< relref "/docs/graphql-api/admin/input-types" >}}#searchinput)).
* Many bug fixes 🐛🐝🕷


## 🚧 Breaking changes

Since this is a pre-1.0 minor release, there are a few breaking changes to be aware of. Please see the [breaking changes in the changelog](https://github.com/vendure-ecommerce/vendure/blob/51bb98d80ac692e36d6153b4b839e5e30c543cc2/CHANGELOG.md#breaking-change) for full details.

## 💪 Community contributions

A huge thanks is due to the community members who directly contributed to this release:

* [samxchan1021](https://github.com/samxchan1021) provided Traditional Chinese translations for the Admin UI
* [Nico Hauser](https://github.com/Tyratox) contributed a fix to the core, as well as extending the ElasticSearchPlugin with the new [`mapQuery` option](https://www.vendure.io/docs/typescript-api/elasticsearch-plugin/elasticsearch-options/#mapquery)
* [Eduardo](https://github.com/edxds) implemented a new config option which allows you to [specify the superadmin credentials](https://www.vendure.io/docs/typescript-api/auth/auth-options/#superadmincredentials).
* [Jakub Rybinski](https://github.com/jrybinski) fixed our plugin developer guide.

Plus many more who filed bug reports, made feature requests, and shared feedback 🙏

### 📃 All changes in the [Vendure 0.13.0 Changelog](https://github.com/vendure-ecommerce/vendure/blob/51bb98d80ac692e36d6153b4b839e5e30c543cc2/CHANGELOG.md#0130-2020-06-12)
