---
title: 'Page Tabs'
weight: 5
---

You can add your own tabs to any of the Admin UI's list or detail pages using the [registerPageTab](/reference/admin-ui-api/tabs/register-page-tab/) function. For example, to add a new tab to the product detail page for displaying product reviews:

```ts title="src/plugins/reviews/ui/providers.ts"
import { registerPageTab } from '@vendure/admin-ui/core';

import { ReviewListComponent } from './components/review-list/review-list.component';

export default [
    registerPageTab({
        location: 'product-detail',
        tab: 'Reviews',
        route: 'reviews',
        tabIcon: 'star',
        component: ReviewListComponent,
    }),
];
```

![./ui-extensions-tabs.webp](./ui-extensions-tabs.webp)

:::note
Currently it is only possible to define new tabs using Angular components.
:::
