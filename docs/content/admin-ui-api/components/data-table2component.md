---
title: "DataTable2Component"
weight: 10
date: 2023-07-14T16:57:51.179Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DataTable2Component
<div class="symbol">


# DataTable2Component

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/data-table-2/data-table2.component.ts" sourceLine="92" packageName="@vendure/admin-ui">}}

A table for displaying PaginatedList results. It is designed to be used inside components which
extend the <a href='/admin-ui-api/list-detail-views/base-list-component#baselistcomponent'>BaseListComponent</a> or <a href='/admin-ui-api/list-detail-views/typed-base-list-component#typedbaselistcomponent'>TypedBaseListComponent</a> class.

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

## Signature

```TypeScript
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
## Implements

 * AfterContentInit
 * OnChanges
 * OnDestroy


## Members

### id

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

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

### filters

{{< member-info kind="property" type="DataTableFilterCollection"  >}}

{{< member-description >}}{{< /member-description >}}

### activeIndex

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### pageChange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### itemsPerPageChange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### columns

{{< member-info kind="property" type="QueryList&#60;DataTable2ColumnComponent&#60;T&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### customFieldColumns

{{< member-info kind="property" type="QueryList&#60;DataTableCustomFieldColumnComponent&#60;T&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### searchComponent

{{< member-info kind="property" type="DataTable2SearchComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### bulkActionMenuComponent

{{< member-info kind="property" type="BulkActionMenuComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### customSearchTemplate

{{< member-info kind="property" type="TemplateRef&#60;any&#62;"  >}}

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

### showSearchFilterRow

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### uiLanguage$

{{< member-info kind="property" type="Observable&#60;<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(changeDetectorRef: ChangeDetectorRef, localStorageService: LocalStorageService, dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>) => DataTable2Component"  >}}

{{< member-description >}}{{< /member-description >}}

### selectionManager

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### allColumns

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### visibleSortedColumns

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### sortedColumns

{{< member-info kind="property" type=""  >}}

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

### onColumnReorder

{{< member-info kind="method" type="(event: { column: DataTable2ColumnComponent&#60;any&#62;; newIndex: number }) => "  >}}

{{< member-description >}}{{< /member-description >}}

### onColumnsReset

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### toggleSearchFilterRow

{{< member-info kind="method" type="() => "  >}}

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

### getDataTableConfig

{{< member-info kind="method" type="() => DataTableConfig"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
