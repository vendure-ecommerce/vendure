---
title: "RegisterDataTableComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerDataTableComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-data-table-component.ts" sourceLine="45" packageName="@vendure/admin-ui" />

Allows you to override the default component used to render the data of a particular column in a DataTable.
The component should implement the <a href='/reference/admin-ui-api/custom-table-components/custom-column-component#customcolumncomponent'>CustomColumnComponent</a> interface. The tableId and columnId can
be determined by pressing `ctrl + u` when running the Admin UI in dev mode.

*Example*

```ts title="components/custom-table.component.ts"
import { Component, Input } from '@angular/core';
import { CustomColumnComponent } from '@vendure/admin-ui/core';

@Component({
    selector: 'custom-slug-component',
    template: `
        <a [href]="'https://example.com/products/' + rowItem.slug" target="_blank">{{ rowItem.slug }}</a>
    `,
    standalone: true,
})
export class CustomTableComponent implements CustomColumnComponent {
    @Input() rowItem: any;
}
```

```ts title="providers.ts"
import { registerDataTableComponent } from '@vendure/admin-ui/core';
import { CustomTableComponent } from './components/custom-table.component';

export default [
    registerDataTableComponent({
        component: CustomTableComponent,
        tableId: 'product-list',
        columnId: 'slug',
    }),
];
```

```ts title="Signature"
function registerDataTableComponent(config: DataTableComponentConfig): void
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/custom-table-components/data-table-component-config#datatablecomponentconfig'>DataTableComponentConfig</a>`} />

