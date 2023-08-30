---
title: "EntityIdStrategy"
weight: 10
date: 2023-07-14T16:57:49.530Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EntityIdStrategy
<div class="symbol">


# AutoIncrementIdStrategy

{{< generation-info sourceFile="packages/core/src/config/entity/auto-increment-id-strategy.ts" sourceLine="11" packageName="@vendure/core">}}

An id strategy which uses auto-increment integers as primary keys
for all entities. This is the default strategy used by Vendure.

## Signature

```TypeScript
class AutoIncrementIdStrategy implements EntityIdStrategy<'increment'> {
  readonly readonly primaryKeyType = 'increment';
  decodeId(id: string) => number;
  encodeId(primaryKey: number) => string;
}
```
## Implements

 * <a href='/typescript-api/configuration/entity-id-strategy#entityidstrategy'>EntityIdStrategy</a>&#60;'increment'&#62;


## Members

### primaryKeyType

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### decodeId

{{< member-info kind="method" type="(id: string) => number"  >}}

{{< member-description >}}{{< /member-description >}}

### encodeId

{{< member-info kind="method" type="(primaryKey: number) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# EntityIdStrategy

{{< generation-info sourceFile="packages/core/src/config/entity/entity-id-strategy.ts" sourceLine="25" packageName="@vendure/core">}}

The EntityIdStrategy determines how entity IDs are generated and stored in the
database, as well as how they are transformed when being passed from the API to the
service layer and vice versa.

Vendure ships with two strategies: <a href='/typescript-api/configuration/entity-id-strategy#autoincrementidstrategy'>AutoIncrementIdStrategy</a> and <a href='/typescript-api/configuration/entity-id-strategy#uuididstrategy'>UuidIdStrategy</a>,
but custom strategies can be used, e.g. to apply some custom encoding to the ID before exposing
it in the GraphQL API.

{{% alert "warning" %}}
Note: changing from an integer-based strategy to a uuid-based strategy
on an existing Vendure database will lead to problems with broken foreign-key
references. To change primary key types like this, you'll need to start with
a fresh database.
{{% /alert %}}

## Signature

```TypeScript
interface EntityIdStrategy<T extends 'increment' | 'uuid'> extends InjectableStrategy {
  readonly primaryKeyType: T;
  encodeId: (primaryKey: PrimaryKeyType<T>) => string;
  decodeId: (id: string) => PrimaryKeyType<T>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### primaryKeyType

{{< member-info kind="property" type="T"  >}}

{{< member-description >}}Defines how the primary key will be stored in the database - either
`'increment'` for auto-increment integer IDs, or `'uuid'` for a unique
string ID.{{< /member-description >}}

### encodeId

{{< member-info kind="property" type="(primaryKey: PrimaryKeyType&#60;T&#62;) =&#62; string"  >}}

{{< member-description >}}Allows the raw ID from the database to be transformed in some way before exposing
it in the GraphQL API.

For example, you may need to use auto-increment integer IDs due to some business
constraint, but you may not want to expose this data publicly in your API. In this
case, you can use the encode/decode methods to obfuscate the ID with some kind of
encoding scheme, such as base64 (or something more sophisticated).{{< /member-description >}}

### decodeId

{{< member-info kind="property" type="(id: string) =&#62; PrimaryKeyType&#60;T&#62;"  >}}

{{< member-description >}}Reverses the transformation performed by the `encodeId` method in order to get
back to the raw ID value.{{< /member-description >}}


</div>
<div class="symbol">


# UuidIdStrategy

{{< generation-info sourceFile="packages/core/src/config/entity/uuid-id-strategy.ts" sourceLine="25" packageName="@vendure/core">}}

An id strategy which uses string uuids as primary keys
for all entities. This strategy can be configured with the
`entityIdStrategy` property of the `entityOptions` property
of <a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>.

*Example*

```TypeScript
import { UuidIdStrategy, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
  entityOptions: {
    entityIdStrategy: new UuidIdStrategy(),
    // ...
  }
}
```

## Signature

```TypeScript
class UuidIdStrategy implements EntityIdStrategy<'uuid'> {
  readonly readonly primaryKeyType = 'uuid';
  decodeId(id: string) => string;
  encodeId(primaryKey: string) => string;
}
```
## Implements

 * <a href='/typescript-api/configuration/entity-id-strategy#entityidstrategy'>EntityIdStrategy</a>&#60;'uuid'&#62;


## Members

### primaryKeyType

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### decodeId

{{< member-info kind="method" type="(id: string) => string"  >}}

{{< member-description >}}{{< /member-description >}}

### encodeId

{{< member-info kind="method" type="(primaryKey: string) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
