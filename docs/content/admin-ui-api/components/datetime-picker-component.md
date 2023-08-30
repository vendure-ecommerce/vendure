---
title: "DatetimePickerComponent"
weight: 10
date: 2023-07-14T16:57:51.199Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DatetimePickerComponent
<div class="symbol">


# DatetimePickerComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/datetime-picker/datetime-picker.component.ts" sourceLine="39" packageName="@vendure/admin-ui">}}

A form input for selecting datetime values.

*Example*

```HTML
<vdr-datetime-picker [(ngModel)]="startDate"></vdr-datetime-picker>
```

## Signature

```TypeScript
class DatetimePickerComponent implements ControlValueAccessor, AfterViewInit, OnInit, OnDestroy {
  @Input() @Input() yearRange;
  @Input() @Input() weekStartDay: DayOfWeek = 'mon';
  @Input() @Input() timeGranularityInterval = 5;
  @Input() @Input() min: string | null = null;
  @Input() @Input() max: string | null = null;
  @Input() @Input() readonly = false;
  @ViewChild('dropdownComponent', { static: true }) @ViewChild('dropdownComponent', { static: true }) dropdownComponent: DropdownComponent;
  @ViewChild('datetimeInput', { static: true }) @ViewChild('datetimeInput', { static: true }) datetimeInput: ElementRef<HTMLInputElement>;
  @ViewChild('calendarTable') @ViewChild('calendarTable') calendarTable: ElementRef<HTMLTableElement>;
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
## Implements

 * ControlValueAccessor
 * AfterViewInit
 * OnInit
 * OnDestroy


## Members

### yearRange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}The range above and below the current year which is selectable from
the year select control. If a min or max value is set, these will
override the yearRange.{{< /member-description >}}

### weekStartDay

{{< member-info kind="property" type="DayOfWeek"  >}}

{{< member-description >}}The day that the week should start with in the calendar view.{{< /member-description >}}

### timeGranularityInterval

{{< member-info kind="property" type=""  >}}

{{< member-description >}}The granularity of the minutes time picker{{< /member-description >}}

### min

{{< member-info kind="property" type="string | null"  >}}

{{< member-description >}}The minimum date as an ISO string{{< /member-description >}}

### max

{{< member-info kind="property" type="string | null"  >}}

{{< member-description >}}The maximum date as an ISO string{{< /member-description >}}

### readonly

{{< member-info kind="property" type=""  >}}

{{< member-description >}}Sets the readonly state{{< /member-description >}}

### dropdownComponent

{{< member-info kind="property" type="<a href='/admin-ui-api/components/dropdown-component#dropdowncomponent'>DropdownComponent</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### datetimeInput

{{< member-info kind="property" type="ElementRef&#60;HTMLInputElement&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### calendarTable

{{< member-info kind="property" type="ElementRef&#60;HTMLTableElement&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### disabled

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### calendarView$

{{< member-info kind="property" type="Observable&#60;CalendarView&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### current$

{{< member-info kind="property" type="Observable&#60;CurrentView&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### selected$

{{< member-info kind="property" type="Observable&#60;Date | null&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### selectedHours$

{{< member-info kind="property" type="Observable&#60;number | null&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### selectedMinutes$

{{< member-info kind="property" type="Observable&#60;number | null&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### years

{{< member-info kind="property" type="number[]"  >}}

{{< member-description >}}{{< /member-description >}}

### weekdays

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}{{< /member-description >}}

### hours

{{< member-info kind="property" type="number[]"  >}}

{{< member-description >}}{{< /member-description >}}

### minutes

{{< member-info kind="property" type="number[]"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(changeDetectorRef: ChangeDetectorRef, datetimePickerService: DatetimePickerService) => DatetimePickerComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### ngAfterViewInit

{{< member-info kind="method" type="() => void"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnDestroy

{{< member-info kind="method" type="() => void"  >}}

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

### writeValue

{{< member-info kind="method" type="(value: string | null) => "  >}}

{{< member-description >}}{{< /member-description >}}

### prevMonth

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### nextMonth

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### selectToday

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### setYear

{{< member-info kind="method" type="(event: Event) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setMonth

{{< member-info kind="method" type="(event: Event) => "  >}}

{{< member-description >}}{{< /member-description >}}

### selectDay

{{< member-info kind="method" type="(day: DayCell) => "  >}}

{{< member-description >}}{{< /member-description >}}

### clearValue

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### handleCalendarKeydown

{{< member-info kind="method" type="(event: KeyboardEvent) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setHour

{{< member-info kind="method" type="(event: Event) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setMinute

{{< member-info kind="method" type="(event: Event) => "  >}}

{{< member-description >}}{{< /member-description >}}

### closeDatepicker

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
