---
title: "User"
weight: 10
date: 2023-07-14T16:57:50.040Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# User
<div class="symbol">


# User

{{< generation-info sourceFile="packages/core/src/entity/user/user.entity.ts" sourceLine="20" packageName="@vendure/core">}}

A User represents any authenticated user of the Vendure API. This includes both
<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>s as well as registered <a href='/typescript-api/entities/customer#customer'>Customer</a>s.

## Signature

```TypeScript
class User extends VendureEntity implements HasCustomFields, SoftDeletable {
  constructor(input?: DeepPartial<User>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  @Column() @Column()
    identifier: string;
  @OneToMany(type => AuthenticationMethod, method => method.user) @OneToMany(type => AuthenticationMethod, method => method.user)
    authenticationMethods: AuthenticationMethod[];
  @Column({ default: false }) @Column({ default: false })
    verified: boolean;
  @ManyToMany(type => Role) @JoinTable() @ManyToMany(type => Role)
    @JoinTable()
    roles: Role[];
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    lastLogin: Date | null;
  @Column(type => CustomUserFields) @Column(type => CustomUserFields)
    customFields: CustomUserFields;
  getNativeAuthenticationMethod() => NativeAuthenticationMethod;
  getNativeAuthenticationMethod(strict?: boolean) => NativeAuthenticationMethod | undefined;
  getNativeAuthenticationMethod(strict?: boolean) => NativeAuthenticationMethod | undefined;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/user#user'>User</a>&#62;) => User"  >}}

{{< member-description >}}{{< /member-description >}}

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### identifier

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### authenticationMethods

{{< member-info kind="property" type="<a href='/typescript-api/entities/authentication-method#authenticationmethod'>AuthenticationMethod</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### verified

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### roles

{{< member-info kind="property" type="<a href='/typescript-api/entities/role#role'>Role</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### lastLogin

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomUserFields"  >}}

{{< member-description >}}{{< /member-description >}}

### getNativeAuthenticationMethod

{{< member-info kind="method" type="() => <a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### getNativeAuthenticationMethod

{{< member-info kind="method" type="(strict?: boolean) => <a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> | undefined"  >}}

{{< member-description >}}{{< /member-description >}}

### getNativeAuthenticationMethod

{{< member-info kind="method" type="(strict?: boolean) => <a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> | undefined"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
