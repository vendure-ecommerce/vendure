---
title: "Session"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Session

<GenerationInfo sourceFile="packages/core/src/entity/session/session.entity.ts" sourceLine="18" packageName="@vendure/core" />

A Session is created when a user makes a request to restricted API operations. A Session can be an <a href='/reference/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a>
in the case of un-authenticated users, otherwise it is an <a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>.

```ts title="Signature"
class Session extends VendureEntity {
    @Index({ unique: true })
    @Column()
    token: string;
    @Column() expires: Date;
    @Column() invalidated: boolean;
    @EntityId({ nullable: true })
    activeOrderId?: ID;
    @Index()
    @ManyToOne(type => Order)
    activeOrder: Order | null;
    @EntityId({ nullable: true })
    activeChannelId?: ID;
    @Index()
    @ManyToOne(type => Channel)
    activeChannel: Channel | null;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### token

<MemberInfo kind="property" type={`string`}   />


### expires

<MemberInfo kind="property" type={`Date`}   />


### invalidated

<MemberInfo kind="property" type={`boolean`}   />


### activeOrderId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### activeOrder

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a> | null`}   />


### activeChannelId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### activeChannel

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a> | null`}   />




</div>
