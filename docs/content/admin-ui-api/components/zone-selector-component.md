---
title: "ZoneSelectorComponent"
weight: 10
date: 2023-07-14T16:57:51.254Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ZoneSelectorComponent
<div class="symbol">


# ZoneSelectorComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/zone-selector/zone-selector.component.ts" sourceLine="40" packageName="@vendure/admin-ui">}}

A form control for selecting zones.

## Signature

```TypeScript
class ZoneSelectorComponent implements ControlValueAccessor {
  @Output() @Output() selectedValuesChange = new EventEmitter<Zone>();
  @Input() @Input() readonly = false;
  @Input() @Input() transformControlValueAccessorValue: (value: Zone | undefined) => any = value => value?.id;
  selectedId$ = new Subject<string>();
  onChangeFn: (val: any) => void;
  onTouchFn: () => void;
  disabled = false;
  value: string | Zone;
  zones$ = this.dataService
        .query(GetZoneSelectorListDocument, { options: { take: 999 } }, 'cache-first')
        .mapSingle(result => result.zones.items);
  constructor(dataService: DataService, changeDetectorRef: ChangeDetectorRef)
  onChange(selected: Zone) => ;
  registerOnChange(fn: any) => ;
  registerOnTouched(fn: any) => ;
  setDisabledState(isDisabled: boolean) => void;
  focus() => ;
  writeValue(obj: string | Zone | null) => void;
}
```
## Implements

 * ControlValueAccessor


## Members

### selectedValuesChange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### transformControlValueAccessorValue

{{< member-info kind="property" type="(value: <a href='/typescript-api/entities/zone#zone'>Zone</a> | undefined) =&#62; any"  >}}

{{< member-description >}}{{< /member-description >}}

### selectedId$

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

{{< member-info kind="property" type="string | <a href='/typescript-api/entities/zone#zone'>Zone</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### zones$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef: ChangeDetectorRef) => ZoneSelectorComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### onChange

{{< member-info kind="method" type="(selected: <a href='/typescript-api/entities/zone#zone'>Zone</a>) => "  >}}

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

{{< member-info kind="method" type="(obj: string | <a href='/typescript-api/entities/zone#zone'>Zone</a> | null) => void"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
