---
title: 'Custom Detail Components'
weight: 6
---

# Custom Detail Components

Most of the detail views can be extended with custom Angular components using the [registerCustomDetailComponent function]({{< relref "register-custom-detail-component" >}}).

Any components registered in this way will appear below the main detail form.

Let's imagine that your project has an external content management system (CMS) which is used to store additional details about products. You might want to display some of this information in the product detail page.

```TypeScript
import { NgModule, Component, OnInit } from '@angular/core';
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
  template: `
    {{ extraInfo$ | async | json }}
  `,
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

@NgModule({
  imports: [SharedModule],
  declarations: [ProductInfoComponent],
  providers: [
    registerCustomDetailComponent({
      locationId: 'product-detail',
      component: ProductInfoComponent,
    }),
  ]
})
export class SharedExtensionModule {}
```

The valid locations for embedding custom detail components can be found in the [CustomDetailComponentLocationId docs]({{< relref "custom-detail-component-location-id" >}}).

