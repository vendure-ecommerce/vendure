---
title: 'Customizing List Pages'
---

Using the [DashboardDataTableExtensionDefinition](/reference/dashboard/extensions-api/data-tables#dashboarddatatableextensiondefinition) you can
customize any existing data table in the Dashboard.

## Custom table cell components

You can define your own custom components to render specific table cells:

```tsx title="index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';

defineDashboardExtension({
  dataTables: [{
      pageId: 'product-list',
      displayComponents: [
          {
              column: 'slug',
              // The component will be passed the cell's `value`,
              // as well as all the other objects in the Tanstack Table
              // `CellContext` object.
              component: ({ value, cell, row, table }) => {
                  return (
                      <a href={`https://storefront.com/products/${value}`} target="_blank">
                          {value}
                      </a>
                  );
              },
          },
      ],
  }]
});
```

## Bulk actions

You can define bulk actions on the selected table items. The bulk action component should use
[DataTableBulkActionItem](/reference/dashboard/list-views/bulk-actions#datatablebulkactionitem).

```tsx title="index.tsx"
import { defineDashboardExtension, DataTableBulkActionItem } from '@vendure/dashboard';
import { InfoIcon } from 'lucide-react';

defineDashboardExtension({
  dataTables: [{
      pageId: 'product-list',
      bulkActions: [
          {
              component: props => (
                  <DataTableBulkActionItem
                      onClick={() => {
                          console.log('Selection:', props.selection);
                          toast.message(`There are ${props.selection.length} selected items`);
                      }}
                      label="My Custom Action"
                      icon={InfoIcon}
                  />
              ),
          },
      ],
  }]
});
```

## Extending the list query

The GraphQL queries used by list views can be extended using the `extendListDocument` property, and passing 
the additional fields you want to fetch:

```tsx title="index.tsx"
import { defineDashboardExtension, DataTableBulkActionItem } from '@vendure/dashboard';
import { InfoIcon } from 'lucide-react';

defineDashboardExtension({
  dataTables: [{
      pageId: 'product-list',
      extendListDocument: `
          query {
              products {
                  items {
                      optionGroups {
                          id
                          name
                      }
                  }
              }
          }
      `,
  }]
});
```
