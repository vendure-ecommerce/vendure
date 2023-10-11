---
title: "DatetimePickerComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DatetimePickerComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/datetime-picker/datetime-picker.component.ts" sourceLine="39" packageName="@vendure/admin-ui" />

A form input for selecting datetime values.

*Example*

```HTML
<vdr-datetime-picker [(ngModel)]="startDate"></vdr-datetime-picker>
```

```ts title="Signature"
class DatetimePickerComponent implements ControlValueAccessor, AfterViewInit, OnInit, OnDestroy {
    @Input() yearRange;
    @Input() weekStartDay: DayOfWeek = 'mon';
    @Input() timeGranularityInterval = 5;
    @Input() min: string | null = null;
    @Input() max: string | null = null;
    @Input() readonly = false;
    @ViewChild('dropdownComponent', { static: true }) dropdownComponent: DropdownComponent;
    @ViewChild('datetimeInput', { static: true }) datetimeInput: ElementRef<HTMLInputElement>;
    @ViewChild('calendarTable') calendarTable: ElementRef<HTMLTableElement>;
    disabled = false;
    calendarView$: Observable<CalendarView>;
    current$: Observable<CurrentView>;
    selected$: Observable<Date | null>;
    selectedHours$: Observable<number | null>;
    selectedMinutes$: Observable<number | null>;
    years: number[];
    weekdays: string[] = [];
    hours: number[];
    minutes: number[];
    constructor(changeDetectorRef: ChangeDetectorRef, datetimePickerService: DatetimePickerService)
    ngOnInit() => ;
    ngAfterViewInit() => void;
    ngOnDestroy() => void;
    registerOnChange(fn: any) => ;
    registerOnTouched(fn: any) => ;
    setDisabledState(isDisabled: boolean) => ;
    writeValue(value: string | null) => ;
    prevMonth() => ;
    nextMonth() => ;
    selectToday() => ;
    setYear(event: Event) => ;
    setMonth(event: Event) => ;
    selectDay(day: DayCell) => ;
    clearValue() => ;
    handleCalendarKeydown(event: KeyboardEvent) => ;
    setHour(event: Event) => ;
    setMinute(event: Event) => ;
    closeDatepicker() => ;
}
```
* Implements: <code>ControlValueAccessor</code>, <code>AfterViewInit</code>, <code>OnInit</code>, <code>OnDestroy</code>



<div className="members-wrapper">

### yearRange

<MemberInfo kind="property" type={``}   />

The range above and below the current year which is selectable from
the year select control. If a min or max value is set, these will
override the yearRange.
### weekStartDay

<MemberInfo kind="property" type={`DayOfWeek`}   />

The day that the week should start with in the calendar view.
### timeGranularityInterval

<MemberInfo kind="property" type={``}   />

The granularity of the minutes time picker
### min

<MemberInfo kind="property" type={`string | null`}   />

The minimum date as an ISO string
### max

<MemberInfo kind="property" type={`string | null`}   />

The maximum date as an ISO string
### readonly

<MemberInfo kind="property" type={``}   />

Sets the readonly state
### dropdownComponent

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/components/dropdown-component#dropdowncomponent'>DropdownComponent</a>`}   />


### datetimeInput

<MemberInfo kind="property" type={`ElementRef&#60;HTMLInputElement&#62;`}   />


### calendarTable

<MemberInfo kind="property" type={`ElementRef&#60;HTMLTableElement&#62;`}   />


### disabled

<MemberInfo kind="property" type={``}   />


### calendarView$

<MemberInfo kind="property" type={`Observable&#60;CalendarView&#62;`}   />


### current$

<MemberInfo kind="property" type={`Observable&#60;CurrentView&#62;`}   />


### selected$

<MemberInfo kind="property" type={`Observable&#60;Date | null&#62;`}   />


### selectedHours$

<MemberInfo kind="property" type={`Observable&#60;number | null&#62;`}   />


### selectedMinutes$

<MemberInfo kind="property" type={`Observable&#60;number | null&#62;`}   />


### years

<MemberInfo kind="property" type={`number[]`}   />


### weekdays

<MemberInfo kind="property" type={`string[]`}   />


### hours

<MemberInfo kind="property" type={`number[]`}   />


### minutes

<MemberInfo kind="property" type={`number[]`}   />


### constructor

<MemberInfo kind="method" type={`(changeDetectorRef: ChangeDetectorRef, datetimePickerService: DatetimePickerService) => DatetimePickerComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />


### ngAfterViewInit

<MemberInfo kind="method" type={`() => void`}   />


### ngOnDestroy

<MemberInfo kind="method" type={`() => void`}   />


### registerOnChange

<MemberInfo kind="method" type={`(fn: any) => `}   />


### registerOnTouched

<MemberInfo kind="method" type={`(fn: any) => `}   />


### setDisabledState

<MemberInfo kind="method" type={`(isDisabled: boolean) => `}   />


### writeValue

<MemberInfo kind="method" type={`(value: string | null) => `}   />


### prevMonth

<MemberInfo kind="method" type={`() => `}   />


### nextMonth

<MemberInfo kind="method" type={`() => `}   />


### selectToday

<MemberInfo kind="method" type={`() => `}   />


### setYear

<MemberInfo kind="method" type={`(event: Event) => `}   />


### setMonth

<MemberInfo kind="method" type={`(event: Event) => `}   />


### selectDay

<MemberInfo kind="method" type={`(day: DayCell) => `}   />


### clearValue

<MemberInfo kind="method" type={`() => `}   />


### handleCalendarKeydown

<MemberInfo kind="method" type={`(event: KeyboardEvent) => `}   />


### setHour

<MemberInfo kind="method" type={`(event: Event) => `}   />


### setMinute

<MemberInfo kind="method" type={`(event: Event) => `}   />


### closeDatepicker

<MemberInfo kind="method" type={`() => `}   />




</div>
