---
title: "AssetPickerDialogComponent"
weight: 10
date: 2023-07-14T16:57:51.138Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AssetPickerDialogComponent
<div class="symbol">


# AssetPickerDialogComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/asset-picker-dialog/asset-picker-dialog.component.ts" sourceLine="52" packageName="@vendure/admin-ui">}}

A dialog which allows the creation and selection of assets.

*Example*

```TypeScript
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

## Signature

```TypeScript
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
## Implements

 * OnInit
 * AfterViewInit
 * OnDestroy
 * <a href='/admin-ui-api/providers/modal-service#dialog'>Dialog</a>&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>[]&#62;


## Members

### assets$

{{< member-info kind="property" type="Observable&#60;AssetLike[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### allTags$

{{< member-info kind="property" type="Observable&#60;TagFragment[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### paginationConfig

{{< member-info kind="property" type="PaginationInstance"  >}}

{{< member-description >}}{{< /member-description >}}

### multiSelect

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### initialTags

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}{{< /member-description >}}

### resolveWith

{{< member-info kind="property" type="(result?: <a href='/typescript-api/entities/asset#asset'>Asset</a>[]) =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### selection

{{< member-info kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### searchTerm$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### filterByTags$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### uploading

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, notificationService: <a href='/admin-ui-api/providers/notification-service#notificationservice'>NotificationService</a>) => AssetPickerDialogComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### ngAfterViewInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnDestroy

{{< member-info kind="method" type="() => void"  >}}

{{< member-description >}}{{< /member-description >}}

### pageChange

{{< member-info kind="method" type="(page: number) => "  >}}

{{< member-description >}}{{< /member-description >}}

### itemsPerPageChange

{{< member-info kind="method" type="(itemsPerPage: number) => "  >}}

{{< member-description >}}{{< /member-description >}}

### cancel

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### select

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### createAssets

{{< member-info kind="method" type="(files: File[]) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
