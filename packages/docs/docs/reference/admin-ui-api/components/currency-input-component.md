---
title: "CurrencyInputComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CurrencyInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/currency-input/currency-input.component.ts" sourceLine="33" packageName="@vendure/admin-ui" />

A form input control which displays currency in decimal format, whilst working
with the integer cent value in the background.

*Example*

```HTML
<vdr-currency-input
    [(ngModel)]="entityPrice"
    [currencyCode]="currencyCode"
></vdr-currency-input>
```

```ts title="Signature"
class CurrencyInputComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() value: number;
    @Input() currencyCode = '';
    @Output() valueChange = new EventEmitter();
    prefix$: Observable<string>;
    suffix$: Observable<string>;
    hasFractionPart = true;
    onChange: (val: any) => void;
    onTouch: () => void;
    _inputValue: string;
    readonly precision: number;
    readonly precisionFactor: number;
    constructor(dataService: DataService, currencyService: CurrencyService)
    ngOnInit() => ;
    ngOnChanges(changes: SimpleChanges) => ;
    ngOnDestroy() => ;
    registerOnChange(fn: any) => ;
    registerOnTouched(fn: any) => ;
    setDisabledState(isDisabled: boolean) => ;
    onInput(value: string) => ;
    onFocus() => ;
    writeValue(value: any) => void;
}
```
* Implements: <code>ControlValueAccessor</code>, <code>OnInit</code>, <code>OnChanges</code>, <code>OnDestroy</code>



<div className="members-wrapper">

### disabled

<MemberInfo kind="property" type={``}   />


### readonly

<MemberInfo kind="property" type={``}   />


### value

<MemberInfo kind="property" type={`number`}   />


### currencyCode

<MemberInfo kind="property" type={``}   />


### valueChange

<MemberInfo kind="property" type={``}   />


### prefix$

<MemberInfo kind="property" type={`Observable&#60;string&#62;`}   />


### suffix$

<MemberInfo kind="property" type={`Observable&#60;string&#62;`}   />


### hasFractionPart

<MemberInfo kind="property" type={``}   />


### onChange

<MemberInfo kind="property" type={`(val: any) =&#62; void`}   />


### onTouch

<MemberInfo kind="property" type={`() =&#62; void`}   />


### _inputValue

<MemberInfo kind="property" type={`string`}   />


### precision

<MemberInfo kind="property" type={`number`}   />


### precisionFactor

<MemberInfo kind="property" type={`number`}   />


### constructor

<MemberInfo kind="method" type={`(dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>, currencyService: CurrencyService) => CurrencyInputComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />


### ngOnChanges

<MemberInfo kind="method" type={`(changes: SimpleChanges) => `}   />


### ngOnDestroy

<MemberInfo kind="method" type={`() => `}   />


### registerOnChange

<MemberInfo kind="method" type={`(fn: any) => `}   />


### registerOnTouched

<MemberInfo kind="method" type={`(fn: any) => `}   />


### setDisabledState

<MemberInfo kind="method" type={`(isDisabled: boolean) => `}   />


### onInput

<MemberInfo kind="method" type={`(value: string) => `}   />


### onFocus

<MemberInfo kind="method" type={`() => `}   />


### writeValue

<MemberInfo kind="method" type={`(value: any) => void`}   />




</div>
