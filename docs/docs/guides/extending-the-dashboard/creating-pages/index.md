---
title: 'Creating Pages'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Page Structure

All pages in the Dashboard follow this structure:

```tsx title="src/plugins/example/dashboard/test-page.tsx"
import { Page, PageBlock, PageLayout, PageTitle } from '@vendure/dashboard';

export function TestPage() {
    return (
        <Page pageId="test-page">
            <PageTitle>Test Page</PageTitle>
            <PageLayout>
                <PageBlock column="main" blockId="main-stuff">
                    This will display in the main area
                </PageBlock>
                <PageBlock column="side" blockId="side-stuff">
                    This will display in the side area
                </PageBlock>
            </PageLayout>
        </Page>
    )
}
```

- [Page component](/reference/dashboard/page-layout/page)
  - [PageTitle component](/reference/dashboard/page-layout/page-title)
  - [PageLayout component](/reference/dashboard/page-layout/page-layout)
    - [PageBlock components](/reference/dashboard/page-layout/page-block)

Following this structure ensures that:
- Your pages look consistent with the rest of the Dashboard
- Your page content is responsive
- Your page can be further extended using the [pageBlocks API](/guides/extending-the-dashboard/page-blocks/)

:::info
Note that the [ListPage](/reference/dashboard/list-views/list-page) and [DetailPage](/reference/dashboard/detail-views/detail-page)
components internally use this same structure, so when using those top-level components you don't need to wrap them
in `Page` etc.
:::

## Page Routes & Navigation

Once you have defined a page component, you'll need to make it accessible to users with:

- A route (url) by which it can be accessed
- Usually a navigation bar entry in the main side navigation of the Dashboard

Both of these are handled using the [DashboardRouteDefinition API](/reference/dashboard/extensions-api/routes):

```tsx title="src/plugins/example/dashboard/index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';

import { TestPage } from './test-page';

defineDashboardExtension({
    routes: [
        {
            // The TestPage will be available at e.g. 
            // http://localhost:5173/dashboard/test
            path: '/test',
            // The loader function is allows us to define breadcrumbs
            loader: () => ({ breadcrumb: 'Test Page' }),
            // Here we define the nav menu items
            navMenuItem: {
                // a unique ID
                id: 'test',
                // the nav menu item label
                title: 'Test Page',
                // which section it should appear in
                sectionId: 'catalog',
            },
            component: TestPage,
        },
    ],
});
```

:::info
For a complete guide to the navigation options available, see the [Navigation guide](/guides/extending-the-dashboard/navigation/)
:::



