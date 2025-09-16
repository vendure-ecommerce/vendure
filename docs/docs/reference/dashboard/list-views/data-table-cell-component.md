---
title: "DataTableCellComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DataTableCellComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/data-table/types.ts" sourceLine="40" packageName="@vendure/dashboard" since="3.4.0" />

This type is used to define re-usable components that can render a table cell in a
DataTable.

*Example*

```ts
import { DataTableCellComponent } from '@vendure/dashboard';

type CustomerCellData = {
    customer: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
};

export const CustomerCell: DataTableCellComponent<CustomerCellData> = ({ row }) => {
    const value = row.original.customer;
    if (!value) {
        return null;
    }
    return (
        <Button asChild variant="ghost">
            <Link to={`/customers/${value.id}`}>
                {value.firstName} {value.lastName}
            </Link>
        </Button>
    );
};
```

```ts title="Signature"
type DataTableCellComponent<T> = <Data extends T>(context: CellContext<Data, any>) => any
```
