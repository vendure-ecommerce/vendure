---
title: "ZoneSelectorComponent"
weight: 10
date: 2023-07-20T13:56:18.473Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ZoneSelectorComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/zone-selector/zone-selector.component.ts" sourceLine="40" packageName="@vendure/admin-ui" />

A form control for selecting zones.

```ts title="Signature"
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
Implements

 * ControlValueAccessor



### selectedValuesChange

<MemberInfo kind="property" type=""   />


### readonly

<MemberInfo kind="property" type=""   />


### transformControlValueAccessorValue

<MemberInfo kind="property" type="(value: <a href='/typescript-api/entities/zone#zone'>Zone</a> | undefined) =&#62; any"   />


### selectedId$

<MemberInfo kind="property" type=""   />


### onChangeFn

<MemberInfo kind="property" type="(val: any) =&#62; void"   />


### onTouchFn

<MemberInfo kind="property" type="() =&#62; void"   />


### disabled

<MemberInfo kind="property" type=""   />


### value

<MemberInfo kind="property" type="string | <a href='/typescript-api/entities/zone#zone'>Zone</a>"   />


### zones$

<MemberInfo kind="property" type=""   />


### constructor

<MemberInfo kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef: ChangeDetectorRef) => ZoneSelectorComponent"   />


### onChange

<MemberInfo kind="method" type="(selected: <a href='/typescript-api/entities/zone#zone'>Zone</a>) => "   />


### registerOnChange

<MemberInfo kind="method" type="(fn: any) => "   />


### registerOnTouched

<MemberInfo kind="method" type="(fn: any) => "   />


### setDisabledState

<MemberInfo kind="method" type="(isDisabled: boolean) => void"   />


### focus

<MemberInfo kind="method" type="() => "   />


### writeValue

<MemberInfo kind="method" type="(obj: string | <a href='/typescript-api/entities/zone#zone'>Zone</a> | null) => void"   />


