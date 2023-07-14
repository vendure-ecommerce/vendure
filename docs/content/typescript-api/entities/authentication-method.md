---
title: "AuthenticationMethod"
weight: 10
date: 2023-07-14T16:57:49.841Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AuthenticationMethod
<div class="symbol">


# AuthenticationMethod

{{< generation-info sourceFile="packages/core/src/entity/authentication-method/authentication-method.entity.ts" sourceLine="14" packageName="@vendure/core">}}

An AuthenticationMethod represents the means by which a <a href='/typescript-api/entities/user#user'>User</a> is authenticated. There are two kinds:
<a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> and <a href='/typescript-api/entities/authentication-method#externalauthenticationmethod'>ExternalAuthenticationMethod</a>.

## Signature

```TypeScript
class AuthenticationMethod extends VendureEntity {
  @Index() @ManyToOne(type => User, user => user.authenticationMethods) @Index()
    @ManyToOne(type => User, user => user.authenticationMethods)
    user: User;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### user

{{< member-info kind="property" type="<a href='/typescript-api/entities/user#user'>User</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ExternalAuthenticationMethod

{{< generation-info sourceFile="packages/core/src/entity/authentication-method/external-authentication-method.entity.ts" sourceLine="14" packageName="@vendure/core">}}

This method is used when an external authentication service is used to authenticate Vendure Users.
Examples of external auth include social logins or corporate identity servers.

## Signature

```TypeScript
class ExternalAuthenticationMethod extends AuthenticationMethod {
  constructor(input: DeepPartial<ExternalAuthenticationMethod>)
  @Column() @Column()
    strategy: string;
  @Column() @Column()
    externalIdentifier: string;
  @Column('simple-json') @Column('simple-json')
    metadata: any;
}
```
## Extends

 * <a href='/typescript-api/entities/authentication-method#authenticationmethod'>AuthenticationMethod</a>


## Members

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/authentication-method#externalauthenticationmethod'>ExternalAuthenticationMethod</a>&#62;) => ExternalAuthenticationMethod"  >}}

{{< member-description >}}{{< /member-description >}}

### strategy

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### externalIdentifier

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### metadata

{{< member-info kind="property" type="any"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# NativeAuthenticationMethod

{{< generation-info sourceFile="packages/core/src/entity/authentication-method/native-authentication-method.entity.ts" sourceLine="14" packageName="@vendure/core">}}

This is the default, built-in authentication method which uses a identifier (typically username or email address)
and password combination to authenticate a User.

## Signature

```TypeScript
class NativeAuthenticationMethod extends AuthenticationMethod {
  constructor(input?: DeepPartial<NativeAuthenticationMethod>)
  @Column() @Column()
    identifier: string;
  @Column({ select: false }) @Column({ select: false }) passwordHash: string;
  @Column({ type: 'varchar', nullable: true }) @Column({ type: 'varchar', nullable: true })
    verificationToken: string | null;
  @Column({ type: 'varchar', nullable: true }) @Column({ type: 'varchar', nullable: true })
    passwordResetToken: string | null;
  @Column({ type: 'varchar', nullable: true }) @Column({ type: 'varchar', nullable: true })
    identifierChangeToken: string | null;
  @Column({ type: 'varchar', nullable: true }) @Column({ type: 'varchar', nullable: true })
    pendingIdentifier: string | null;
}
```
## Extends

 * <a href='/typescript-api/entities/authentication-method#authenticationmethod'>AuthenticationMethod</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a>&#62;) => NativeAuthenticationMethod"  >}}

{{< member-description >}}{{< /member-description >}}

### identifier

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### passwordHash

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### verificationToken

{{< member-info kind="property" type="string | null"  >}}

{{< member-description >}}{{< /member-description >}}

### passwordResetToken

{{< member-info kind="property" type="string | null"  >}}

{{< member-description >}}{{< /member-description >}}

### identifierChangeToken

{{< member-info kind="property" type="string | null"  >}}

{{< member-description >}}A token issued when a User requests to change their identifier (typically
an email address){{< /member-description >}}

### pendingIdentifier

{{< member-info kind="property" type="string | null"  >}}

{{< member-description >}}When a request has been made to change the User's identifier, the new identifier
will be stored here until it has been verified, after which it will
replace the current value of the `identifier` field.{{< /member-description >}}


</div>
