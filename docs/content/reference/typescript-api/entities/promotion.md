---
title: "Promotion"
weight: 10
date: 2023-07-14T16:57:49.967Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Promotion
<div class="symbol">


# Promotion

{{< generation-info sourceFile="packages/core/src/entity/promotion/promotion.entity.ts" sourceLine="57" packageName="@vendure/core">}}

A Promotion is used to define a set of conditions under which promotions actions (typically discounts)
will be applied to an Order.

Each assigned <a href='/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a> is checked against the Order, and if they all return `true`,
then each assign <a href='/typescript-api/promotions/promotion-action#promotionitemaction'>PromotionItemAction</a> / <a href='/typescript-api/promotions/promotion-action#promotionorderaction'>PromotionOrderAction</a> is applied to the Order.

## Signature

```TypeScript
class Promotion extends AdjustmentSource implements ChannelAware, SoftDeletable, HasCustomFields, Translatable {
  type = AdjustmentType.PROMOTION;
  constructor(input?: DeepPartial<Promotion> & {
            promotionConditions?: Array<PromotionCondition<any>>;
            promotionActions?: Array<PromotionAction<any>>;
        })
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    startsAt: Date | null;
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    endsAt: Date | null;
  @Column({ nullable: true }) @Column({ nullable: true })
    couponCode: string;
  @Column({ nullable: true }) @Column({ nullable: true })
    perCustomerUsageLimit: number;
  name: LocaleString;
  description: LocaleString;
  @OneToMany(type => PromotionTranslation, translation => translation.base, { eager: true }) @OneToMany(type => PromotionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Promotion>>;
  @Column() @Column() enabled: boolean;
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
  @Column(type => CustomPromotionFields) @Column(type => CustomPromotionFields)
    customFields: CustomPromotionFields;
  @Column('simple-json') @Column('simple-json') conditions: ConfigurableOperation[];
  @Column('simple-json') @Column('simple-json') actions: ConfigurableOperation[];
  @Column() @Column() priorityScore: number;
  async apply(ctx: RequestContext, args: ApplyOrderActionArgs | ApplyOrderItemActionArgs | ApplyShippingActionArgs, state?: PromotionState) => Promise<Adjustment | undefined>;
  async test(ctx: RequestContext, order: Order) => Promise<PromotionTestResult>;
  async activate(ctx: RequestContext, order: Order) => ;
  async deactivate(ctx: RequestContext, order: Order) => ;
}
```
## Extends

 * AdjustmentSource


## Implements

 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>
 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>


## Members

### type

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>&#62; &#38; {             promotionConditions?: Array&#60;<a href='/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>&#60;any&#62;&#62;;             promotionActions?: Array&#60;<a href='/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;any&#62;&#62;;         }) => Promotion"  >}}

{{< member-description >}}{{< /member-description >}}

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### startsAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### endsAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### couponCode

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### perCustomerUsageLimit

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### description

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### enabled

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomPromotionFields"  >}}

{{< member-description >}}{{< /member-description >}}

### conditions

{{< member-info kind="property" type="ConfigurableOperation[]"  >}}

{{< member-description >}}{{< /member-description >}}

### actions

{{< member-info kind="property" type="ConfigurableOperation[]"  >}}

{{< member-description >}}{{< /member-description >}}

### priorityScore

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The PriorityScore is used to determine the sequence in which multiple promotions are tested
on a given order. A higher number moves the Promotion towards the end of the sequence.

The score is derived from the sum of the priorityValues of the PromotionConditions and
PromotionActions comprising this Promotion.

An example illustrating the need for a priority is this:


Consider 2 Promotions, 1) buy 1 get one free and 2) 10% off when order total is over $50.
If Promotion 2 is evaluated prior to Promotion 1, then it can trigger the 10% discount even
if the subsequent application of Promotion 1 brings the order total down to way below $50.{{< /member-description >}}

### apply

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, args: ApplyOrderActionArgs | ApplyOrderItemActionArgs | ApplyShippingActionArgs, state?: PromotionState) => Promise&#60;Adjustment | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### test

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;PromotionTestResult&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### activate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### deactivate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
