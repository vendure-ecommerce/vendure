---
title: "GetSuperadminContext"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## getSuperadminContext

<GenerationInfo sourceFile="packages/testing/src/utils/get-superadmin-context.ts" sourceLine="11" packageName="@vendure/testing" />

Creates a <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> configured for the default Channel with the activeUser set
as the superadmin user. Useful for populating data.

```ts title="Signature"
function getSuperadminContext(app: INestApplicationContext): Promise<RequestContext>
```
Parameters

### app

<MemberInfo kind="parameter" type={`INestApplicationContext`} />

