---
title: "DataTable2Component"
weight: 10
date: 2023-07-28T12:05:26.458Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DataTable2Component

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/data-table-2/data-table2.component.ts" sourceLine="92" packageName="@vendure/admin-ui" />

A table for displaying PaginatedList results. It is designed to be used inside components which
extend the <a href='/reference/admin-ui-api/list-detail-views/base-list-component#baselistcomponent'>BaseListComponent</a> or <a href='/reference/admin-ui-api/list-detail-views/typed-base-list-component#typedbaselistcomponent'>TypedBaseListComponent</a> class.

*Example*

```HTML
<vdr-data-table-2
    id="product-review-list"
    [items]="items$ | async"
    [itemsPerPage]="itemsPerPage$ | async"
    [totalItems]="totalItems$ | async"
    [currentPage]="currentPage$ | async"
    [filters]="filters"
    (pageChange)="setPageNumber($event)"
    (itemsPerPageChange)="setItemsPerPage($event)"
>
    <vdr-bulk-action-menu
        locationId="product-review-list"
        [hostComponent]="this"
        [selectionManager]="selectionManager"
    />
    <vdr-dt2-search
        [searchTermControl]="searchTermControl"
        searchTermPlaceholder="Filter by title"
    />
    <vdr-dt2-column [heading]="'common.id' | translate" [hiddenByDefault]="true">
        <ng-template let-review="item">
            {{ review.id }}
        </ng-template>
    </vdr-dt2-column>
    <vdr-dt2-column
        [heading]="'common.created-at' | translate"
        [hiddenByDefault]="true"
        [sort]="sorts.get('createdAt')"
    >
        <ng-template let-review="item">
            {{ review.createdAt | localeDate : 'short' }}
        </ng-template>
    </vdr-dt2-column>
    <vdr-dt2-column
        [heading]="'common.updated-at' | translate"
        [hiddenByDefault]="true"
        [sort]="sorts.get('updatedAt')"
    >
        <ng-template let-review="item">
            {{ review.updatedAt | localeDate : 'short' }}
        </ng-template>
    </vdr-dt2-column>
    <vdr-dt2-column [heading]="'common.name' | translate" [optional]="false" [sort]="sorts.get('name')">
        <ng-template let-review="item">
            <a class="button-ghost" [routerLink]="['./', review.id]"
                ><span>{{ review.name }}</span>
                <clr-icon shape="arrow right"></clr-icon>
            </a>
        </ng-template>
    </vdr-dt2-column>
</vdr-data-table-2>
```

```ts title="Signature"
class DataTable2Component<T> implements AfterContentInit, OnChanges, OnDestroy {
  @Input() @Input() id: string;
  @Input() @Input() items: T[];
  @Input() @Input() itemsPerPage: number;
  @Input() @Input() currentPage: number;
  @Input() @Input() totalItems: number;
  @Input() @Input() emptyStateLabel: string;
  @Input() @Input() filters: DataTableFilterCollection;
  @Input() @Input() activeIndex = -1;
  @Output() @Output() pageChange = new EventEmitter<number>();
  @Output() @Output() itemsPerPageChange = new EventEmitter<number>();
  @ContentChildren(DataTable2ColumnComponent) @ContentChildren(DataTable2ColumnComponent) columns: QueryList<DataTable2ColumnComponent<T>>;
  @ContentChildren(DataTableCustomFieldColumnComponent) @ContentChildren(DataTableCustomFieldColumnComponent)
    customFieldColumns: QueryList<DataTableCustomFieldColumnComponent<T>>;
  @ContentChild(DataTable2SearchComponent) @ContentChild(DataTable2SearchComponent) searchComponent: DataTable2SearchComponent;
  @ContentChild(BulkActionMenuComponent) @ContentChild(BulkActionMenuComponent) bulkActionMenuComponent: BulkActionMenuComponent;
  @ContentChild('vdrDt2CustomSearch') @ContentChild('vdrDt2CustomSearch') customSearchTemplate: TemplateRef<any>;
  @ContentChildren(TemplateRef) @ContentChildren(TemplateRef) templateRefs: QueryList<TemplateRef<any>>;
  rowTemplate: TemplateRef<any>;
  currentStart: number;
  currentEnd: number;
  disableSelect = false;
  showSearchFilterRow = false;
  protected protected uiLanguage$: Observable<LanguageCode>;
  constructor(changeDetectorRef: ChangeDetectorRef, localStorageService: LocalStorageService, dataService: DataService)
  selectionManager: void
  allColumns: void
  visibleSortedColumns: void
  sortedColumns: void
  ngOnChanges(changes: SimpleChanges) => ;
  ngOnDestroy() => ;
  ngAfterContentInit() => void;
  onColumnReorder(event: { column: DataTable2ColumnComponent<any>; newIndex: number }) => ;
  onColumnsReset() => ;
  toggleSearchFilterRow() => ;
  trackByFn(index: number, item: any) => ;
  onToggleAllClick() => ;
  onRowClick(item: T, event: MouseEvent) => ;
  protected getDataTableConfig() => DataTableConfig;
}
```
* Implements: <code>AfterContentInit</code>, <code>OnChanges</code>, <code>OnDestroy</code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />


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


### filters

<MemberInfo kind="property" type={`DataTableFilterCollection`}   />


### activeIndex

<MemberInfo kind="property" type={``}   />


### pageChange

<MemberInfo kind="property" type={``}   />


### itemsPerPageChange

<MemberInfo kind="property" type={``}   />


### columns

<MemberInfo kind="property" type={`QueryList&#60;DataTable2ColumnComponent&#60;T&#62;&#62;`}   />


### customFieldColumns

<MemberInfo kind="property" type={`QueryList&#60;DataTableCustomFieldColumnComponent&#60;T&#62;&#62;`}   />


### searchComponent

<MemberInfo kind="property" type={`DataTable2SearchComponent`}   />


### bulkActionMenuComponent

<MemberInfo kind="property" type={`BulkActionMenuComponent`}   />


### customSearchTemplate

<MemberInfo kind="property" type={`TemplateRef&#60;any&#62;`}   />


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


### showSearchFilterRow

<MemberInfo kind="property" type={``}   />


### uiLanguage$

<MemberInfo kind="property" type={`Observable&#60;<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>&#62;`}   />


### constructor

<MemberInfo kind="method" type={`(changeDetectorRef: ChangeDetectorRef, localStorageService: LocalStorageService, dataService: <a href='/reference/admin-ui-api/providers/data-service#dataservice'>DataService</a>) => DataTable2Component`}   />


### selectionManager

<MemberInfo kind="property" type={``}   />


### allColumns

<MemberInfo kind="property" type={``}   />


### visibleSortedColumns

<MemberInfo kind="property" type={``}   />


### sortedColumns

<MemberInfo kind="property" type={``}   />


### ngOnChanges

<MemberInfo kind="method" type={`(changes: SimpleChanges) => `}   />


### ngOnDestroy

<MemberInfo kind="method" type={`() => `}   />


### ngAfterContentInit

<MemberInfo kind="method" type={`() => void`}   />


### onColumnReorder

<MemberInfo kind="method" type={`(event: { column: DataTable2ColumnComponent&#60;any&#62;; newIndex: number }) => `}   />


### onColumnsReset

<MemberInfo kind="method" type={`() => `}   />


### toggleSearchFilterRow

<MemberInfo kind="method" type={`() => `}   />


### trackByFn

<MemberInfo kind="method" type={`(index: number, item: any) => `}   />


### onToggleAllClick

<MemberInfo kind="method" type={`() => `}   />


### onRowClick

<MemberInfo kind="method" type={`(item: T, event: MouseEvent) => `}   />


### getDataTableConfig

<MemberInfo kind="method" type={`() => DataTableConfig`}   />




</div>
