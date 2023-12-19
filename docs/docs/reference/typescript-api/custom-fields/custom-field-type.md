---
title: "CustomFieldType"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomFieldType

<GenerationInfo sourceFile="packages/common/src/shared-types.ts" sourceLine="103" packageName="@vendure/common" />

A data type for a custom field. The CustomFieldType determines the data types used in the generated
database columns and GraphQL fields as follows (key: m = MySQL, p = Postgres, s = SQLite):

Type         | DB type                               | GraphQL type
-----        |---------                              |---------------
string       | varchar                               | String
localeString | varchar                               | String
text         | longtext(m), text(p,s)                | String
localeText    | longtext(m), text(p,s)                | String
int          | int                                   | Int
float        | double precision                      | Float
boolean      | tinyint (m), bool (p), boolean (s)    | Boolean
datetime     | datetime (m,s), timestamp (p)         | DateTime
relation     | many-to-one / many-to-many relation   | As specified in config

Additionally, the CustomFieldType also dictates which [configuration options](/reference/typescript-api/custom-fields/#configuration-options)
are available for that custom field.

```ts title="Signature"
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
