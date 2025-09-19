---
title: "SettingsStoreService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SettingsStoreService

<GenerationInfo sourceFile="packages/core/src/service/helpers/settings-store/settings-store.service.ts" sourceLine="50" packageName="@vendure/core" since="3.4.0" />

The SettingsStoreService provides a flexible settings storage system with support for
scoping, permissions, and validation. It allows plugins and the core system to
store and retrieve configuration data with fine-grained control over access and isolation.

## Usage

Values are automatically scoped according to their field configuration:

*Example*

```ts
// In a service
const userTheme = await this.settingsStoreService.get('dashboard.theme', ctx);
await this.settingsStoreService.set('dashboard.theme', 'dark', ctx);

// Get multiple values
const settings = await this.settingsStoreService.getMany([
  'dashboard.theme',
  'dashboard.tableFilters'
], ctx);
```

```ts title="Signature"
class SettingsStoreService implements OnModuleInit {
    constructor(connection: TransactionalConnection, moduleRef: ModuleRef, configService: ConfigService)
    onModuleInit() => ;
    register(registration: SettingsStoreRegistration) => void;
    get(ctx: RequestContext, key: string) => Promise<T | undefined>;
    get(key: string, ctx: RequestContext) => Promise<T | undefined>;
    get(keyOrCtx: string | RequestContext, ctxOrKey: RequestContext | string) => Promise<T | undefined>;
    getMany(ctx: RequestContext, keys: string[]) => Promise<Record<string, JsonCompatible<any>>>;
    getMany(keys: string[], ctx: RequestContext) => Promise<Record<string, JsonCompatible<any>>>;
    getMany(keysOrCtx: string[] | RequestContext, ctxOrKeys: RequestContext | string[]) => Promise<Record<string, JsonCompatible<any>>>;
    set(ctx: RequestContext, key: string, value: T) => Promise<SetSettingsStoreValueResult>;
    set(key: string, value: T, ctx: RequestContext) => Promise<SetSettingsStoreValueResult>;
    set(keyOrCtx: string | RequestContext, keyOrValue: string | T, ctxOrValue: RequestContext | T) => Promise<SetSettingsStoreValueResult>;
    setMany(ctx: RequestContext, values: Record<string, JsonCompatible<any>>) => Promise<SetSettingsStoreValueResult[]>;
    setMany(values: Record<string, JsonCompatible<any>>, ctx: RequestContext) => Promise<SetSettingsStoreValueResult[]>;
    setMany(valuesOrCtx: Record<string, JsonCompatible<any>> | RequestContext, ctxOrValues: RequestContext | Record<string, JsonCompatible<any>>) => Promise<SetSettingsStoreValueResult[]>;
    getFieldDefinition(key: string) => SettingsStoreFieldConfig | undefined;
    validateValue(key: string, value: any, ctx: RequestContext) => Promise<string | void>;
    findOrphanedEntries(options: CleanupOrphanedSettingsStoreEntriesOptions = {}) => Promise<OrphanedSettingsStoreEntry[]>;
    cleanupOrphanedEntries(options: CleanupOrphanedSettingsStoreEntriesOptions = {}) => Promise<CleanupOrphanedSettingsStoreEntriesResult>;
    hasPermission(ctx: RequestContext, key: string) => boolean;
    isReadonly(key: string) => boolean;
}
```
* Implements: <code>OnModuleInit</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, moduleRef: ModuleRef, configService: ConfigService) => SettingsStoreService`}   />


### onModuleInit

<MemberInfo kind="method" type={`() => `}   />


### register

<MemberInfo kind="method" type={`(registration: <a href='/reference/typescript-api/settings-store/settings-store-registration#settingsstoreregistration'>SettingsStoreRegistration</a>) => void`}   />

Register settings store fields. This is typically called during application
bootstrap when processing the VendureConfig.
### get

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, key: string) => Promise&#60;T | undefined&#62;`}   />

Get a value for the specified key. The value is automatically scoped
according to the field's scope configuration.
### get

<MemberInfo kind="method" type={`(key: string, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;T | undefined&#62;`}   />


### get

<MemberInfo kind="method" type={`(keyOrCtx: string | <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ctxOrKey: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | string) => Promise&#60;T | undefined&#62;`}   />


### getMany

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, keys: string[]) => Promise&#60;Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62;&#62;`}   />

Get multiple values efficiently. Each key is scoped according to
its individual field configuration.
### getMany

<MemberInfo kind="method" type={`(keys: string[], ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62;&#62;`}   />


### getMany

<MemberInfo kind="method" type={`(keysOrCtx: string[] | <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ctxOrKeys: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | string[]) => Promise&#60;Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62;&#62;`}   />


### set

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, key: string, value: T) => Promise&#60;<a href='/reference/typescript-api/settings-store/set-settings-store-value-result#setsettingsstorevalueresult'>SetSettingsStoreValueResult</a>&#62;`}   />

Set a value for the specified key with structured result feedback.
This version returns detailed information about the success or failure
of the operation instead of throwing errors.
### set

<MemberInfo kind="method" type={`(key: string, value: T, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/settings-store/set-settings-store-value-result#setsettingsstorevalueresult'>SetSettingsStoreValueResult</a>&#62;`}   />


### set

<MemberInfo kind="method" type={`(keyOrCtx: string | <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, keyOrValue: string | T, ctxOrValue: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | T) => Promise&#60;<a href='/reference/typescript-api/settings-store/set-settings-store-value-result#setsettingsstorevalueresult'>SetSettingsStoreValueResult</a>&#62;`}   />


### setMany

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, values: Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62;) => Promise&#60;<a href='/reference/typescript-api/settings-store/set-settings-store-value-result#setsettingsstorevalueresult'>SetSettingsStoreValueResult</a>[]&#62;`}   />

Set multiple values with structured result feedback for each operation.
This method will not throw errors but will return
detailed results for each key-value pair.
### setMany

<MemberInfo kind="method" type={`(values: Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62;, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/settings-store/set-settings-store-value-result#setsettingsstorevalueresult'>SetSettingsStoreValueResult</a>[]&#62;`}   />


### setMany

<MemberInfo kind="method" type={`(valuesOrCtx: Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62; | <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ctxOrValues: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62;) => Promise&#60;<a href='/reference/typescript-api/settings-store/set-settings-store-value-result#setsettingsstorevalueresult'>SetSettingsStoreValueResult</a>[]&#62;`}   />


### getFieldDefinition

<MemberInfo kind="method" type={`(key: string) => <a href='/reference/typescript-api/settings-store/settings-store-field-config#settingsstorefieldconfig'>SettingsStoreFieldConfig</a> | undefined`}   />

Get the field configuration for a key.
### validateValue

<MemberInfo kind="method" type={`(key: string, value: any, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;string | void&#62;`}   />

Validate a value against its field definition.
### findOrphanedEntries

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/settings-store/cleanup-orphaned-settings-store-entries-options#cleanuporphanedsettingsstoreentriesoptions'>CleanupOrphanedSettingsStoreEntriesOptions</a> = {}) => Promise&#60;<a href='/reference/typescript-api/settings-store/orphaned-settings-store-entry#orphanedsettingsstoreentry'>OrphanedSettingsStoreEntry</a>[]&#62;`}   />

Find orphaned settings store entries that no longer have corresponding field definitions.
### cleanupOrphanedEntries

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/settings-store/cleanup-orphaned-settings-store-entries-options#cleanuporphanedsettingsstoreentriesoptions'>CleanupOrphanedSettingsStoreEntriesOptions</a> = {}) => Promise&#60;<a href='/reference/typescript-api/settings-store/cleanup-orphaned-settings-store-entries-result#cleanuporphanedsettingsstoreentriesresult'>CleanupOrphanedSettingsStoreEntriesResult</a>&#62;`}   />

Clean up orphaned settings store entries from the database.
### hasPermission

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, key: string) => boolean`}   />

Check if the current user has permission to access a field.
This is not called internally in the get and set methods, so should
be used by any methods which are exposing these methods via the GraphQL
APIs.
### isReadonly

<MemberInfo kind="method" type={`(key: string) => boolean`}   />

Returns true if the settings field has the `readonly: true` configuration.


</div>
