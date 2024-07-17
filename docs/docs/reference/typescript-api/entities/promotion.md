---
title: "Promotion"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Promotion

<GenerationInfo sourceFile="packages/core/src/entity/promotion/promotion.entity.ts" sourceLine="56" packageName="@vendure/core" />

A Promotion is used to define a set of conditions under which promotions actions (typically discounts)
will be applied to an Order.

Each assigned <a href='/reference/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a> is checked against the Order, and if they all return `true`,
then each assign <a href='/reference/typescript-api/promotions/promotion-action#promotionitemaction'>PromotionItemAction</a> / <a href='/reference/typescript-api/promotions/promotion-action#promotionorderaction'>PromotionOrderAction</a> is applied to the Order.

```ts title="Signature"
class Promotion extends AdjustmentSource implements ChannelAware, SoftDeletable, HasCustomFields, Translatable {
    type = AdjustmentType.PROMOTION;
    constructor(input?: DeepPartial<Promotion> & {
            promotionConditions?: Array<PromotionCondition<any>>;
            promotionActions?: Array<PromotionAction<any>>;
        })
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    @Column({ type: Date, nullable: true })
    startsAt: Date | null;
    @Column({ type: Date, nullable: true })
    endsAt: Date | null;
    @Column({ nullable: true })
    couponCode: string;
    @Column({ nullable: true })
    perCustomerUsageLimit: number;
    @Column({ nullable: true })
    usageLimit: number;
    name: LocaleString;
    description: LocaleString;
    @OneToMany(type => PromotionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Promotion>>;
    @Column() enabled: boolean;
    @ManyToMany(type => Channel, channel => channel.promotions)
    @JoinTable()
    channels: Channel[];
    @ManyToMany(type => Order, order => order.promotions)
    orders: Order[];
    @Column(type => CustomPromotionFields)
    customFields: CustomPromotionFields;
    @Column('simple-json') conditions: ConfigurableOperation[];
    @Column('simple-json') actions: ConfigurableOperation[];
    @Column() priorityScore: number;
    apply(ctx: RequestContext, args: ApplyOrderActionArgs | ApplyOrderItemActionArgs | ApplyShippingActionArgs, state?: PromotionState) => Promise<Adjustment | undefined>;
    test(ctx: RequestContext, order: Order) => Promise<PromotionTestResult>;
    activate(ctx: RequestContext, order: Order) => ;
    deactivate(ctx: RequestContext, order: Order) => ;
}
```
* Extends: <code>AdjustmentSource</code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>, <code><a href='/reference/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>



<div className="members-wrapper">

### type

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>&#62; &#38; {             promotionConditions?: Array&#60;<a href='/reference/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>&#60;any&#62;&#62;;             promotionActions?: Array&#60;<a href='/reference/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;any&#62;&#62;;         }) => Promotion`}   />


### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />


### startsAt

<MemberInfo kind="property" type={`Date | null`}   />


### endsAt

<MemberInfo kind="property" type={`Date | null`}   />


### couponCode

<MemberInfo kind="property" type={`string`}   />


### perCustomerUsageLimit

<MemberInfo kind="property" type={`number`}   />


### usageLimit

<MemberInfo kind="property" type={`number`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### description

<MemberInfo kind="property" type={`LocaleString`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;&#62;`}   />


### enabled

<MemberInfo kind="property" type={`boolean`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### orders

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomPromotionFields`}   />


### conditions

<MemberInfo kind="property" type={`ConfigurableOperation[]`}   />


### actions

<MemberInfo kind="property" type={`ConfigurableOperation[]`}   />


### priorityScore

<MemberInfo kind="property" type={`number`}   />

The PriorityScore is used to determine the sequence in which multiple promotions are tested
on a given order. A higher number moves the Promotion towards the end of the sequence.

The score is derived from the sum of the priorityValues of the PromotionConditions and
PromotionActions comprising this Promotion.

An example illustrating the need for a priority is this:


Consider 2 Promotions, 1) buy 1 get one free and 2) 10% off when order total is over $50.
If Promotion 2 is evaluated prior to Promotion 1, then it can trigger the 10% discount even
if the subsequent application of Promotion 1 brings the order total down to way below $50.
### apply

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, args: ApplyOrderActionArgs | ApplyOrderItemActionArgs | ApplyShippingActionArgs, state?: PromotionState) => Promise&#60;Adjustment | undefined&#62;`}   />


### test

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;PromotionTestResult&#62;`}   />


### activate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => `}   />


### deactivate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => `}   />




</div>
