---
title: "BaseListComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BaseListComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/common/base-list.component.ts" sourceLine="40" packageName="@vendure/admin-ui" />

This is a base class which implements the logic required to fetch and manipulate
a list of data from a query which returns a PaginatedList type.

It is normally used in combination with the <a href='/reference/admin-ui-api/components/data-table2component#datatable2component'>DataTable2Component</a>.

```ts title="Signature"
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
    protected destroy$ = new Subject<void>();
    protected refresh$ = new BehaviorSubject<undefined>(undefined);
    constructor(router: Router, route: ActivatedRoute)
    setQueryFn(listQueryFn: ListQueryFn<ResultType>, mappingFn: MappingFn<ItemType, ResultType>, onPageChangeFn?: OnPageChangeFn<VariableType>, defaults?: { take: number; skip: number }) => ;
    refreshListOnChanges(streams: Array<Observable<any>>) => ;
    setPageNumber(page: number) => ;
    setItemsPerPage(perPage: number) => ;
    refresh() => ;
    setQueryParam(hash: { [key: string]: any }, options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => ;
    setQueryParam(key: string, value: any, options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => ;
    setQueryParam(keyOrHash: string | { [key: string]: any }, valueOrOptions?: any, maybeOptions?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => ;
}
```
* Implements: <code>OnInit</code>, <code>OnDestroy</code>



<div className="members-wrapper">

### searchTermControl

<MemberInfo kind="property" type={``}   />


### selectionManager

<MemberInfo kind="property" type={``}   />


### result$

<MemberInfo kind="property" type={`Observable&#60;ResultType&#62;`}   />


### items$

<MemberInfo kind="property" type={`Observable&#60;ItemType[]&#62;`}   />


### totalItems$

<MemberInfo kind="property" type={`Observable&#60;number&#62;`}   />


### itemsPerPage$

<MemberInfo kind="property" type={`Observable&#60;number&#62;`}   />


### currentPage$

<MemberInfo kind="property" type={`Observable&#60;number&#62;`}   />


### destroy$

<MemberInfo kind="property" type={``}   />


### refresh$

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(router: Router, route: ActivatedRoute) => BaseListComponent`}   />


### setQueryFn

<MemberInfo kind="method" type={`(listQueryFn: ListQueryFn&#60;ResultType&#62;, mappingFn: MappingFn&#60;ItemType, ResultType&#62;, onPageChangeFn?: OnPageChangeFn&#60;VariableType&#62;, defaults?: { take: number; skip: number }) => `}   />

Sets the fetch function for the list being implemented.
### refreshListOnChanges

<MemberInfo kind="method" type={`(streams: Array&#60;Observable&#60;any&#62;&#62;) => `}   />

Accepts a list of Observables which will trigger a refresh of the list when any of them emit.
### setPageNumber

<MemberInfo kind="method" type={`(page: number) => `}   />

Sets the current page number in the url.
### setItemsPerPage

<MemberInfo kind="method" type={`(perPage: number) => `}   />

Sets the number of items per page in the url.
### refresh

<MemberInfo kind="method" type={`() => `}   />

Re-fetch the current page of results.
### setQueryParam

<MemberInfo kind="method" type={`(hash: { [key: string]: any }, options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => `}   />


### setQueryParam

<MemberInfo kind="method" type={`(key: string, value: any, options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => `}   />


### setQueryParam

<MemberInfo kind="method" type={`(keyOrHash: string | { [key: string]: any }, valueOrOptions?: any, maybeOptions?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling }) => `}   />




</div>
