---
title: "RegisterReactDataTableComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerReactDataTableComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/register-react-data-table-component.ts" sourceLine="90" packageName="@vendure/admin-ui" />

Registers a React component to be rendered in a data table in the given location.
The component will receive the `rowItem` prop which is the data object for the row,
e.g. the `Product` object if used in the `product-list` table.

*Example*

```ts title="components/SlugWithLink.tsx"
import { ReactDataTableComponentProps } from '@vendure/admin-ui/react';
import React from 'react';

export function SlugWithLink({ rowItem }: ReactDataTableComponentProps<{ slug: string }>) {
    return (
        <a href={`https://example.com/products/${rowItem.slug}`} target="_blank">
            {rowItem.slug}
        </a>
    );
}
```

```ts title="providers.ts"
import { registerReactDataTableComponent } from '@vendure/admin-ui/react';
import { SlugWithLink } from './components/SlugWithLink';

export default [
    registerReactDataTableComponent({
        component: SlugWithLink,
        tableId: 'product-list',
        columnId: 'slug',
        props: {
          foo: 'bar',
        },
    }),
];
```

```ts title="Signature"
function registerReactDataTableComponent(config: ReactDataTableComponentConfig): void
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/react-extensions/react-data-table-component-config#reactdatatablecomponentconfig'>ReactDataTableComponentConfig</a>`} />

