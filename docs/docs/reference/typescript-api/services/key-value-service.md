---
title: "KeyValueService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## KeyValueService

<GenerationInfo sourceFile="packages/core/src/service/helpers/key-value/key-value.service.ts" sourceLine="50" packageName="@vendure/core" since="3.4.0" />

The KeyValueService provides a flexible key-value storage system with support for
scoping, permissions, and validation. It allows plugins and the core system to
store and retrieve configuration data with fine-grained control over access and isolation.

## Usage

Values are automatically scoped according to their field configuration:

*Example*

```ts
// In a service
const userTheme = await this.keyValueService.get('dashboard.theme', ctx);
await this.keyValueService.set('dashboard.theme', 'dark', ctx);

// Get multiple values
const settings = await this.keyValueService.getMany([
  'dashboard.theme',
  'dashboard.tableFilters'
], ctx);
```

```ts title="Signature"
class KeyValueService implements OnModuleInit {
    constructor(connection: TransactionalConnection, moduleRef: ModuleRef, configService: ConfigService)
    onModuleInit() => ;
    register(registration: KeyValueRegistration) => void;
    get(key: string, ctx: RequestContext) => Promise<T | undefined>;
    getMany(keys: string[], ctx: RequestContext) => Promise<Record<string, JsonCompatible<any>>>;
    set(key: string, value: T, ctx: RequestContext) => Promise<SetKeyValueResult>;
    setMany(values: Record<string, JsonCompatible<any>>, ctx: RequestContext) => Promise<SetKeyValueResult[]>;
    getFieldDefinition(key: string) => KeyValueFieldConfig | undefined;
    validateValue(key: string, value: any, ctx: RequestContext) => Promise<string | void>;
    findOrphanedEntries(options: CleanupOrphanedEntriesOptions = {}) => Promise<OrphanedKeyValueEntry[]>;
    cleanupOrphanedEntries(options: CleanupOrphanedEntriesOptions = {}) => Promise<CleanupOrphanedEntriesResult>;
}
```
* Implements: <code>OnModuleInit</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, moduleRef: ModuleRef, configService: ConfigService) => KeyValueService`}   />


### onModuleInit

<MemberInfo kind="method" type={`() => `}   />


### register

<MemberInfo kind="method" type={`(registration: <a href='/reference/typescript-api/key-value-storage/key-value-registration#keyvalueregistration'>KeyValueRegistration</a>) => void`}   />

Register key-value fields. This is typically called during application
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

<MemberInfo kind="method" type={`(key: string, value: T, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/key-value-storage/set-key-value-result#setkeyvalueresult'>SetKeyValueResult</a>&#62;`}   />

Set a value for the specified key with structured result feedback.
This version returns detailed information about the success or failure
of the operation instead of throwing errors.
### setMany

<MemberInfo kind="method" type={`(values: Record&#60;string, <a href='/reference/typescript-api/common/json-compatible#jsoncompatible'>JsonCompatible</a>&#60;any&#62;&#62;, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/key-value-storage/set-key-value-result#setkeyvalueresult'>SetKeyValueResult</a>[]&#62;`}   />

Set multiple values with structured result feedback for each operation.
Unlike setMany, this method will not throw errors but will return
detailed results for each key-value pair.
### getFieldDefinition

<MemberInfo kind="method" type={`(key: string) => <a href='/reference/typescript-api/key-value-storage/key-value-field-config#keyvaluefieldconfig'>KeyValueFieldConfig</a> | undefined`}   />

Get the field configuration for a key.
### validateValue

<MemberInfo kind="method" type={`(key: string, value: any, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;string | void&#62;`}   />

Validate a value against its field definition.
### findOrphanedEntries

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/key-value-storage/cleanup-orphaned-entries-options#cleanuporphanedentriesoptions'>CleanupOrphanedEntriesOptions</a> = {}) => Promise&#60;<a href='/reference/typescript-api/key-value-storage/orphaned-key-value-entry#orphanedkeyvalueentry'>OrphanedKeyValueEntry</a>[]&#62;`}   />

Find orphaned key-value entries that no longer have corresponding field definitions.
### cleanupOrphanedEntries

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/key-value-storage/cleanup-orphaned-entries-options#cleanuporphanedentriesoptions'>CleanupOrphanedEntriesOptions</a> = {}) => Promise&#60;<a href='/reference/typescript-api/key-value-storage/cleanup-orphaned-entries-result#cleanuporphanedentriesresult'>CleanupOrphanedEntriesResult</a>&#62;`}   />

Clean up orphaned key-value entries from the database.


</div>
