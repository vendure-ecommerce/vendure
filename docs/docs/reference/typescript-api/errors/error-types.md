---
title: "Error Types"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## InternalServerError

<GenerationInfo sourceFile="packages/core/src/common/error/errors.ts" sourceLine="14" packageName="@vendure/core" />

This error should be thrown when some unexpected and exceptional case is encountered.

```ts title="Signature"
class InternalServerError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {})
}
```
* Extends: <code><a href='/reference/typescript-api/errors/i18n-error#i18nerror'>I18nError</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(message: string, variables: { [key: string]: string | number } = {}) => InternalServerError`}   />




</div>


## UserInputError

<GenerationInfo sourceFile="packages/core/src/common/error/errors.ts" sourceLine="27" packageName="@vendure/core" />

This error should be thrown when user input is not as expected.

```ts title="Signature"
class UserInputError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {})
}
```
* Extends: <code><a href='/reference/typescript-api/errors/i18n-error#i18nerror'>I18nError</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(message: string, variables: { [key: string]: string | number } = {}) => UserInputError`}   />




</div>


## IllegalOperationError

<GenerationInfo sourceFile="packages/core/src/common/error/errors.ts" sourceLine="40" packageName="@vendure/core" />

This error should be thrown when an operation is attempted which is not allowed.

```ts title="Signature"
class IllegalOperationError extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {})
}
```
* Extends: <code><a href='/reference/typescript-api/errors/i18n-error#i18nerror'>I18nError</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(message: string, variables: { [key: string]: string | number } = {}) => IllegalOperationError`}   />




</div>


## UnauthorizedError

<GenerationInfo sourceFile="packages/core/src/common/error/errors.ts" sourceLine="53" packageName="@vendure/core" />

This error should be thrown when the user's authentication credentials do not match.

```ts title="Signature"
class UnauthorizedError extends I18nError {
    constructor()
}
```
* Extends: <code><a href='/reference/typescript-api/errors/i18n-error#i18nerror'>I18nError</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`() => UnauthorizedError`}   />




</div>


## ForbiddenError

<GenerationInfo sourceFile="packages/core/src/common/error/errors.ts" sourceLine="67" packageName="@vendure/core" />

This error should be thrown when a user attempts to access a resource which is outside of
his or her privileges.

```ts title="Signature"
class ForbiddenError extends I18nError {
    constructor(logLevel: LogLevel = LogLevel.Warn)
}
```
* Extends: <code><a href='/reference/typescript-api/errors/i18n-error#i18nerror'>I18nError</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(logLevel: <a href='/reference/typescript-api/logger/log-level#loglevel'>LogLevel</a> = LogLevel.Warn) => ForbiddenError`}   />




</div>


## ChannelNotFoundError

<GenerationInfo sourceFile="packages/core/src/common/error/errors.ts" sourceLine="81" packageName="@vendure/core" />

This error should be thrown when a <a href='/reference/typescript-api/entities/channel#channel'>Channel</a> cannot be found based on the provided
channel token.

```ts title="Signature"
class ChannelNotFoundError extends I18nError {
    constructor(token: string)
}
```
* Extends: <code><a href='/reference/typescript-api/errors/i18n-error#i18nerror'>I18nError</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(token: string) => ChannelNotFoundError`}   />




</div>


## EntityNotFoundError

<GenerationInfo sourceFile="packages/core/src/common/error/errors.ts" sourceLine="95" packageName="@vendure/core" />

This error should be thrown when an entity cannot be found in the database, i.e. no entity of
the given entityName (Product, User etc.) exists with the provided id.

```ts title="Signature"
class EntityNotFoundError extends I18nError {
    constructor(entityName: keyof typeof coreEntitiesMap | string, id: ID)
}
```
* Extends: <code><a href='/reference/typescript-api/errors/i18n-error#i18nerror'>I18nError</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(entityName: keyof typeof coreEntitiesMap | string, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => EntityNotFoundError`}   />




</div>
