---
title: "BaseListComponent"
weight: 10
date: 2023-07-14T16:57:51.048Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# BaseListComponent
<div class="symbol">


# BaseListComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/common/base-list.component.ts" sourceLine="39" packageName="@vendure/admin-ui">}}

This is a base class which implements the logic required to fetch and manipulate
a list of data from a query which returns a PaginatedList type.

It is normally used in combination with the <a href='/admin-ui-api/components/data-table2component#datatable2component'>DataTable2Component</a>.

## Signature

```TypeScript
class BaseListComponent<ResultType, ItemType, VariableType extends Record<string, any> = any> implements OnInit, OnDestroy {
  searchTermControl = new FormControl('');
  selectionManager = new SelectionManager<any>({
        multiSelect: true,
        itemsAreEqual: (a, b) => a.id === b.id,
        additiveMode: true,
    });
  result$: Observable<ResultType>;
  items$: Observable<ItemType[]>;
  totalItems$: Observable<number>;
  itemsPerPage$: Observable<number>;
  currentPage$: Observable<number>;
  protected protected destroy$ = new Subject<void>();
  protected protected refresh$ = new BehaviorSubject<undefined>(undefined);
  constructor(router: Router, route: ActivatedRoute)
  setQueryFn(listQueryFn: ListQueryFn<ResultType>, mappingFn: MappingFn<ItemType, ResultType>, onPageChangeFn?: OnPageChangeFn<VariableType>, defaults?: { take: number; skip: number }) => ;
  protected refreshListOnChanges(streams: Array<Observable<any>>) => ;
  setPageNumber(page: number) => ;
  setItemsPerPage(perPage: number) => ;
  refresh() => ;
  protected setQueryParam(hash: { [key: string]: any }, options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => ;
  protected setQueryParam(key: string, value: any, options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => ;
  protected setQueryParam(keyOrHash: string | { [key: string]: any }, valueOrOptions?: any, maybeOptions?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => ;
}
```
## Implements

 * OnInit
 * OnDestroy


## Members

### searchTermControl

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### selectionManager

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### result$

{{< member-info kind="property" type="Observable&#60;ResultType&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### items$

{{< member-info kind="property" type="Observable&#60;ItemType[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### totalItems$

{{< member-info kind="property" type="Observable&#60;number&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### itemsPerPage$

{{< member-info kind="property" type="Observable&#60;number&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### currentPage$

{{< member-info kind="property" type="Observable&#60;number&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### destroy$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### refresh$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(router: Router, route: ActivatedRoute) => BaseListComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### setQueryFn

{{< member-info kind="method" type="(listQueryFn: ListQueryFn&#60;ResultType&#62;, mappingFn: MappingFn&#60;ItemType, ResultType&#62;, onPageChangeFn?: OnPageChangeFn&#60;VariableType&#62;, defaults?: { take: number; skip: number }) => "  >}}

{{< member-description >}}Sets the fetch function for the list being implemented.{{< /member-description >}}

### refreshListOnChanges

{{< member-info kind="method" type="(streams: Array&#60;Observable&#60;any&#62;&#62;) => "  >}}

{{< member-description >}}Accepts a list of Observables which will trigger a refresh of the list when any of them emit.{{< /member-description >}}

### setPageNumber

{{< member-info kind="method" type="(page: number) => "  >}}

{{< member-description >}}Sets the current page number in the url.{{< /member-description >}}

### setItemsPerPage

{{< member-info kind="method" type="(perPage: number) => "  >}}

{{< member-description >}}Sets the number of items per page in the url.{{< /member-description >}}

### refresh

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}Re-fetch the current page of results.{{< /member-description >}}

### setQueryParam

{{< member-info kind="method" type="(hash: { [key: string]: any }, options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setQueryParam

{{< member-info kind="method" type="(key: string, value: any, options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setQueryParam

{{< member-info kind="method" type="(keyOrHash: string | { [key: string]: any }, valueOrOptions?: any, maybeOptions?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
