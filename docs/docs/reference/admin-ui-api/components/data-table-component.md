---
title: "DataTableComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DataTableComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/data-table/data-table.component.ts" sourceLine="86" packageName="@vendure/admin-ui" />

A table for displaying PaginatedList results. It is designed to be used inside components which
extend the <a href='/reference/admin-ui-api/list-detail-views/base-list-component#baselistcomponent'>BaseListComponent</a> class.

**Deprecated** This component is deprecated. Use the <a href='/reference/admin-ui-api/components/data-table2component#datatable2component'>DataTable2Component</a> instead.

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

```ts title="Signature"
class DataTableComponent<T> implements AfterContentInit, OnChanges, OnInit, OnDestroy {
    @Input() items: T[];
    @Input() itemsPerPage: number;
    @Input() currentPage: number;
    @Input() totalItems: number;
    @Input() emptyStateLabel: string;
    @Input() selectionManager?: SelectionManager<T>;
    @Output() pageChange = new EventEmitter<number>();
    @Output() itemsPerPageChange = new EventEmitter<number>();
    @Input() allSelected: boolean;
    @Input() isRowSelectedFn: ((item: T) => boolean) | undefined;
    @Output() allSelectChange = new EventEmitter<void>();
    @Output() rowSelectChange = new EventEmitter<{ event: MouseEvent; item: T }>();
    @ContentChildren(DataTableColumnComponent) columns: QueryList<DataTableColumnComponent>;
    @ContentChildren(TemplateRef) templateRefs: QueryList<TemplateRef<any>>;
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
* Implements: <code>AfterContentInit</code>, <code>OnChanges</code>, <code>OnInit</code>, <code>OnDestroy</code>



<div className="members-wrapper">

### items

<MemberInfo kind="property" type={`T[]`}   />


### itemsPerPage

<MemberInfo kind="property" type={`number`}   />


### currentPage

<MemberInfo kind="property" type={`number`}   />


### totalItems

<MemberInfo kind="property" type={`number`}   />


### emptyStateLabel

<MemberInfo kind="property" type={`string`}   />


### selectionManager

<MemberInfo kind="property" type={`SelectionManager&#60;T&#62;`}   />


### pageChange

<MemberInfo kind="property" type={``}   />


### itemsPerPageChange

<MemberInfo kind="property" type={``}   />


### allSelected

<MemberInfo kind="property" type={`boolean`}   />


### isRowSelectedFn

<MemberInfo kind="property" type={`((item: T) =&#62; boolean) | undefined`}   />


### allSelectChange

<MemberInfo kind="property" type={``}   />


### rowSelectChange

<MemberInfo kind="property" type={``}   />


### columns

<MemberInfo kind="property" type={`QueryList&#60;DataTableColumnComponent&#62;`}   />


### templateRefs

<MemberInfo kind="property" type={`QueryList&#60;TemplateRef&#60;any&#62;&#62;`}   />


### rowTemplate

<MemberInfo kind="property" type={`TemplateRef&#60;any&#62;`}   />


### currentStart

<MemberInfo kind="property" type={`number`}   />


### currentEnd

<MemberInfo kind="property" type={`number`}   />


### disableSelect

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(changeDetectorRef: ChangeDetectorRef) => DataTableComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />


### ngOnChanges

<MemberInfo kind="method" type={`(changes: SimpleChanges) => `}   />


### ngOnDestroy

<MemberInfo kind="method" type={`() => `}   />


### ngAfterContentInit

<MemberInfo kind="method" type={`() => void`}   />


### trackByFn

<MemberInfo kind="method" type={`(index: number, item: any) => `}   />


### onToggleAllClick

<MemberInfo kind="method" type={`() => `}   />


### onRowClick

<MemberInfo kind="method" type={`(item: T, event: MouseEvent) => `}   />




</div>
