---
title: "Error Types"
weight: 10
date: 2023-07-14T16:57:49.428Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Error Types
<div class="symbol">


# InternalServerError

{{< generation-info sourceFile="packages/core/src/common/error/errors.ts" sourceLine="14" packageName="@vendure/core">}}

This error should be thrown when some unexpected and exceptional case is encountered.

## Signature

```TypeScript
class InternalServerError extends I18nError {
  constructor(message: string, variables: { [key: string]: string | number } = {})
}
```
## Extends

 * <a href='/typescript-api/errors/i18n-error#i18nerror'>I18nError</a>


## Members

### constructor

{{< member-info kind="method" type="(message: string, variables: { [key: string]: string | number } = {}) => InternalServerError"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# UserInputError

{{< generation-info sourceFile="packages/core/src/common/error/errors.ts" sourceLine="27" packageName="@vendure/core">}}

This error should be thrown when user input is not as expected.

## Signature

```TypeScript
class UserInputError extends I18nError {
  constructor(message: string, variables: { [key: string]: string | number } = {})
}
```
## Extends

 * <a href='/typescript-api/errors/i18n-error#i18nerror'>I18nError</a>


## Members

### constructor

{{< member-info kind="method" type="(message: string, variables: { [key: string]: string | number } = {}) => UserInputError"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# IllegalOperationError

{{< generation-info sourceFile="packages/core/src/common/error/errors.ts" sourceLine="40" packageName="@vendure/core">}}

This error should be thrown when an operation is attempted which is not allowed.

## Signature

```TypeScript
class IllegalOperationError extends I18nError {
  constructor(message: string, variables: { [key: string]: string | number } = {})
}
```
## Extends

 * <a href='/typescript-api/errors/i18n-error#i18nerror'>I18nError</a>


## Members

### constructor

{{< member-info kind="method" type="(message: string, variables: { [key: string]: string | number } = {}) => IllegalOperationError"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# UnauthorizedError

{{< generation-info sourceFile="packages/core/src/common/error/errors.ts" sourceLine="53" packageName="@vendure/core">}}

This error should be thrown when the user's authentication credentials do not match.

## Signature

```TypeScript
class UnauthorizedError extends I18nError {
  constructor()
}
```
## Extends

 * <a href='/typescript-api/errors/i18n-error#i18nerror'>I18nError</a>


## Members

### constructor

{{< member-info kind="method" type="() => UnauthorizedError"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ForbiddenError

{{< generation-info sourceFile="packages/core/src/common/error/errors.ts" sourceLine="67" packageName="@vendure/core">}}

This error should be thrown when a user attempts to access a resource which is outside of
his or her privileges.

## Signature

```TypeScript
class ForbiddenError extends I18nError {
  constructor(logLevel: LogLevel = LogLevel.Error)
}
```
## Extends

 * <a href='/typescript-api/errors/i18n-error#i18nerror'>I18nError</a>


## Members

### constructor

{{< member-info kind="method" type="(logLevel: <a href='/typescript-api/logger/log-level#loglevel'>LogLevel</a> = LogLevel.Error) => ForbiddenError"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ChannelNotFoundError

{{< generation-info sourceFile="packages/core/src/common/error/errors.ts" sourceLine="81" packageName="@vendure/core">}}

This error should be thrown when a <a href='/typescript-api/entities/channel#channel'>Channel</a> cannot be found based on the provided
channel token.

## Signature

```TypeScript
class ChannelNotFoundError extends I18nError {
  constructor(token: string)
}
```
## Extends

 * <a href='/typescript-api/errors/i18n-error#i18nerror'>I18nError</a>


## Members

### constructor

{{< member-info kind="method" type="(token: string) => ChannelNotFoundError"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# EntityNotFoundError

{{< generation-info sourceFile="packages/core/src/common/error/errors.ts" sourceLine="95" packageName="@vendure/core">}}

This error should be thrown when an entity cannot be found in the database, i.e. no entity of
the given entityName (Product, User etc.) exists with the provided id.

## Signature

```TypeScript
class EntityNotFoundError extends I18nError {
  constructor(entityName: keyof typeof coreEntitiesMap | string, id: ID)
}
```
## Extends

 * <a href='/typescript-api/errors/i18n-error#i18nerror'>I18nError</a>


## Members

### constructor

{{< member-info kind="method" type="(entityName: keyof typeof coreEntitiesMap | string, id: <a href='/typescript-api/common/id#id'>ID</a>) => EntityNotFoundError"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
