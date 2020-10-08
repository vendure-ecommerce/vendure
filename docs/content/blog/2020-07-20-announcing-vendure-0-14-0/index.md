---
title: "Announcing Vendure v0.14.0"
date: 2020-07-20T12:00:00
draft: false
author: "Michael Bromley"
images: 
    - "/blog/2020/07/announcing-vendure-v0.14.0/vendure-0.14.0-banner-01.jpg"
---

We are excited to announce the release of Vendure v0.14.0. This is a pretty big release with some [breaking changes](#breaking-changes) that _will_ require some action when you upgrade.

<!--more-->

{{< figure src="./vendure-0.14.0-banner-01.jpg" >}}

This release includes some core changes which represent a big step towards reaching v1.0. Here's a video overview of the main features:

{{< vimeo id="440017551" >}}

## 3rd-Party Authentication Support

One of our most-requested features is finally here: support for external authentication providers! 

With Vendure v0.14.0, authentication for both customers and administrators is now handled by one or more [authentication strategies]({{< relref "authentication-strategy" >}}). The default is the same username/password strategy as before, and this is named [NativeAuthenticationStrategy]({{< relref "native-authentication-strategy" >}}). But now you can define _multiple_ strategies for the Shop API and Admin API separately. 

For example, you may wish to support native, Facebook and Google auth for shop customers, whereas for administrators you may wish to implement a custom strategy which integrates with your existing company singe-sign-on provider.

### 📖 Examples can be found in the new [Authentication guide]({{< relref "authentication" >}}).

## Improved Order Process Customization

All Orders in Vendure are governed by a state machine, which controls how an Order may pass from one state to another (e.g. "AddingItems" to "ArrangingPayment" to "PaymentSettled"). What was not well known previously is that this order process can be customized, so that you can add states and transitions specific to your business processes.

With this release, we've improved the [OrderOptions API]({{< relref "order-options" >}}#process) to allow composition of order state definitions, which means plugins can now define specific states and logic to run when orders transition from one state to another.

Additionally, work has been done to make the order process more transparent in the Admin UI, with a new "order process view", and the ability to manually transition to and from custom order states from the Order detail view.

### 📖 See the new [Customizing the Order Process guide]({{< relref "customizing-the-order-process" >}})

## Configurable session caching

In Vendure, sessions are used to track the current user, the user's permissions, and the contents of a Customer's active order. As such, the "session" and related "user" and "role" database tables get joined and queried in almost every request. At scale, this could become a performance bottleneck.

This release introduces session caching, so that most of the data needed for each request is stored in a cache mechanism defined by the new [`AuthOptions.sessionCacheStrategy` config setting]({{< relref "auth-options" >}}#sessioncachestrategy). By default, Vendure uses the [InMemorySessionCacheStrategy]({{< relref "in-memory-session-cache-strategy" >}}), but for production requirements you can implement a shared cache based on Redis for example.

For a deeper discussion of this feature, as well as performance benchmark data, see the [related GitHib issue](https://github.com/vendure-ecommerce/vendure/issues/394).

## Order custom fields

The ability to define [custom fields]({{< relref "custom-fields" >}}) on Orders has always existed, and can be used for things like providing a "gift message" string or any other custom data that you need to attach to an Order. However, there was previously no built-in API for setting those fields from the Shop or Admin APIs. 

This release adds new `setOrderCustomFields` mutations to both APIs as well as allowing fields to be set directly in the Admin UI.

## More flexible Customer registration

Based on community feedback, we've added support for more flexible Customer registration flows. Previously a new Customer would register with their email address, and then be sent a confirmation email with a link, at which point they would set their account password.

Vendure v0.14.0 now allows the password to be set at the registration step, and the email verication step would automatically authenticate them without any further input needed. (Note that this applies only when using the [native AuthenticationStrategy]({{< relref "native-authentication-strategy" >}}))

## Other notable improvements

* **Improved Asset UI:** When managing assets in the Admin UI, it is now possible to select a range of assets with a shift-click and then delete them all in a single operation.
* **Added ability to delete Administrators**
* **Display Customer's last login time in Admin UI**
* **Added a new [Updating Vendure guide]({{< relref "updating-vendure" >}})**

### 📖 See all changes in the [v0.14.0 Changelog](https://github.com/vendure-ecommerce/vendure/blob/master/CHANGELOG.md#0140-2020-07-20)

## BREAKING CHANGES

{{< alert warning >}}
**🚧 Read this section carefully**
{{< /alert >}}


Due to some of the new features described above, there are a bunch of breaking changes which you'll need to account for when updating to v0.14.0. For general instructions on upgrading, please see the new [Updating Vendure guide]({{< relref "updating-vendure" >}}).

### Database migration

The new authentication strategy support required a fundamental change to the user table. Running a standard TypeORM migration will cause data loss, since you'll need to manually transfer existing User data to the new table structure. 

1. Generate a migration script as described in the [Migrations guide]({{< relref "migrations" >}}).
2. Replace any queries relating to the `user`, `authentication_method`, `administrator` and `session` tables with the queries provided in [this sample migration script](https://gist.github.com/michaelbromley/7b4c2acaa51ac540e26023736d08fe6c). Take time to read and understand the content of that script.
3. **IMPORTANT** test the migration first on data you are prepared to lose to ensure that it works as expected. Do not run on production data without testing.

### Changes to the `RequestContext.session` object

This applies if you have custom plugin code which references the `RequestContext.session` object:

The `RequestContext.session` object is no longer a `Session` entity. Instead, it is a new type, [`CachedSession`]({{< relref "session-cache-strategy" >}}#cachedsession) which contains a subset of data pertaining to the current session. For example, if you have custom code which references `ctx.session.activeOrder` you will now get an error, since activeOrder does not exist on SerializedSession. Instead you would use SerializedSession.activeOrderId and then lookup the order in a separate query.

### Changes to the `User` model

The new authentication changes required changes to the `User` model. Check your custom plugin code for usages of User objects.

### Changes to email templates

Due to changes to the User model, you will need to update the templates of the "email-verification", "email-address-change" and "password-reset" emails to remove the "user" object, so `{{ user.verificationToken }}` becomes `{{ verificationToken }}` and so on.

## 💪 Community contributions

Thank you to the following community members who contributed to this release:

* **Hendrik Depauw** implemented [custom fields on ShippingMethods](https://github.com/vendure-ecommerce/vendure/commit/fbc36ab9999cd69d9ff1e22377832b7122fdc939)
* **Jonathan Célio** made [several improvements](https://github.com/vendure-ecommerce/vendure/commit/d166c08963d60551a6918bb930a2c0d42dd843d0) to the ShippingCalculator APIs
