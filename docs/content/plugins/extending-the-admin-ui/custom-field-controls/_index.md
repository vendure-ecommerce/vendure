---
title: 'CustomField Controls'
weight: 5
---

# CustomField Controls

Another way to extend the Admin UI app is to define custom form control components for manipulating any [Custom Fields]({{< ref "/docs/typescript-api/custom-fields" >}}) you have defined on your entities.

Let's say you define a custom "intensity" field on the Product entity:

```TypeScript
// project/vendure-config.ts

customFields: {
  Product: [
    { name: 'intensity', type: 'int', min: 0, max: 100, defaultValue: 0 },
  ],
}
```

By default, the "intensity" field will be displayed as a number input:

{{< figure src="./ui-extensions-custom-field-default.jpg" >}}

But let's say we want to display a range slider instead. Here's how we can do this using our shared extension module combined with the `registerCustomFieldComponent()` function:

```TypeScript
import { NgModule, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedModule, CustomFieldControl, 
  CustomFieldConfigType, registerCustomFieldComponent } from '@vendure/admin-ui/core';

@Component({
  template: `
    <input
        type="range"
        [min]="config.intMin"
        [max]="config.intMax"
        [formControl]="formControl" />
    {{ formControl.value }}
  `,
})
export class SliderControl implements CustomFieldControl {
  readonly: boolean;
  config: CustomFieldConfigType;
  formControl: FormControl;
}

@NgModule({
  imports: [SharedModule],
  declarations: [SliderControl],
  providers: [
    registerCustomFieldComponent('Product', 'intensity', SliderControl),
  ]
})
export class SharedExtensionModule { }
```

Re-compiling the Admin UI will result in our SliderControl now being used for the "intensity" custom field:

{{< figure src="./ui-extensions-custom-field-slider.jpg" >}}

To recap the steps involved:

1. Create an Angular Component which implements the `CustomFieldControl` interface.
2. Add this component to your shared extension module's `declarations` array.
3. Use `registerCustomFieldComponent()` to register your component for the given entity & custom field name.

## Custom Field Controls for Relations

If you have a custom field of the `relation` type (which allows you to relate entities with one another), you can also define custom field controls for them. The basic mechanism is exactly the same as with primitive custom field types (i.e. `string`, `int` etc.), but there are a couple of important points to know:

1. The value of the `formControl` will be the _related entity object_ rather than an id. The Admin UI will internally take care of converting the entity object into an ID when performing the create/update mutation.
2. Your control will most likely need to fetch data in order to display a list of selections for the user.

Here is a simple example taken from the [real-world-vendure](https://github.com/vendure-ecommerce/real-world-vendure/blob/master/src/plugins/reviews/ui/components/featured-review-selector/featured-review-selector.component.ts) repo:

```TypeScript
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomFieldControl, DataService } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GET_REVIEWS_FOR_PRODUCT } from '../product-reviews-list/product-reviews-list.graphql';
import { GetReviewForProduct, ProductReviewFragment } from '../../generated-types';

@Component({
  selector: 'relation-review-input',
  template: `
    <div *ngIf="formControl.value as review">
      <vdr-chip>{{ review.rating }} / 5</vdr-chip>
      {{ review.summary }}
      <a [routerLink]="['/extensions', 'product-reviews', review.id]">
        <clr-icon shape="link"></clr-icon>
      </a>
    </div>
    <select appendTo="body" [formControl]="formControl">
      <option [ngValue]="null">Select a review...</option>
      <option *ngFor="let item of reviews$ | async" [ngValue]="item">
        <b>{{ item.summary }}</b>
        {{ item.rating }} / 5
      </option>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationReviewInputComponent implements OnInit, CustomFieldControl {
  @Input() readonly: boolean;
  @Input() formControl: FormControl;
  @Input() config: any;

  reviews$: Observable<ProductReviewFragment[]>;

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.reviews$ = this.route.data.pipe(
      switchMap(data => data.entity),
      switchMap((product: any) => {
        return this.dataService
          .query<GetReviewForProduct.Query, GetReviewForProduct.Variables>(
            GET_REVIEWS_FOR_PRODUCT,
            {
              productId: product.id,
            },
          )
          .mapSingle(({ product }) => product?.reviews.items ?? []);
      }),
    );
  }
}
```
