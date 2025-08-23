---
title: "SettingsStoreFieldConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SettingsStoreFieldConfig

<GenerationInfo sourceFile="packages/core/src/config/settings-store/settings-store-types.ts" sourceLine="41" packageName="@vendure/core" since="3.4.0" />

Configuration for a settings store field, defining how it should be stored,
scoped, validated, and accessed.

```ts title="Signature"
interface SettingsStoreFieldConfig {
    name: string;
    scope?: SettingsStoreScopeFunction;
    readonly?: boolean;
    requiresPermission?: Array<Permission | string> | Permission | string;
    validate?: (
        value: any,
        injector: Injector,
        ctx: RequestContext,
    ) => string | LocalizedString[] | void | Promise<string | LocalizedString[] | void>;
}
```

<div className="members-wrapper">

### name

<MemberInfo kind="property" type={`string`}   />

The name of the field. This will be combined with the namespace
to create the full key (e.g., 'dashboard.theme').
### scope

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/settings-store/settings-store-scope-function#settingsstorescopefunction'>SettingsStoreScopeFunction</a>`}   />

Function that determines how this field should be scoped.
Defaults to global scoping (no isolation).
### readonly

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

Whether this field is readonly via the GraphQL API.
Readonly fields can still be modified programmatically via a service.
### requiresPermission

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/common/permission#permission'>Permission</a> | string&#62; | <a href='/reference/typescript-api/common/permission#permission'>Permission</a> | string`}   />

Permissions required to access this field. If not specified,
basic authentication is required for admin API access.
### validate

<MemberInfo kind="property" type={`(         value: any,         injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>,         ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>,     ) =&#62; string | LocalizedString[] | void | Promise&#60;string | LocalizedString[] | void&#62;`}   />

Custom validation function for field values.


</div>
