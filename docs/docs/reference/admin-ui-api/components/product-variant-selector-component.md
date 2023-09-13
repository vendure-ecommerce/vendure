---
title: "ProductVariantSelectorComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariantSelectorComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/product-variant-selector/product-variant-selector.component.ts" sourceLine="21" packageName="@vendure/admin-ui" />

A component for selecting product variants via an autocomplete-style select input.

*Example*

```HTML
<vdr-product-variant-selector
  (productSelected)="selectResult($event)"></vdr-product-selector>
```

```ts title="Signature"
class ProductVariantSelectorComponent implements OnInit {
    searchInput$ = new Subject<string>();
    searchLoading = false;
    searchResults$: Observable<ProductSelectorSearchQuery['search']['items']>;
    @Output() productSelected = new EventEmitter<ProductSelectorSearchQuery['search']['items'][number]>();
    constructor(dataService: DataService)
    ngOnInit() => void;
    selectResult(product?: ProductSelectorSearchQuery['search']['items'][number]) => ;
}
```
* Implements: <code>OnInit</code>



<div className="members-wrapper">

### searchInput$

<MemberInfo kind="property" type={``}   />


### searchLoading

<MemberInfo kind="property" type={``}   />


### searchResults$

<MemberInfo kind="property" type={`Observable&#60;ProductSelectorSearchQuery['search']['items']&#62;`}   />


### productSelected

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>) => ProductVariantSelectorComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => void`}   />


### selectResult

<MemberInfo kind="method" type={`(product?: ProductSelectorSearchQuery['search']['items'][number]) => `}   />




</div>
