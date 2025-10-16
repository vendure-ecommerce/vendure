---
title: 'Customizing Detail Pages'
---

Using the [DashboardDetailFormExtensionDefinition](/reference/dashboard/extensions-api/detail-forms#dashboarddetailformextensiondefinition) you can
customize any existing detail page in the Dashboard.

## Custom form inputs

You can replace any of the default form inputs with your own components using the `inputs` property.

Let's say you want to replace the default HTML description editor with a markdown editor component:

```tsx title="index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';

import { MarkdownEditor } from './markdown-editor';

defineDashboardExtension({
    detailForms: [
        {
            pageId: 'product-detail',
            inputs: [
                {
                    blockId: 'main-form',
                    field: 'description',
                    component: MarkdownEditor,
                },
            ],
        },
    ],
});
```

To learn how to build custom form components, see the [Custom Form Elements guide](/guides/extending-the-dashboard/custom-form-components/).

## Extending the detail query

You might want to extend the GraphQL query used to fetch the data for the detail page. For example, to include new
fields that your plugin has defined so that you can render them in [custom page blocks](/guides/extending-the-dashboard/customizing-pages/page-blocks).

```tsx title="index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';

defineDashboardExtension({
    detailForms: [
        {
            pageId: 'product-detail',
            extendDetailDocument: `
          query {
              product(id: $id) {
                  relatedProducts {
                      id
                      name
                      featuredAsset {
                        id
                        preview
                      }
                  }
              }
          }
      `,
        },
    ],
});
```
