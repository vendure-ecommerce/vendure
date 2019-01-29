---
title: "EntityIdStrategy"
weight: 10
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# EntityIdStrategy

The EntityIdStrategy determines how entity IDs are generated and stored in thedatabase, as well as how they are transformed when being passed from the API to theservice layer.

### primaryKeyType

{{< member-info type="PrimaryKeyType" >}}



### encodeId

{{< member-info type="(primaryKey: T) =&#62; string" >}}



### decodeId

{{< member-info type="(id: string) =&#62; T" >}}



