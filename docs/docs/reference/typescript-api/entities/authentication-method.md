---
title: "AuthenticationMethod"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AuthenticationMethod

<GenerationInfo sourceFile="packages/core/src/entity/authentication-method/authentication-method.entity.ts" sourceLine="14" packageName="@vendure/core" />

An AuthenticationMethod represents the means by which a <a href='/reference/typescript-api/entities/user#user'>User</a> is authenticated. There are two kinds:
<a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> and <a href='/reference/typescript-api/entities/authentication-method#externalauthenticationmethod'>ExternalAuthenticationMethod</a>.

```ts title="Signature"
class AuthenticationMethod extends VendureEntity {
    @Index()
    @ManyToOne(type => User, user => user.authenticationMethods)
    user: User;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### user

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/user#user'>User</a>`}   />




</div>


## ExternalAuthenticationMethod

<GenerationInfo sourceFile="packages/core/src/entity/authentication-method/external-authentication-method.entity.ts" sourceLine="14" packageName="@vendure/core" />

This method is used when an external authentication service is used to authenticate Vendure Users.
Examples of external auth include social logins or corporate identity servers.

```ts title="Signature"
class ExternalAuthenticationMethod extends AuthenticationMethod {
    constructor(input: DeepPartial<ExternalAuthenticationMethod>)
    @Column()
    strategy: string;
    @Column()
    externalIdentifier: string;
    @Column('simple-json')
    metadata: any;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/authentication-method#authenticationmethod'>AuthenticationMethod</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/authentication-method#externalauthenticationmethod'>ExternalAuthenticationMethod</a>&#62;) => ExternalAuthenticationMethod`}   />


### strategy

<MemberInfo kind="property" type={`string`}   />


### externalIdentifier

<MemberInfo kind="property" type={`string`}   />


### metadata

<MemberInfo kind="property" type={`any`}   />




</div>


## NativeAuthenticationMethod

<GenerationInfo sourceFile="packages/core/src/entity/authentication-method/native-authentication-method.entity.ts" sourceLine="14" packageName="@vendure/core" />

This is the default, built-in authentication method which uses a identifier (typically username or email address)
and password combination to authenticate a User.

```ts title="Signature"
class NativeAuthenticationMethod extends AuthenticationMethod {
    constructor(input?: DeepPartial<NativeAuthenticationMethod>)
    @Column()
    identifier: string;
    @Column({ select: false }) passwordHash: string;
    @Column({ type: 'varchar', nullable: true })
    verificationToken: string | null;
    @Column({ type: 'varchar', nullable: true })
    passwordResetToken: string | null;
    @Column({ type: 'varchar', nullable: true })
    identifierChangeToken: string | null;
    @Column({ type: 'varchar', nullable: true })
    pendingIdentifier: string | null;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/authentication-method#authenticationmethod'>AuthenticationMethod</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a>&#62;) => NativeAuthenticationMethod`}   />


### identifier

<MemberInfo kind="property" type={`string`}   />


### passwordHash

<MemberInfo kind="property" type={`string`}   />


### verificationToken

<MemberInfo kind="property" type={`string | null`}   />


### passwordResetToken

<MemberInfo kind="property" type={`string | null`}   />


### identifierChangeToken

<MemberInfo kind="property" type={`string | null`}   />

A token issued when a User requests to change their identifier (typically
an email address)
### pendingIdentifier

<MemberInfo kind="property" type={`string | null`}   />

When a request has been made to change the User's identifier, the new identifier
will be stored here until it has been verified, after which it will
replace the current value of the `identifier` field.


</div>
