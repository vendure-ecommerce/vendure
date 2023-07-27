---
title: "CustomFieldType"
weight: 10
date: 2023-07-14T16:57:50.657Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CustomFieldType
<div class="symbol">


# CustomFieldType

{{< generation-info sourceFile="packages/common/src/shared-types.ts" sourceLine="102" packageName="@vendure/common">}}

A data type for a custom field. The CustomFieldType determines the data types used in the generated
database columns and GraphQL fields as follows (key: m = MySQL, p = Postgres, s = SQLite):

Type         | DB type                               | GraphQL type
-----        |---------                              |---------------
string       | varchar                               | String
localeString | varchar                               | String
text         | longtext(m), text(p,s)                | String
localText    | longtext(m), text(p,s)                | String
int          | int                                   | Int
float        | double precision                      | Float
boolean      | tinyint (m), bool (p), boolean (s)    | Boolean
datetime     | datetime (m,s), timestamp (p)         | DateTime
relation     | many-to-one / many-to-many relation   | As specified in config

Additionally, the CustomFieldType also dictates which [configuration options](/docs/typescript-api/custom-fields/#configuration-options)
are available for that custom field.

## Signature

```TypeScript
type CustomFieldType = | 'string'
    | 'localeString'
    | 'int'
    | 'float'
    | 'boolean'
    | 'datetime'
    | 'relation'
    | 'text'
    | 'localeText'
```
</div>
