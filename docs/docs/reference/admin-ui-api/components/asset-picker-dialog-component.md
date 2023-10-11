---
title: "AssetPickerDialogComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetPickerDialogComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/asset-picker-dialog/asset-picker-dialog.component.ts" sourceLine="52" packageName="@vendure/admin-ui" />

A dialog which allows the creation and selection of assets.

*Example*

```ts
selectAssets() {
  this.modalService
    .fromComponent(AssetPickerDialogComponent, {
        size: 'xl',
    })
    .subscribe(result => {
        if (result && result.length) {
            // ...
        }
    });
}
```

```ts title="Signature"
class AssetPickerDialogComponent implements OnInit, AfterViewInit, OnDestroy, Dialog<Asset[]> {
    assets$: Observable<AssetLike[]>;
    allTags$: Observable<TagFragment[]>;
    paginationConfig: PaginationInstance = {
        currentPage: 1,
        itemsPerPage: 25,
        totalItems: 1,
    };
    multiSelect = true;
    initialTags: string[] = [];
    resolveWith: (result?: Asset[]) => void;
    selection: Asset[] = [];
    searchTerm$ = new BehaviorSubject<string | undefined>(undefined);
    filterByTags$ = new BehaviorSubject<TagFragment[] | undefined>(undefined);
    uploading = false;
    constructor(dataService: DataService, notificationService: NotificationService)
    ngOnInit() => ;
    ngAfterViewInit() => ;
    ngOnDestroy() => void;
    pageChange(page: number) => ;
    itemsPerPageChange(itemsPerPage: number) => ;
    cancel() => ;
    select() => ;
    createAssets(files: File[]) => ;
}
```
* Implements: <code>OnInit</code>, <code>AfterViewInit</code>, <code>OnDestroy</code>, <code><a href='/reference/admin-ui-api/services/modal-service#dialog'>Dialog</a>&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[]&#62;</code>



<div className="members-wrapper">

### assets$

<MemberInfo kind="property" type={`Observable&#60;AssetLike[]&#62;`}   />


### allTags$

<MemberInfo kind="property" type={`Observable&#60;TagFragment[]&#62;`}   />


### paginationConfig

<MemberInfo kind="property" type={`PaginationInstance`}   />


### multiSelect

<MemberInfo kind="property" type={``}   />


### initialTags

<MemberInfo kind="property" type={`string[]`}   />


### resolveWith

<MemberInfo kind="property" type={`(result?: <a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[]) =&#62; void`}   />


### selection

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[]`}   />


### searchTerm$

<MemberInfo kind="property" type={``}   />


### filterByTags$

<MemberInfo kind="property" type={``}   />


### uploading

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>, notificationService: <a href='/reference/admin-ui-api/services/notification-service#notificationservice'>NotificationService</a>) => AssetPickerDialogComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />


### ngAfterViewInit

<MemberInfo kind="method" type={`() => `}   />


### ngOnDestroy

<MemberInfo kind="method" type={`() => void`}   />


### pageChange

<MemberInfo kind="method" type={`(page: number) => `}   />


### itemsPerPageChange

<MemberInfo kind="method" type={`(itemsPerPage: number) => `}   />


### cancel

<MemberInfo kind="method" type={`() => `}   />


### select

<MemberInfo kind="method" type={`() => `}   />


### createAssets

<MemberInfo kind="method" type={`(files: File[]) => `}   />




</div>
