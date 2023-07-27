---
title: "TypedBaseListComponent"
weight: 10
date: 2023-07-14T16:57:51.061Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TypedBaseListComponent
<div class="symbol">


# TypedBaseListComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/common/base-list.component.ts" sourceLine="199" packageName="@vendure/admin-ui">}}

A version of the <a href='/admin-ui-api/list-detail-views/base-list-component#baselistcomponent'>BaseListComponent</a> which is designed to be used with a
[TypedDocumentNode](https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node).

## Signature

```TypeScript
class TypedBaseListComponent<T extends TypedDocumentNode<any, Vars>, Field extends keyof ResultOf<T>, Vars extends { options: { filter: any; sort: any } } = VariablesOf<T>> extends BaseListComponent<ResultOf<T>, ItemOf<ResultOf<T>, Field>, VariablesOf<T>> implements OnInit {
  availableLanguages$: Observable<LanguageCode[]>;
  contentLanguage$: Observable<LanguageCode>;
  protected protected dataService = inject(DataService);
  protected protected router = inject(Router);
  protected protected serverConfigService = inject(ServerConfigService);
  constructor()
  protected configure(config: {
        document: T;
        getItems: (data: ResultOf<T>) => { items: Array<ItemOf<ResultOf<T>, Field>>; totalItems: number };
        setVariables?: (skip: number, take: number) => VariablesOf<T>;
        refreshListOnChanges?: Array<Observable<any>>;
    }) => ;
  ngOnInit() => ;
  createFilterCollection() => DataTableFilterCollection<NonNullable<NonNullable<Vars['options']>['filter']>>;
  createSortCollection() => DataTableSortCollection<NonNullable<NonNullable<Vars['options']>['sort']>>;
  setLanguage(code: LanguageCode) => ;
  getCustomFieldConfig(key: Exclude<keyof CustomFields, '__typename'>) => CustomFieldConfig[];
}
```
## Extends

 * <a href='/admin-ui-api/list-detail-views/base-list-component#baselistcomponent'>BaseListComponent</a>&#60;ResultOf&#60;T&#62;, ItemOf&#60;ResultOf&#60;T&#62;, Field&#62;, VariablesOf&#60;T&#62;&#62;


## Implements

 * OnInit


## Members

### availableLanguages$

{{< member-info kind="property" type="Observable&#60;<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### contentLanguage$

{{< member-info kind="property" type="Observable&#60;<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### dataService

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### router

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### serverConfigService

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="() => TypedBaseListComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### configure

{{< member-info kind="method" type="(config: {         document: T;         getItems: (data: ResultOf&#60;T&#62;) =&#62; { items: Array&#60;ItemOf&#60;ResultOf&#60;T&#62;, Field&#62;&#62;; totalItems: number };         setVariables?: (skip: number, take: number) =&#62; VariablesOf&#60;T&#62;;         refreshListOnChanges?: Array&#60;Observable&#60;any&#62;&#62;;     }) => "  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### createFilterCollection

{{< member-info kind="method" type="() => DataTableFilterCollection&#60;NonNullable&#60;NonNullable&#60;Vars['options']&#62;['filter']&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createSortCollection

{{< member-info kind="method" type="() => DataTableSortCollection&#60;NonNullable&#60;NonNullable&#60;Vars['options']&#62;['sort']&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### setLanguage

{{< member-info kind="method" type="(code: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### getCustomFieldConfig

{{< member-info kind="method" type="(key: Exclude&#60;keyof <a href='/typescript-api/custom-fields/#customfields'>CustomFields</a>, '__typename'&#62;) => <a href='/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
