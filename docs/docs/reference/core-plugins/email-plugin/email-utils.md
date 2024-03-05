---
title: "Email Utils"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## transformOrderLineAssetUrls

<GenerationInfo sourceFile="packages/email-plugin/src/handler/default-email-handlers.ts" sourceLine="101" packageName="@vendure/email-plugin" />

Applies the configured `AssetStorageStrategy.toAbsoluteUrl()` function to each of the
OrderLine's `featuredAsset.preview` properties, so that they can be correctly displayed
in the email template.
This is required since that step usually happens at the API in middleware, which is not
applicable in this context. So we need to do it manually.

**Note: Mutates the Order object**

```ts title="Signature"
function transformOrderLineAssetUrls(ctx: RequestContext, order: Order, injector: Injector): Order
```
Parameters

### ctx

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`} />

### order

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`} />

### injector

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/common/injector#injector'>Injector</a>`} />



## hydrateShippingLines

<GenerationInfo sourceFile="packages/email-plugin/src/handler/default-email-handlers.ts" sourceLine="122" packageName="@vendure/email-plugin" />

Ensures that the ShippingLines are hydrated so that we can use the
`shippingMethod.name` property in the email template.

```ts title="Signature"
function hydrateShippingLines(ctx: RequestContext, order: Order, injector: Injector): Promise<ShippingLine[]>
```
Parameters

### ctx

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`} />

### order

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`} />

### injector

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/common/injector#injector'>Injector</a>`} />

