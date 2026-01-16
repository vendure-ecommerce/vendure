---
title: "Role"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Role

<GenerationInfo sourceFile="packages/core/src/entity/role/role.entity.ts" sourceLine="16" packageName="@vendure/core" />

A Role represents a collection of permissions which determine the authorization
level of a <a href='/reference/typescript-api/entities/user#user'>User</a> on a given set of <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>s.

```ts title="Signature"
class Role extends VendureEntity implements ChannelAware {
    constructor(input?: DeepPartial<Role>)
    @Column() code: string;
    @Column() description: string;
    @Column('simple-array') permissions: Permission[];
    @ManyToMany(type => Channel, channel => channel.roles)
    @JoinTable()
    channels: Channel[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/role#role'>Role</a>&#62;) => Role`}   />


### code

<MemberInfo kind="property" type={`string`}   />


### description

<MemberInfo kind="property" type={`string`}   />


### permissions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/permission#permission'>Permission</a>[]`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />




</div>
