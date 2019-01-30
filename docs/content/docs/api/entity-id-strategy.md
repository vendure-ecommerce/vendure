---
title: "EntityIdStrategy"
weight: 10
date: 2019-01-30T10:57:03.751Z
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# EntityIdStrategy

{{< generation-info source="/server/src/config/entity-id-strategy/entity-id-strategy.ts">}}

The EntityIdStrategy determines how entity IDs are generated and stored in thedatabase, as well as how they are transformed when being passed from the API to theservice layer.

### primaryKeyType

{{< member-info kind="property" type="PrimaryKeyType" >}}



### encodeId

{{< member-info kind="property" type="(primaryKey: T) =&#62; string" >}}



### decodeId

{{< member-info kind="property" type="(id: string) =&#62; T" >}}



