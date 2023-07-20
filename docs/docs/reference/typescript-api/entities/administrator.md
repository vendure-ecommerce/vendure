---
title: "Administrator"
weight: 10
date: 2023-07-20T13:56:15.037Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Administrator

<GenerationInfo sourceFile="packages/core/src/entity/administrator/administrator.entity.ts" sourceLine="18" packageName="@vendure/core" />

An administrative user who has access to the Admin UI and Admin API. The
specific permissions of the Administrator are determined by the assigned
<a href='/typescript-api/entities/role#role'>Role</a>s.

```ts title="Signature"
class Administrator extends VendureEntity implements SoftDeletable, HasCustomFields {
  constructor(input?: DeepPartial<Administrator>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  @Column() @Column() firstName: string;
  @Column() @Column() lastName: string;
  @Column({ unique: true }) @Column({ unique: true })
    emailAddress: string;
  @OneToOne(type => User) @JoinColumn() @OneToOne(type => User)
    @JoinColumn()
    user: User;
  @Column(type => CustomAdministratorFields) @Column(type => CustomAdministratorFields)
    customFields: CustomAdministratorFields;
}
```
Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


Implements

 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>
 * HasCustomFields



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;) => Administrator"   />


### deletedAt

<MemberInfo kind="property" type="Date | null"   />


### firstName

<MemberInfo kind="property" type="string"   />


### lastName

<MemberInfo kind="property" type="string"   />


### emailAddress

<MemberInfo kind="property" type="string"   />


### user

<MemberInfo kind="property" type="<a href='/typescript-api/entities/user#user'>User</a>"   />


### customFields

<MemberInfo kind="property" type="CustomAdministratorFields"   />


