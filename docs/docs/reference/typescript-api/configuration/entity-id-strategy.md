---
title: "EntityIdStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AutoIncrementIdStrategy

<GenerationInfo sourceFile="packages/core/src/config/entity/auto-increment-id-strategy.ts" sourceLine="11" packageName="@vendure/core" />

An id strategy which uses auto-increment integers as primary keys
for all entities. This is the default strategy used by Vendure.

```ts title="Signature"
class AutoIncrementIdStrategy implements EntityIdStrategy<'increment'> {
    readonly primaryKeyType = 'increment';
    decodeId(id: string) => number;
    encodeId(primaryKey: number) => string;
}
```
* Implements: <code><a href='/reference/typescript-api/configuration/entity-id-strategy#entityidstrategy'>EntityIdStrategy</a>&#60;'increment'&#62;</code>



<div className="members-wrapper">

### primaryKeyType

<MemberInfo kind="property" type={``}   />


### decodeId

<MemberInfo kind="method" type={`(id: string) => number`}   />


### encodeId

<MemberInfo kind="method" type={`(primaryKey: number) => string`}   />




</div>


## EntityIdStrategy

<GenerationInfo sourceFile="packages/core/src/config/entity/entity-id-strategy.ts" sourceLine="32" packageName="@vendure/core" />

The EntityIdStrategy determines how entity IDs are generated and stored in the
database, as well as how they are transformed when being passed from the API to the
service layer and vice versa.

Vendure ships with two strategies: <a href='/reference/typescript-api/configuration/entity-id-strategy#autoincrementidstrategy'>AutoIncrementIdStrategy</a> and <a href='/reference/typescript-api/configuration/entity-id-strategy#uuididstrategy'>UuidIdStrategy</a>,
but custom strategies can be used, e.g. to apply some custom encoding to the ID before exposing
it in the GraphQL API.

:::info

This is configured via the `entityOptions.entityIdStrategy` property of
your VendureConfig.

:::

:::caution
Note: changing from an integer-based strategy to a uuid-based strategy
on an existing Vendure database will lead to problems with broken foreign-key
references. To change primary key types like this, you'll need to start with
a fresh database.
:::

```ts title="Signature"
interface EntityIdStrategy<T extends 'increment' | 'uuid'> extends InjectableStrategy {
    readonly primaryKeyType: T;
    encodeId: (primaryKey: PrimaryKeyType<T>) => string;
    decodeId: (id: string) => PrimaryKeyType<T>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### primaryKeyType

<MemberInfo kind="property" type={`T`}   />

Defines how the primary key will be stored in the database - either
`'increment'` for auto-increment integer IDs, or `'uuid'` for a unique
string ID.
### encodeId

<MemberInfo kind="property" type={`(primaryKey: PrimaryKeyType&#60;T&#62;) =&#62; string`}   />

Allows the raw ID from the database to be transformed in some way before exposing
it in the GraphQL API.

For example, you may need to use auto-increment integer IDs due to some business
constraint, but you may not want to expose this data publicly in your API. In this
case, you can use the encode/decode methods to obfuscate the ID with some kind of
encoding scheme, such as base64 (or something more sophisticated).
### decodeId

<MemberInfo kind="property" type={`(id: string) =&#62; PrimaryKeyType&#60;T&#62;`}   />

Reverses the transformation performed by the `encodeId` method in order to get
back to the raw ID value.


</div>


## UuidIdStrategy

<GenerationInfo sourceFile="packages/core/src/config/entity/uuid-id-strategy.ts" sourceLine="25" packageName="@vendure/core" />

An id strategy which uses string uuids as primary keys
for all entities. This strategy can be configured with the
`entityIdStrategy` property of the `entityOptions` property
of <a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>.

*Example*

```ts
import { UuidIdStrategy, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
  entityOptions: {
    entityIdStrategy: new UuidIdStrategy(),
    // ...
  }
}
```

```ts title="Signature"
class UuidIdStrategy implements EntityIdStrategy<'uuid'> {
    readonly primaryKeyType = 'uuid';
    decodeId(id: string) => string;
    encodeId(primaryKey: string) => string;
}
```
* Implements: <code><a href='/reference/typescript-api/configuration/entity-id-strategy#entityidstrategy'>EntityIdStrategy</a>&#60;'uuid'&#62;</code>



<div className="members-wrapper">

### primaryKeyType

<MemberInfo kind="property" type={``}   />


### decodeId

<MemberInfo kind="method" type={`(id: string) => string`}   />


### encodeId

<MemberInfo kind="method" type={`(primaryKey: string) => string`}   />




</div>
