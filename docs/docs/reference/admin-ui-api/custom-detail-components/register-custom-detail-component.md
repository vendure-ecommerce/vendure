---
title: "RegisterCustomDetailComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerCustomDetailComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-custom-detail-component.ts" sourceLine="57" packageName="@vendure/admin-ui" />

Registers a <a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component#customdetailcomponent'>CustomDetailComponent</a> to be placed in a given location. This allows you
to embed any type of custom Angular component in the entity detail pages of the Admin UI.

*Example*

```ts
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { CustomFieldConfig } from '@vendure/common/lib/generated-types';
import {
    DataService,
    SharedModule,
    CustomDetailComponent,
    registerCustomDetailComponent,
    GetProductWithVariants
} from '@vendure/admin-ui/core';

@Component({
    template: `{{ extraInfo$ | async | json }}`,
    standalone: true,
    imports: [SharedModule],
})
export class ProductInfoComponent implements CustomDetailComponent, OnInit {
    // These two properties are provided by Vendure and will vary
    // depending on the particular detail page you are embedding this
    // component into.
    entity$: Observable<GetProductWithVariants.Product>
    detailForm: FormGroup;

    extraInfo$: Observable<any>;

    constructor(private cmsDataService: CmsDataService) {}

    ngOnInit() {
        this.extraInfo$ = this.entity$.pipe(
            switchMap(entity => this.cmsDataService.getDataFor(entity.id))
        );
    }
}

export default [
    registerCustomDetailComponent({
        locationId: 'product-detail',
        component: ProductInfoComponent,
    }),
];
```

```ts title="Signature"
function registerCustomDetailComponent(config: CustomDetailComponentConfig): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component-config#customdetailcomponentconfig'>CustomDetailComponentConfig</a>`} />

