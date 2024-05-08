---
title: "User"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## User

<GenerationInfo sourceFile="packages/core/src/entity/user/user.entity.ts" sourceLine="21" packageName="@vendure/core" />

A User represents any authenticated user of the Vendure API. This includes both
<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>s as well as registered <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>s.

```ts title="Signature"
class User extends VendureEntity implements HasCustomFields, SoftDeletable {
    constructor(input?: DeepPartial<User>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    @Column()
    identifier: string;
    @OneToMany(type => AuthenticationMethod, method => method.user)
    authenticationMethods: AuthenticationMethod[];
    @Column({ default: false })
    verified: boolean;
    @ManyToMany(type => Role)
    @JoinTable()
    roles: Role[];
    @Column({ type: Date, nullable: true })
    lastLogin: Date | null;
    @Column(type => CustomUserFields)
    customFields: CustomUserFields;
    @OneToMany(type => AuthenticatedSession, session => session.user)
    sessions: AuthenticatedSession[];
    getNativeAuthenticationMethod() => NativeAuthenticationMethod;
    getNativeAuthenticationMethod(strict?: boolean) => NativeAuthenticationMethod | undefined;
    getNativeAuthenticationMethod(strict?: boolean) => NativeAuthenticationMethod | undefined;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/user#user'>User</a>&#62;) => User`}   />


### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />


### identifier

<MemberInfo kind="property" type={`string`}   />


### authenticationMethods

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/authentication-method#authenticationmethod'>AuthenticationMethod</a>[]`}   />


### verified

<MemberInfo kind="property" type={`boolean`}   />


### roles

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/role#role'>Role</a>[]`}   />


### lastLogin

<MemberInfo kind="property" type={`Date | null`}   />


### customFields

<MemberInfo kind="property" type={`CustomUserFields`}   />


### sessions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>[]`}   />


### getNativeAuthenticationMethod

<MemberInfo kind="method" type={`() => <a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a>`}   />


### getNativeAuthenticationMethod

<MemberInfo kind="method" type={`(strict?: boolean) => <a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> | undefined`}   />


### getNativeAuthenticationMethod

<MemberInfo kind="method" type={`(strict?: boolean) => <a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> | undefined`}   />




</div>
