---
title: "EntityDuplicatorService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EntityDuplicatorService

<GenerationInfo sourceFile="packages/core/src/service/helpers/entity-duplicator/entity-duplicator.service.ts" sourceLine="23" packageName="@vendure/core" since="2.2.0" />

This service is used to duplicate entities using one of the configured
<a href='/reference/typescript-api/configuration/entity-duplicator#entityduplicator'>EntityDuplicator</a> functions.

```ts title="Signature"
class EntityDuplicatorService {
    constructor(configService: ConfigService, configArgService: ConfigArgService, connection: TransactionalConnection)
    getEntityDuplicators(ctx: RequestContext) => EntityDuplicatorDefinition[];
    duplicateEntity(ctx: RequestContext, input: DuplicateEntityInput) => Promise<DuplicateEntityResult>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(configService: ConfigService, configArgService: ConfigArgService, connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>) => EntityDuplicatorService`}   />


### getEntityDuplicators

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => EntityDuplicatorDefinition[]`}   />

Returns all configured <a href='/reference/typescript-api/configuration/entity-duplicator#entityduplicator'>EntityDuplicator</a> definitions.
### duplicateEntity

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: DuplicateEntityInput) => Promise&#60;DuplicateEntityResult&#62;`}   />

Duplicates an entity using the specified <a href='/reference/typescript-api/configuration/entity-duplicator#entityduplicator'>EntityDuplicator</a>. The duplication is performed
within a transaction, so if an error occurs, the transaction will be rolled back.


</div>
