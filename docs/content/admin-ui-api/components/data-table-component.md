---
title: "DataTableComponent"
weight: 10
date: 2023-07-14T16:57:51.164Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DataTableComponent
<div class="symbol">


# DataTableComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/data-table/data-table.component.ts" sourceLine="86" packageName="@vendure/admin-ui">}}

A table for displaying PaginatedList results. It is designed to be used inside components which
extend the <a href='/admin-ui-api/list-detail-views/base-list-component#baselistcomponent'>BaseListComponent</a> class.

**Deprecated** This component is deprecated. Use the <a href='/admin-ui-api/components/data-table2component#datatable2component'>DataTable2Component</a> instead.

*Example*

```HTML
<vdr-data-table
  [items]="items$ | async"
  [itemsPerPage]="itemsPerPage$ | async"
  [totalItems]="totalItems$ | async"
  [currentPage]="currentPage$ | async"
  (pageChange)="setPageNumber($event)"
  (itemsPerPageChange)="setItemsPerPage($event)"
>
  <!-- The header columns are defined first -->
  <vdr-dt-column>{{ 'common.name' | translate }}</vdr-dt-column>
  <vdr-dt-column></vdr-dt-column>
  <vdr-dt-column></vdr-dt-column>

  <!-- Then we define how a row is rendered -->
  <ng-template let-taxRate="item">
    <td class="left align-middle">{{ taxRate.name }}</td>
    <td class="left align-middle">{{ taxRate.category.name }}</td>
    <td class="left align-middle">{{ taxRate.zone.name }}</td>
    <td class="left align-middle">{{ taxRate.value }}%</td>
    <td class="right align-middle">
      <vdr-table-row-action
        iconShape="edit"
        [label]="'common.edit' | translate"
        [linkTo]="['./', taxRate.id]"
      ></vdr-table-row-action>
    </td>
    <td class="right align-middle">
      <vdr-dropdown>
        <button type="button" class="btn btn-link btn-sm" vdrDropdownTrigger>
          {{ 'common.actions' | translate }}
          <clr-icon shape="caret down"></clr-icon>
        </button>
        <vdr-dropdown-menu vdrPosition="bottom-right">
          <button
              type="button"
              class="delete-button"
              (click)="deleteTaxRate(taxRate)"
              [disabled]="!(['DeleteSettings', 'DeleteTaxRate'] | hasPermission)"
              vdrDropdownItem
          >
              <clr-icon shape="trash" class="is-danger"></clr-icon>
              {{ 'common.delete' | translate }}
          </button>
        </vdr-dropdown-menu>
      </vdr-dropdown>
    </td>
  </ng-template>
</vdr-data-table>
```

## Signature

```TypeScript
class DataTableComponent<T> implements AfterContentInit, OnChanges, OnInit, OnDestroy {
  @Input() @Input() items: T[];
  @Input() @Input() itemsPerPage: number;
  @Input() @Input() currentPage: number;
  @Input() @Input() totalItems: number;
  @Input() @Input() emptyStateLabel: string;
  @Input() @Input() selectionManager?: SelectionManager<T>;
  @Output() @Output() pageChange = new EventEmitter<number>();
  @Output() @Output() itemsPerPageChange = new EventEmitter<number>();
  @Input() @Input() allSelected: boolean;
  @Input() @Input() isRowSelectedFn: (item: T) => boolean;
  @Output() @Output() allSelectChange = new EventEmitter<void>();
  @Output() @Output() rowSelectChange = new EventEmitter<{ event: MouseEvent; item: T }>();
  @ContentChildren(DataTableColumnComponent) @ContentChildren(DataTableColumnComponent) columns: QueryList<DataTableColumnComponent>;
  @ContentChildren(TemplateRef) @ContentChildren(TemplateRef) templateRefs: QueryList<TemplateRef<any>>;
  rowTemplate: TemplateRef<any>;
  currentStart: number;
  currentEnd: number;
  disableSelect = false;
  constructor(changeDetectorRef: ChangeDetectorRef)
  ngOnInit() => ;
  ngOnChanges(changes: SimpleChanges) => ;
  ngOnDestroy() => ;
  ngAfterContentInit() => void;
  trackByFn(index: number, item: any) => ;
  onToggleAllClick() => ;
  onRowClick(item: T, event: MouseEvent) => ;
}
```
## Implements

 * AfterContentInit
 * OnChanges
 * OnInit
 * OnDestroy


## Members

### items

{{< member-info kind="property" type="T[]"  >}}

{{< member-description >}}{{< /member-description >}}

### itemsPerPage

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### currentPage

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### totalItems

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### emptyStateLabel

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### selectionManager

{{< member-info kind="property" type="SelectionManager&#60;T&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### pageChange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### itemsPerPageChange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### allSelected

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### isRowSelectedFn

{{< member-info kind="property" type="(item: T) =&#62; boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### allSelectChange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### rowSelectChange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### columns

{{< member-info kind="property" type="QueryList&#60;DataTableColumnComponent&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### templateRefs

{{< member-info kind="property" type="QueryList&#60;TemplateRef&#60;any&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### rowTemplate

{{< member-info kind="property" type="TemplateRef&#60;any&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### currentStart

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### currentEnd

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### disableSelect

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(changeDetectorRef: ChangeDetectorRef) => DataTableComponent"  >}}

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

### ngAfterContentInit

{{< member-info kind="method" type="() => void"  >}}

{{< member-description >}}{{< /member-description >}}

### trackByFn

{{< member-info kind="method" type="(index: number, item: any) => "  >}}

{{< member-description >}}{{< /member-description >}}

### onToggleAllClick

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### onRowClick

{{< member-info kind="method" type="(item: T, event: MouseEvent) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
