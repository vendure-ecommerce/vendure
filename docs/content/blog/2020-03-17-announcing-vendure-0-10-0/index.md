---
title: "Announcing Vendure v0.10.0"
date: 2020-03-17T19:00:00+01:00
draft: false
author: "Michael Bromley"
images: 
    - "/blog/2020/03/announcing-vendure-v0.10.0/vendure-0.10.0-banner-02.jpg"
---

We're very excited to announce the release of version 0.10.0 of Vendure! This release introduces some major improvements to the Admin UI which we'll explore in this post.

{{< figure src="./vendure-0.10.0-banner-02.jpg" >}}

## Angular 9 & Ivy

Our Admin UI app is built with Angular, and this release includes an update to version 9 of Angular - itself a major upgrade since this means that we now use the new "Ivy" engine. Ivy is a brand new compilation & rendering pipeline which was released with Angular 9. In addition to smaller, more performant builds, Ivy also unlocks a bunch of new improvements which we've included in Vendure 0.10.0!

## Re-Architected UI Packages

Formerly, the `@vendure/admin-ui-plugin` package shipped with a compiler which allowed you to build a custom version of the Admin UI with your own extensions. While this worked, it had a few drawbacks:

1. If you didn't need to create UI extensions, you still had to download the entire Angular CLI and related compilation code.
2. It was impossible to pre-compile your UI extensions. Instead, they would be compiled when the Vendure server started. This made zero-downtime deploys effectively impossible.
3. Certain aspects of customizing the UI were overly-complex owing to the restrictions of the Angular compiler before Ivy.
4. All UI extensions would be compiled into a single lazy-loaded bundle, meaning that the first time _any_ extension route was activated, the code for _all_ extensions would be loaded.

With Vendure 0.10.0, all of these issues have been resolved. Now the `@vendure/admin-ui-plugin` is extremely lean and contains _only_ a pre-compiled static bundle of the default Admin UI. For those who wish to create UI extensions, there is now the `@vendure/ui-devkit` package.

If you are already using UI extensions in your project, this means some **breaking changes**, all of which are covered in the [0.10.0 changelog](https://github.com/vendure-ecommerce/vendure/blob/6fbe1db9d7919df2d258c85ec9802fb24a79a1fa/CHANGELOG.md#breaking-change).

## Vendure UI Devkit

The `@vendure/ui-devkit` package contains everything you need to build powerful, seamlessly-integrated UI extensions in **any** front-end technology - Angular, React, Vue - you choose!

The devkit now contains a much-improved compiler which allows pre-compilation, individual lazy-loading of extensions, and vastly simplifies much of the process of wiring up a UI extension. Here's a quick example of how much simpler it is to define a custom field component:

### Before (Vendure 0.9.0)

```TypeScript
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CustomFieldComponentService, NavBuilderService } from '@vendure/admin-ui/src';

import { StarRatingComponent } from './components/star-rating/star-rating.component';

@NgModule({
  declarations: [StarRatingComponent],
  entryComponents: [StarRatingComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: defineCustomFieldControls,
      deps: [CustomFieldComponentService],
    },
  ],
})
export class ReviewsUiExtensionModule {}

export function defineCustomFieldControls(customFieldComponentService: CustomFieldComponentService) {
  return () => {
    customFieldComponentService.registerCustomFieldComponent(
      'Product',
      'reviewRating',
      StarRatingComponent,
    );
  };
}
```

### After (Vendure 0.10.0)
```TypeScript
import { NgModule } from '@angular/core';
import { registerCustomFieldComponent } from '@vendure/admin-ui/core';

import { StarRatingComponent } from './components/star-rating/star-rating.component';

@NgModule({
  declarations: [StarRatingComponent],
  providers: [
    registerCustomFieldComponent('Product', 'reviewRating', StarRatingComponent),
  ],
})
export class ReviewsUiExtensionModule {}
```

As you can see, with Vendure 0.10.0 there is _much_ less potentially-confusing Angular boilerplate required! This was only made possible with the new Ivy engine.

### 📖 See our new documentation: [Extending The Admin UI]({{< relref "/docs/plugins/extending-the-admin-ui" >}})

## Bring Your Own Framework

While the Vendure Admin UI is built with Angular, we recognise that it is just one of many excellent front-end technologies, and some of our users may wish build their own UI extensions with a framework they are more familiar with - React, Vue, Svelte, or just plain JavaScript. With Vendure 0.10.0, this is now possible.

{{< vimeo id="398475820" >}}

Not only can you embed _any_ JavaScript app into the Admin UI, we also provide a client API to allow **seamless interaction with the main application**. Your app doesn't need to worry about pulling in a whole new GraphQL client - you use the exact same client that the main app uses, including the shared, client-side cache with reactive updates! 

### 📖 See our new documentation: [UI Extensions With Other Frameworks]({{< relref "/docs/plugins/extending-the-admin-ui/using-other-frameworks" >}})

## Pre-compile Your Extensions

Our new architecture means you can now include UI extension compilation as part of your deployment process. This ensures that starting up the Vendure server is as fast as possible, because no UI compilation is required at runtime.

### 📖 See our new documentation: [Compiling as a deployment step]({{< relref "/docs/plugins/extending-the-admin-ui" >}}#compiling-as-a-deployment-step)

## Other notable improvements

In addition to all that, here's a few more highlights from the 0.10.0 release:

* The [Clarity UI library](https://clarity.design/) (which the Admin UI is built on) has been updated to v3.0
* The rich text editor (used for Product descriptions etc) has been completely re-written on top of [ProseMirror](https://prosemirror.net/). ProseMirror is incredibly powerful and extensible and we have some exciting ideas of how we can integrate it more deeply with Vendure in the future.

### 📃 All changes in the [Vendure 0.10.0 Changelog](https://github.com/vendure-ecommerce/vendure/blob/6fbe1db9d7919df2d258c85ec9802fb24a79a1fa/CHANGELOG.md#0100-2020-03-17)
