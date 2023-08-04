---
title: "UserService"
weight: 10
date: 2023-07-14T16:57:50.627Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# UserService
<div class="symbol">


# UserService

{{< generation-info sourceFile="packages/core/src/service/services/user.service.ts" sourceLine="37" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/user#user'>User</a> entities.

## Signature

```TypeScript
class UserService {
  constructor(connection: TransactionalConnection, configService: ConfigService, roleService: RoleService, passwordCipher: PasswordCipher, verificationTokenGenerator: VerificationTokenGenerator, moduleRef: ModuleRef)
  async getUserById(ctx: RequestContext, userId: ID) => Promise<User | undefined>;
  async getUserByEmailAddress(ctx: RequestContext, emailAddress: string, userType?: 'administrator' | 'customer') => Promise<User | undefined>;
  async createCustomerUser(ctx: RequestContext, identifier: string, password?: string) => Promise<User | PasswordValidationError>;
  async addNativeAuthenticationMethod(ctx: RequestContext, user: User, identifier: string, password?: string) => Promise<User | PasswordValidationError>;
  async createAdminUser(ctx: RequestContext, identifier: string, password: string) => Promise<User>;
  async softDelete(ctx: RequestContext, userId: ID) => ;
  async setVerificationToken(ctx: RequestContext, user: User) => Promise<User>;
  async verifyUserByToken(ctx: RequestContext, verificationToken: string, password?: string) => Promise<ErrorResultUnion<VerifyCustomerAccountResult, User>>;
  async setPasswordResetToken(ctx: RequestContext, emailAddress: string) => Promise<User | undefined>;
  async resetPasswordByToken(ctx: RequestContext, passwordResetToken: string, password: string) => Promise<
        User | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError
    >;
  async changeUserAndNativeIdentifier(ctx: RequestContext, userId: ID, newIdentifier: string) => ;
  async setIdentifierChangeToken(ctx: RequestContext, user: User) => Promise<User>;
  async changeIdentifierByToken(ctx: RequestContext, token: string) => Promise<
        | { user: User; oldIdentifier: string }
        | IdentifierChangeTokenInvalidError
        | IdentifierChangeTokenExpiredError
    >;
  async updatePassword(ctx: RequestContext, userId: ID, currentPassword: string, newPassword: string) => Promise<boolean | InvalidCredentialsError | PasswordValidationError>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, roleService: <a href='/typescript-api/services/role-service#roleservice'>RoleService</a>, passwordCipher: PasswordCipher, verificationTokenGenerator: VerificationTokenGenerator, moduleRef: ModuleRef) => UserService"  >}}

{{< member-description >}}{{< /member-description >}}

### getUserById

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getUserByEmailAddress

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, emailAddress: string, userType?: 'administrator' | 'customer') => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createCustomerUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, identifier: string, password?: string) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | PasswordValidationError&#62;"  >}}

{{< member-description >}}Creates a new User with the special `customer` Role and using the <a href='/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.{{< /member-description >}}

### addNativeAuthenticationMethod

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>, identifier: string, password?: string) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | PasswordValidationError&#62;"  >}}

{{< member-description >}}Adds a new <a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> to the User. If the <a href='/typescript-api/auth/auth-options#authoptions'>AuthOptions</a> `requireVerification`
is set to `true` (as is the default), the User will be marked as unverified until the email verification
flow is completed.{{< /member-description >}}

### createAdminUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, identifier: string, password: string) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a>&#62;"  >}}

{{< member-description >}}Creates a new verified User using the <a href='/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.{{< /member-description >}}

### softDelete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setVerificationToken

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a>&#62;"  >}}

{{< member-description >}}Sets the <a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> `verificationToken` as part of the User email verification
flow.{{< /member-description >}}

### verifyUserByToken

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, verificationToken: string, password?: string) => Promise&#60;ErrorResultUnion&#60;VerifyCustomerAccountResult, <a href='/typescript-api/entities/user#user'>User</a>&#62;&#62;"  >}}

{{< member-description >}}Verifies a verificationToken by looking for a User which has previously had it set using the
`setVerificationToken()` method, and checks that the token is valid and has not expired.

If valid, the User will be set to `verified: true`.{{< /member-description >}}

### setPasswordResetToken

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, emailAddress: string) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a> | undefined&#62;"  >}}

{{< member-description >}}Sets the <a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> `passwordResetToken` as part of the User password reset
flow.{{< /member-description >}}

### resetPasswordByToken

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, passwordResetToken: string, password: string) => Promise&#60;         <a href='/typescript-api/entities/user#user'>User</a> | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError     &#62;"  >}}

{{< member-description >}}Verifies a passwordResetToken by looking for a User which has previously had it set using the
`setPasswordResetToken()` method, and checks that the token is valid and has not expired.

If valid, the User's credentials will be updated with the new password.{{< /member-description >}}

### changeUserAndNativeIdentifier

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>, newIdentifier: string) => "  >}}

{{< member-description >}}Changes the User identifier without an email verification step, so this should be only used when
an Administrator is setting a new email address.{{< /member-description >}}

### setIdentifierChangeToken

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>) => Promise&#60;<a href='/typescript-api/entities/user#user'>User</a>&#62;"  >}}

{{< member-description >}}Sets the <a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> `identifierChangeToken` as part of the User email address change
flow.{{< /member-description >}}

### changeIdentifierByToken

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, token: string) => Promise&#60;         | { user: <a href='/typescript-api/entities/user#user'>User</a>; oldIdentifier: string }         | IdentifierChangeTokenInvalidError         | IdentifierChangeTokenExpiredError     &#62;"  >}}

{{< member-description >}}Changes the User identifier as part of the storefront flow used by Customers to set a
new email address, with the token previously set using the `setIdentifierChangeToken()` method.{{< /member-description >}}

### updatePassword

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>, currentPassword: string, newPassword: string) => Promise&#60;boolean | InvalidCredentialsError | PasswordValidationError&#62;"  >}}

{{< member-description >}}Updates the password for a User with the <a href='/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a>.{{< /member-description >}}


</div>
