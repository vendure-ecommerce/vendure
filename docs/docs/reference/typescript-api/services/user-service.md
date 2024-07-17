---
title: "UserService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## UserService

<GenerationInfo sourceFile="packages/core/src/service/services/user.service.ts" sourceLine="37" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/user#user'>User</a> entities.

```ts title="Signature"
class UserService {
    constructor(connection: TransactionalConnection, configService: ConfigService, roleService: RoleService, passwordCipher: PasswordCipher, verificationTokenGenerator: VerificationTokenGenerator, moduleRef: ModuleRef)
    getUserById(ctx: RequestContext, userId: ID) => Promise<User | undefined>;
    getUserByEmailAddress(ctx: RequestContext, emailAddress: string, userType?: 'administrator' | 'customer') => Promise<User | undefined>;
    createCustomerUser(ctx: RequestContext, identifier: string, password?: string) => Promise<User | PasswordValidationError>;
    addNativeAuthenticationMethod(ctx: RequestContext, user: User, identifier: string, password?: string) => Promise<User | PasswordValidationError>;
    createAdminUser(ctx: RequestContext, identifier: string, password: string) => Promise<User>;
    softDelete(ctx: RequestContext, userId: ID) => ;
    setVerificationToken(ctx: RequestContext, user: User) => Promise<User>;
    verifyUserByToken(ctx: RequestContext, verificationToken: string, password?: string) => Promise<ErrorResultUnion<VerifyCustomerAccountResult, User>>;
    setPasswordResetToken(ctx: RequestContext, emailAddress: string) => Promise<User | undefined>;
    resetPasswordByToken(ctx: RequestContext, passwordResetToken: string, password: string) => Promise<
        User | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError
    >;
    changeUserAndNativeIdentifier(ctx: RequestContext, userId: ID, newIdentifier: string) => ;
    setIdentifierChangeToken(ctx: RequestContext, user: User) => Promise<User>;
    changeIdentifierByToken(ctx: RequestContext, token: string) => Promise<
        | { user: User; oldIdentifier: string }
        | IdentifierChangeTokenInvalidError
        | IdentifierChangeTokenExpiredError
    >;
    updatePassword(ctx: RequestContext, userId: ID, currentPassword: string, newPassword: string) => Promise<boolean | InvalidCredentialsError | PasswordValidationError>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, passwordCipher: PasswordCipher, verificationTokenGenerator: VerificationTokenGenerator, moduleRef: ModuleRef) => UserService`}   />


### getUserById

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a> | undefined&#62;`}   />


### getUserByEmailAddress

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, emailAddress: string, userType?: 'administrator' | 'customer') => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a> | undefined&#62;`}   />


### createCustomerUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, identifier: string, password?: string) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a> | PasswordValidationError&#62;`}   />

Creates a new User with the special `customer` Role and using the <a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.
### addNativeAuthenticationMethod

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>, identifier: string, password?: string) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a> | PasswordValidationError&#62;`}   />

Adds a new <a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> to the User. If the <a href='/reference/typescript-api/auth/auth-options#authoptions'>AuthOptions</a> `requireVerification`
is set to `true` (as is the default), the User will be marked as unverified until the email verification
flow is completed.
### createAdminUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, identifier: string, password: string) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a>&#62;`}   />

Creates a new verified User using the <a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.
### softDelete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => `}   />


### setVerificationToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a>&#62;`}   />

Sets the <a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> `verificationToken` as part of the User email verification
flow.
### verifyUserByToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, verificationToken: string, password?: string) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;VerifyCustomerAccountResult, <a href='/reference/typescript-api/entities/user#user'>User</a>&#62;&#62;`}   />

Verifies a verificationToken by looking for a User which has previously had it set using the
`setVerificationToken()` method, and checks that the token is valid and has not expired.

If valid, the User will be set to `verified: true`.
### setPasswordResetToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, emailAddress: string) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a> | undefined&#62;`}   />

Sets the <a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> `passwordResetToken` as part of the User password reset
flow.
### resetPasswordByToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, passwordResetToken: string, password: string) => Promise&#60;         <a href='/reference/typescript-api/entities/user#user'>User</a> | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError     &#62;`}   />

Verifies a passwordResetToken by looking for a User which has previously had it set using the
`setPasswordResetToken()` method, and checks that the token is valid and has not expired.

If valid, the User's credentials will be updated with the new password.
### changeUserAndNativeIdentifier

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/reference/typescript-api/common/id#id'>ID</a>, newIdentifier: string) => `}   />

Changes the User identifier without an email verification step, so this should be only used when
an Administrator is setting a new email address.
### setIdentifierChangeToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>) => Promise&#60;<a href='/reference/typescript-api/entities/user#user'>User</a>&#62;`}   />

Sets the <a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a> `identifierChangeToken` as part of the User email address change
flow.
### changeIdentifierByToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, token: string) => Promise&#60;         | { user: <a href='/reference/typescript-api/entities/user#user'>User</a>; oldIdentifier: string }         | IdentifierChangeTokenInvalidError         | IdentifierChangeTokenExpiredError     &#62;`}   />

Changes the User identifier as part of the storefront flow used by Customers to set a
new email address, with the token previously set using the `setIdentifierChangeToken()` method.
### updatePassword

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/reference/typescript-api/common/id#id'>ID</a>, currentPassword: string, newPassword: string) => Promise&#60;boolean | InvalidCredentialsError | PasswordValidationError&#62;`}   />

Updates the password for a User with the <a href='/reference/typescript-api/entities/authentication-method#nativeauthenticationmethod'>NativeAuthenticationMethod</a>.


</div>
