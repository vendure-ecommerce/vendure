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
    get(key: string, ctx: RequestContext) => Promise<T | undefined>;
    getMany(keys: string[], ctx: RequestContext) => Promise<Record<string, JsonCompatible<any>>>;
    set(key: string, value: T, ctx: RequestContext) => Promise<SetSettingsStoreValueResult>;
    setMany(values: Record<string, JsonCompatible<any>>, ctx: RequestContext) => Promise<SetSettingsStoreValueResult[]>;
    getFieldDefinition(key: string) => SettingsStoreFieldConfig | undefined;
    validateValue(key: string, value: any, ctx: RequestContext) => Promise<string | void>;
    findOrphanedEntries(options: CleanupOrphanedSettingsStoreEntriesOptions = {}) => Promise<OrphanedSettingsStoreEntry[]>;
    cleanupOrphanedEntries(options: CleanupOrphanedSettingsStoreEntriesOptions = {}) => Promise<CleanupOrphanedSettingsStoreEntriesResult>;
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

<MemberInfo kind="method" type={`(key: string, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;T | undefined&#62;`}   />

Get a value for the specified key. The value is automatically scoped
according to the field's scope configuration.
### getMany

<MemberInfo kind="method" type={`(keys: string[], ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62;&#62;`}   />

Get multiple values efficiently. Each key is scoped according to
its individual field configuration.
### set

<MemberInfo kind="method" type={`(key: string, value: T, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/settings-store/set-settings-store-value-result#setsettingsstorevalueresult'>SetSettingsStoreValueResult</a>&#62;`}   />

Set a value for the specified key with structured result feedback.
This version returns detailed information about the success or failure
of the operation instead of throwing errors.
### setMany

<MemberInfo kind="method" type={`(values: Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62;, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/settings-store/set-settings-store-value-result#setsettingsstorevalueresult'>SetSettingsStoreValueResult</a>[]&#62;`}   />

Set multiple values with structured result feedback for each operation.
This method will not throw errors but will return
detailed results for each key-value pair.
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


</div>
