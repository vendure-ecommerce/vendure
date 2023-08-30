---
title: "FacetValueSelectorComponent"
weight: 10
date: 2023-07-14T16:57:51.224Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FacetValueSelectorComponent
<div class="symbol">


# FacetValueSelectorComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/facet-value-selector/facet-value-selector.component.ts" sourceLine="42" packageName="@vendure/admin-ui">}}

A form control for selecting facet values.

*Example*

```HTML
<vdr-facet-value-selector
  [facets]="facets"
  (selectedValuesChange)="selectedValues = $event"
></vdr-facet-value-selector>
```
The `facets` input should be provided from the parent component
like this:

*Example*

```TypeScript
this.facets = this.dataService
  .facet.getAllFacets()
  .mapSingle(data => data.facets.items);
```

## Signature

```TypeScript
class FacetValueSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Output() @Output() selectedValuesChange = new EventEmitter<FacetValueFragment[]>();
  @Input() @Input() readonly = false;
  @Input() @Input() transformControlValueAccessorValue: (value: FacetValueFragment[]) => any[] = value => value;
  searchInput$ = new Subject<string>();
  searchLoading = false;
  searchResults$: Observable<FacetValueFragment[]>;
  selectedIds$ = new Subject<string[]>();
  onChangeFn: (val: any) => void;
  onTouchFn: () => void;
  disabled = false;
  value: Array<string | FacetValueFragment>;
  constructor(dataService: DataService, changeDetectorRef: ChangeDetectorRef)
  ngOnInit() => void;
  ngOnDestroy() => ;
  onChange(selected: FacetValueFragment[]) => ;
  registerOnChange(fn: any) => ;
  registerOnTouched(fn: any) => ;
  setDisabledState(isDisabled: boolean) => void;
  focus() => ;
  writeValue(obj: string | FacetValueFragment[] | Array<string | number> | null) => void;
}
```
## Implements

 * OnInit
 * OnDestroy
 * ControlValueAccessor


## Members

### selectedValuesChange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### transformControlValueAccessorValue

{{< member-info kind="property" type="(value: FacetValueFragment[]) =&#62; any[]"  >}}

{{< member-description >}}{{< /member-description >}}

### searchInput$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### searchLoading

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### searchResults$

{{< member-info kind="property" type="Observable&#60;FacetValueFragment[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### selectedIds$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### onChangeFn

{{< member-info kind="property" type="(val: any) =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### onTouchFn

{{< member-info kind="property" type="() =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### disabled

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### value

{{< member-info kind="property" type="Array&#60;string | FacetValueFragment&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef: ChangeDetectorRef) => FacetValueSelectorComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => void"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnDestroy

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### onChange

{{< member-info kind="method" type="(selected: FacetValueFragment[]) => "  >}}

{{< member-description >}}{{< /member-description >}}

### registerOnChange

{{< member-info kind="method" type="(fn: any) => "  >}}

{{< member-description >}}{{< /member-description >}}

### registerOnTouched

{{< member-info kind="method" type="(fn: any) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setDisabledState

{{< member-info kind="method" type="(isDisabled: boolean) => void"  >}}

{{< member-description >}}{{< /member-description >}}

### focus

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### writeValue

{{< member-info kind="method" type="(obj: string | FacetValueFragment[] | Array&#60;string | number&#62; | null) => void"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
