---
title: "Role"
weight: 10
date: 2023-07-20T13:56:15.362Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Role

<GenerationInfo sourceFile="packages/core/src/entity/role/role.entity.ts" sourceLine="16" packageName="@vendure/core" />

A Role represents a collection of permissions which determine the authorization
level of a <a href='/typescript-api/entities/user#user'>User</a> on a given set of <a href='/typescript-api/entities/channel#channel'>Channel</a>s.

```ts title="Signature"
class Role extends VendureEntity implements ChannelAware {
  constructor(input?: DeepPartial<Role>)
  @Column() @Column() code: string;
  @Column() @Column() description: string;
  @Column('simple-array') @Column('simple-array') permissions: Permission[];
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
```
Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


Implements

 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;) => Role"   />


### code

<MemberInfo kind="property" type="string"   />


### description

<MemberInfo kind="property" type="string"   />


### permissions

<MemberInfo kind="property" type="<a href='/typescript-api/common/permission#permission'>Permission</a>[]"   />


### channels

<MemberInfo kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"   />


