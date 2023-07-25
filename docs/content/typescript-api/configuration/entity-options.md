---
title: "EntityOptions"
weight: 10
date: 2023-07-14T16:57:49.542Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EntityOptions
<div class="symbol">


# EntityOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="913" packageName="@vendure/core" since="1.3.0">}}

Options relating to the internal handling of entities.

## Signature

```TypeScript
interface EntityOptions {
  entityIdStrategy?: EntityIdStrategy<any>;
  moneyStrategy?: MoneyStrategy;
  channelCacheTtl?: number;
  zoneCacheTtl?: number;
  taxRateCacheTtl?: number;
  metadataModifiers?: EntityMetadataModifier[];
}
```
## Members

### entityIdStrategy

{{< member-info kind="property" type="<a href='/typescript-api/configuration/entity-id-strategy#entityidstrategy'>EntityIdStrategy</a>&#60;any&#62;" default="<a href='/typescript-api/configuration/entity-id-strategy#autoincrementidstrategy'>AutoIncrementIdStrategy</a>"  since="1.3.0" >}}

{{< member-description >}}Defines the strategy used for both storing the primary keys of entities
in the database, and the encoding & decoding of those ids when exposing
entities via the API. The default uses a simple auto-increment integer
strategy.

{{% alert "warning" %}}
Note: changing from an integer-based strategy to a uuid-based strategy
on an existing Vendure database will lead to problems with broken foreign-key
references. To change primary key types like this, you'll need to start with
a fresh database.
{{% /alert %}}{{< /member-description >}}

### moneyStrategy

{{< member-info kind="property" type="<a href='/typescript-api/money/money-strategy#moneystrategy'>MoneyStrategy</a>" default="<a href='/typescript-api/money/default-money-strategy#defaultmoneystrategy'>DefaultMoneyStrategy</a>"  since="2.0.0" >}}

{{< member-description >}}Defines the strategy used to store and round monetary values.{{< /member-description >}}

### channelCacheTtl

{{< member-info kind="property" type="number" default="30000"  since="1.3.0" >}}

{{< member-description >}}Channels get cached in-memory as they are accessed very frequently. This
setting determines how long the cache lives (in ms) until it is considered stale and
refreshed. For multi-instance deployments (e.g. serverless, load-balanced), a
smaller value here will prevent data inconsistencies between instances.{{< /member-description >}}

### zoneCacheTtl

{{< member-info kind="property" type="number" default="30000"  since="1.3.0" >}}

{{< member-description >}}Zones get cached in-memory as they are accessed very frequently. This
setting determines how long the cache lives (in ms) until it is considered stale and
refreshed. For multi-instance deployments (e.g. serverless, load-balanced), a
smaller value here will prevent data inconsistencies between instances.{{< /member-description >}}

### taxRateCacheTtl

{{< member-info kind="property" type="number" default="30000"  since="1.9.0" >}}

{{< member-description >}}TaxRates get cached in-memory as they are accessed very frequently. This
setting determines how long the cache lives (in ms) until it is considered stale and
refreshed. For multi-instance deployments (e.g. serverless, load-balanced), a
smaller value here will prevent data inconsistencies between instances.{{< /member-description >}}

### metadataModifiers

{{< member-info kind="property" type="<a href='/typescript-api/configuration/entity-options#entitymetadatamodifier'>EntityMetadataModifier</a>[]" default="[]"  since="1.6.0" >}}

{{< member-description >}}Allows the metadata of the built-in TypeORM entities to be manipulated. This allows you
to do things like altering data types, adding indices etc. This is an advanced feature
which should be used with some caution as it will result in DB schema changes. For examples
see <a href='/typescript-api/configuration/entity-options#entitymetadatamodifier'>EntityMetadataModifier</a>.{{< /member-description >}}


</div>
<div class="symbol">


# EntityMetadataModifier

{{< generation-info sourceFile="packages/core/src/config/entity-metadata/entity-metadata-modifier.ts" sourceLine="56" packageName="@vendure/core" since="1.6.0">}}

A function which allows TypeORM entity metadata to be manipulated prior to the DB schema being generated
during bootstrap.

{{% alert "warning" %}}
Certain DB schema modifications will result in auto-generated migrations which will lead to data loss. For instance,
changing the data type of a column will drop the column & data and then re-create it. To avoid loss of important data,
always check and modify your migration scripts as needed.
{{% /alert %}}

*Example*

```TypeScript
import { Index } from 'typeorm';
import { EntityMetadataModifier, ProductVariant } from '@vendure/core';

// Adds a unique index to the ProductVariant.sku column
export const addSkuUniqueIndex: EntityMetadataModifier = metadata => {
  const instance = new ProductVariant();
  Index({ unique: true })(instance, 'sku');
};
```

*Example*

```TypeScript
import { Column } from 'typeorm';
import { EntityMetadataModifier, ProductTranslation } from '@vendure/core';

// Use the "mediumtext" datatype for the Product's description rather than
// the default "text" type.
export const makeProductDescriptionMediumText: EntityMetadataModifier = metadata => {
    const descriptionColumnIndex = metadata.columns.findIndex(
        col => col.propertyName === 'description' && col.target === ProductTranslation,
    );
    if (-1 < descriptionColumnIndex) {
        // First we need to remove the existing column definition
        // from the metadata.
        metadata.columns.splice(descriptionColumnIndex, 1);
        // Then we add a new column definition with our custom
        // data type "mediumtext"
        // DANGER: this particular modification will generate a DB migration
        // which will result in data loss of existing descriptions. Make sure
        // to manually check & modify your migration scripts.
        const instance = new ProductTranslation();
        Column({ type: 'mediumtext' })(instance, 'description');
    }
};
```

## Signature

```TypeScript
type EntityMetadataModifier = (metadata: MetadataArgsStorage) => void | Promise<void>
```
</div>
