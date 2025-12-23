---
title: "Bulk Actions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DataTableBulkActionItemProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/data-table/data-table-bulk-action-item.tsx" sourceLine="26" packageName="@vendure/dashboard" since="3.4.0" />



```ts title="Signature"
interface DataTableBulkActionItemProps {
    label: React.ReactNode;
    icon?: LucideIcon;
    confirmationText?: React.ReactNode;
    onClick: () => void;
    className?: string;
    requiresPermission?: string[];
    disabled?: boolean;
}
```

<div className="members-wrapper">

### label

<MemberInfo kind="property" type={`React.ReactNode`}   />


### icon

<MemberInfo kind="property" type={`LucideIcon`}   />


### confirmationText

<MemberInfo kind="property" type={`React.ReactNode`}   />


### onClick

<MemberInfo kind="property" type={`() =&#62; void`}   />


### className

<MemberInfo kind="property" type={`string`}   />


### requiresPermission

<MemberInfo kind="property" type={`string[]`}   />


### disabled

<MemberInfo kind="property" type={`boolean`}   />




</div>


## DataTableBulkActionItem

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/data-table/data-table-bulk-action-item.tsx" sourceLine="67" packageName="@vendure/dashboard" since="3.4.0" />

A component that should be used to implement any bulk actions for list pages & data tables.

*Example*

```tsx
import { Trans } from '@lingui/react/macro';
import { DataTableBulkActionItem, BulkActionComponent } from '@vendure/dashboard';
import { Check } from 'lucide-react';

export const MyBulkAction: BulkActionComponent<any> = ({ selection, table }) => {

  return (
    <DataTableBulkActionItem
      requiresPermission={['ReadMyCustomEntity']}
      onClick={() => {
        console.log('Selected items:', selection);
      }}
      label={<Trans>Delete</Trans>}
      confirmationText={<Trans>Are you sure?</Trans>}
      icon={Check}
      className="text-destructive"
    />
  );
}
```

```ts title="Signature"
function DataTableBulkActionItem(props: Readonly<DataTableBulkActionItemProps>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/list-views/bulk-actions#datatablebulkactionitemprops'>DataTableBulkActionItemProps</a>&#62;`} />



## BulkAction

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/data-table.ts" sourceLine="109" packageName="@vendure/dashboard" since="3.4.0" />

A bulk action is a component that will be rendered in the bulk actions dropdown.

The component receives the following props:

- `selection`: The selected row or rows
- `table`: A reference to the Tanstack table instance powering the list

The `table` object has

*Example*

```tsx
import { BulkActionComponent, DataTableBulkActionItem, usePaginatedList } from '@vendure/dashboard';

// This is an example of a bulk action that shows some typical
// uses of the provided props
export const MyBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
  const { refetchPaginatedList } = usePaginatedList();

  const doTheAction = async () => {
    // Actual logic of the action
    // goes here...

    // On success, we refresh the list
    refetchPaginatedList();
    // and un-select any selected rows in the table
    table.resetRowSelection();
  };

 return (
   <DataTableBulkActionItem
     onClick={doTheAction}
     label={<Trans>Delete</Trans>}
     confirmationText={<Trans>Are you sure?</Trans>}
     icon={Check}
     className="text-destructive"
   />
 );
}
```

For the common action of deletion, we provide a ready-made helper component:

*Example*

```tsx
import { BulkActionComponent, DeleteProductsBulkAction } from '@vendure/dashboard';

// Define the BulkAction component. This one uses
// a built-in wrapper for "delete" actions, which includes
// a confirmation dialog.
export const DeleteProductsBulkAction: BulkActionComponent<any> = ({ selection, table }) => {
    return (
        <DeleteBulkAction
            mutationDocument={deleteProductsDocument}
            entityName="products"
            requiredPermissions={['DeleteCatalog', 'DeleteProduct']}
            selection={selection}
            table={table}
        />
    );
};
```

```ts title="Signature"
type BulkAction = {
    order?: number;
    component: BulkActionComponent<any>;
}
```

<div className="members-wrapper">

### order

<MemberInfo kind="property" type={`number`}   />

Optional order number to control the position of this bulk action in the dropdown.
A larger number will appear lower in the list.
### component

<MemberInfo kind="property" type={`BulkActionComponent&#60;any&#62;`}   />

The React component that will be rendered as the bulk action item.


</div>
