---
title: "CurrencyInputComponent"
weight: 10
date: 2023-07-14T16:57:51.152Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CurrencyInputComponent
<div class="symbol">


# CurrencyInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/currency-input/currency-input.component.ts" sourceLine="33" packageName="@vendure/admin-ui">}}

A form input control which displays currency in decimal format, whilst working
with the integer cent value in the background.

*Example*

```HTML
<vdr-currency-input
    [(ngModel)]="entityPrice"
    [currencyCode]="currencyCode"
></vdr-currency-input>
```

## Signature

```TypeScript
class CurrencyInputComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() @Input() disabled = false;
  @Input() @Input() readonly = false;
  @Input() @Input() value: number;
  @Input() @Input() currencyCode = '';
  @Output() @Output() valueChange = new EventEmitter();
  prefix$: Observable<string>;
  suffix$: Observable<string>;
  hasFractionPart = true;
  onChange: (val: any) => void;
  onTouch: () => void;
  _inputValue: string;
  constructor(dataService: DataService, changeDetectorRef: ChangeDetectorRef)
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
## Implements

 * ControlValueAccessor
 * OnInit
 * OnChanges
 * OnDestroy


## Members

### disabled

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### value

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### currencyCode

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### valueChange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### prefix$

{{< member-info kind="property" type="Observable&#60;string&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### suffix$

{{< member-info kind="property" type="Observable&#60;string&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### hasFractionPart

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### onChange

{{< member-info kind="property" type="(val: any) =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### onTouch

{{< member-info kind="property" type="() =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### _inputValue

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef: ChangeDetectorRef) => CurrencyInputComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnChanges

{{< member-info kind="method" type="(changes: SimpleChanges) => "  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnDestroy

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### registerOnChange

{{< member-info kind="method" type="(fn: any) => "  >}}

{{< member-description >}}{{< /member-description >}}

### registerOnTouched

{{< member-info kind="method" type="(fn: any) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setDisabledState

{{< member-info kind="method" type="(isDisabled: boolean) => "  >}}

{{< member-description >}}{{< /member-description >}}

### onInput

{{< member-info kind="method" type="(value: string) => "  >}}

{{< member-description >}}{{< /member-description >}}

### onFocus

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### writeValue

{{< member-info kind="method" type="(value: any) => void"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
