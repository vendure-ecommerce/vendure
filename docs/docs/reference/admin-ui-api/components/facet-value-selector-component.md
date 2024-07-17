---
title: "FacetValueSelectorComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FacetValueSelectorComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/facet-value-selector/facet-value-selector.component.ts" sourceLine="34" packageName="@vendure/admin-ui" />

A form control for selecting facet values.

*Example*

```HTML
<vdr-facet-value-selector
  (selectedValuesChange)="selectedValues = $event"
></vdr-facet-value-selector>
```
The `selectedValuesChange` event will emit an array of `FacetValue` objects.

```ts title="Signature"
class FacetValueSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Output() selectedValuesChange = new EventEmitter<FacetValueFragment[]>();
    @Input() readonly = false;
    @Input() transformControlValueAccessorValue: (value: FacetValueFragment[]) => any[] = value => value;
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
* Implements: <code>OnInit</code>, <code>OnDestroy</code>, <code>ControlValueAccessor</code>



<div className="members-wrapper">

### selectedValuesChange

<MemberInfo kind="property" type={``}   />


### readonly

<MemberInfo kind="property" type={``}   />


### transformControlValueAccessorValue

<MemberInfo kind="property" type={`(value: FacetValueFragment[]) =&#62; any[]`}   />


### searchInput$

<MemberInfo kind="property" type={``}   />


### searchLoading

<MemberInfo kind="property" type={``}   />


### searchResults$

<MemberInfo kind="property" type={`Observable&#60;FacetValueFragment[]&#62;`}   />


### selectedIds$

<MemberInfo kind="property" type={``}   />


### onChangeFn

<MemberInfo kind="property" type={`(val: any) =&#62; void`}   />


### onTouchFn

<MemberInfo kind="property" type={`() =&#62; void`}   />


### disabled

<MemberInfo kind="property" type={``}   />


### value

<MemberInfo kind="property" type={`Array&#60;string | FacetValueFragment&#62;`}   />


### constructor

<MemberInfo kind="method" type={`(dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>, changeDetectorRef: ChangeDetectorRef) => FacetValueSelectorComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => void`}   />


### ngOnDestroy

<MemberInfo kind="method" type={`() => `}   />


### onChange

<MemberInfo kind="method" type={`(selected: FacetValueFragment[]) => `}   />


### registerOnChange

<MemberInfo kind="method" type={`(fn: any) => `}   />


### registerOnTouched

<MemberInfo kind="method" type={`(fn: any) => `}   />


### setDisabledState

<MemberInfo kind="method" type={`(isDisabled: boolean) => void`}   />


### focus

<MemberInfo kind="method" type={`() => `}   />


### writeValue

<MemberInfo kind="method" type={`(obj: string | FacetValueFragment[] | Array&#60;string | number&#62; | null) => void`}   />




</div>
