---
title: "TypedBaseListComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TypedBaseListComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/common/base-list.component.ts" sourceLine="199" packageName="@vendure/admin-ui" />

A version of the <a href='/reference/admin-ui-api/list-detail-views/base-list-component#baselistcomponent'>BaseListComponent</a> which is designed to be used with a
[TypedDocumentNode](https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node).

```ts title="Signature"
class TypedBaseListComponent<T extends TypedDocumentNode<any, Vars>, Field extends keyof ResultOf<T>, Vars extends { options: { filter: any; sort: any } } = VariablesOf<T>> extends BaseListComponent<ResultOf<T>, ItemOf<ResultOf<T>, Field>, VariablesOf<T>> implements OnInit {
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    protected dataService = inject(DataService);
    protected router = inject(Router);
    protected serverConfigService = inject(ServerConfigService);
    protected permissionsService = inject(PermissionsService);
    constructor()
    configure(config: {
        document: T;
        getItems: (data: ResultOf<T>) => { items: Array<ItemOf<ResultOf<T>, Field>>; totalItems: number };
        setVariables?: (skip: number, take: number) => VariablesOf<T>;
        refreshListOnChanges?: Array<Observable<any>>;
    }) => ;
    ngOnInit() => ;
    createFilterCollection() => DataTableFilterCollection<NonNullable<NonNullable<Vars['options']>['filter']>>;
    createSortCollection() => DataTableSortCollection<NonNullable<NonNullable<Vars['options']>['sort']>>;
    setLanguage(code: LanguageCode) => ;
    getCustomFieldConfig(key: Exclude<keyof CustomFields, '__typename'> | string) => CustomFieldConfig[];
}
```
* Extends: <code><a href='/reference/admin-ui-api/list-detail-views/base-list-component#baselistcomponent'>BaseListComponent</a>&#60;ResultOf&#60;T&#62;, ItemOf&#60;ResultOf&#60;T&#62;, Field&#62;, VariablesOf&#60;T&#62;&#62;</code>


* Implements: <code>OnInit</code>



<div className="members-wrapper">

### availableLanguages$

<MemberInfo kind="property" type={`Observable&#60;<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]&#62;`}   />


### contentLanguage$

<MemberInfo kind="property" type={`Observable&#60;<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>&#62;`}   />


### dataService

<MemberInfo kind="property" type={``}   />


### router

<MemberInfo kind="property" type={``}   />


### serverConfigService

<MemberInfo kind="property" type={``}   />


### permissionsService

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`() => TypedBaseListComponent`}   />


### configure

<MemberInfo kind="method" type={`(config: {         document: T;         getItems: (data: ResultOf&#60;T&#62;) =&#62; { items: Array&#60;ItemOf&#60;ResultOf&#60;T&#62;, Field&#62;&#62;; totalItems: number };         setVariables?: (skip: number, take: number) =&#62; VariablesOf&#60;T&#62;;         refreshListOnChanges?: Array&#60;Observable&#60;any&#62;&#62;;     }) => `}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />


### createFilterCollection

<MemberInfo kind="method" type={`() => DataTableFilterCollection&#60;NonNullable&#60;NonNullable&#60;Vars['options']&#62;['filter']&#62;&#62;`}   />


### createSortCollection

<MemberInfo kind="method" type={`() => DataTableSortCollection&#60;NonNullable&#60;NonNullable&#60;Vars['options']&#62;['sort']&#62;&#62;`}   />


### setLanguage

<MemberInfo kind="method" type={`(code: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => `}   />


### getCustomFieldConfig

<MemberInfo kind="method" type={`(key: Exclude&#60;keyof <a href='/reference/typescript-api/custom-fields/#customfields'>CustomFields</a>, '__typename'&#62; | string) => <a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />




</div>
