---
title: "ShippingMethod"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingMethod

<GenerationInfo sourceFile="packages/core/src/entity/shipping-method/shipping-method.entity.ts" sourceLine="33" packageName="@vendure/core" />

A ShippingMethod is used to apply a shipping price to an <a href='/reference/typescript-api/entities/order#order'>Order</a>. It is composed of a
<a href='/reference/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a> and a <a href='/reference/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>. For a given Order,
the `checker` is used to determine whether this ShippingMethod can be used. If yes, then
the ShippingMethod can be applied and the `calculator` is used to determine the price of
shipping.

```ts title="Signature"
class ShippingMethod extends VendureEntity implements ChannelAware, SoftDeletable, HasCustomFields, Translatable {
    constructor(input?: DeepPartial<ShippingMethod>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    @Column() code: string;
    name: LocaleString;
    description: LocaleString;
    @Column('simple-json') checker: ConfigurableOperation;
    @Column('simple-json') calculator: ConfigurableOperation;
    @Column()
    fulfillmentHandlerCode: string;
    @ManyToMany(type => Channel, channel => channel.shippingMethods)
    @JoinTable()
    channels: Channel[];
    @OneToMany(type => ShippingMethodTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ShippingMethod>>;
    @Column(type => CustomShippingMethodFields)
    customFields: CustomShippingMethodFields;
    apply(ctx: RequestContext, order: Order) => Promise<ShippingCalculationResult | undefined>;
    test(ctx: RequestContext, order: Order) => Promise<boolean>;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>, <code><a href='/reference/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;) => ShippingMethod`}   />


### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />


### code

<MemberInfo kind="property" type={`string`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### description

<MemberInfo kind="property" type={`LocaleString`}   />


### checker

<MemberInfo kind="property" type={`ConfigurableOperation`}   />


### calculator

<MemberInfo kind="property" type={`ConfigurableOperation`}   />


### fulfillmentHandlerCode

<MemberInfo kind="property" type={`string`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;&#62;`}   />


### customFields

<MemberInfo kind="property" type={`CustomShippingMethodFields`}   />


### apply

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/shipping/shipping-calculator#shippingcalculationresult'>ShippingCalculationResult</a> | undefined&#62;`}   />


### test

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;boolean&#62;`}   />




</div>
