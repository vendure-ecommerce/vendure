---
title: "ProductVariantSelectorComponent"
weight: 10
date: 2023-07-14T16:57:51.242Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProductVariantSelectorComponent
<div class="symbol">


# ProductVariantSelectorComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/product-variant-selector/product-variant-selector.component.ts" sourceLine="21" packageName="@vendure/admin-ui">}}

A component for selecting product variants via an autocomplete-style select input.

*Example*

```HTML
<vdr-product-variant-selector
  (productSelected)="selectResult($event)"></vdr-product-selector>
```

## Signature

```TypeScript
class ProductVariantSelectorComponent implements OnInit {
  searchInput$ = new Subject<string>();
  searchLoading = false;
  searchResults$: Observable<ProductSelectorSearchQuery['search']['items']>;
  @Output() @Output() productSelected = new EventEmitter<ProductSelectorSearchQuery['search']['items'][number]>();
  constructor(dataService: DataService)
  ngOnInit() => void;
  selectResult(product?: ProductSelectorSearchQuery['search']['items'][number]) => ;
}
```
## Implements

 * OnInit


## Members

### searchInput$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### searchLoading

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### searchResults$

{{< member-info kind="property" type="Observable&#60;ProductSelectorSearchQuery['search']['items']&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### productSelected

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>) => ProductVariantSelectorComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => void"  >}}

{{< member-description >}}{{< /member-description >}}

### selectResult

{{< member-info kind="method" type="(product?: ProductSelectorSearchQuery['search']['items'][number]) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
