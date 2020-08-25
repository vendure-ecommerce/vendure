---
title: "Promotions"
showtoc: true
---
# Promotions

Promotions are a means of offering discounts on an order based on various criteria. A Promotion consists of _conditions_ and _actions_.

* **conditions** are the rules which determine whether the Promotion should be applied to the order.
* **actions** specify exactly how this Promotion should modify the order.

## Parts of a Promotion

### Constraints

All Promotions can have the following constraints applied to them:

* **Date range** Using the "starts at" and "ends at" fields, the Promotion can be scheduled to only be active during the given date range.
* **Coupon code** A Promotion can require a coupon code first be activated using the [`applyCouponCode` mutation]({{< relref "/docs/graphql-api/shop/mutations" >}}#applycouponcode) in the Shop API.
* **Per-customer limit** A Promotion coupon may be limited to a given number of uses per Customer.

### Conditions

A Promotion may be additionally constrained by one or more conditions. When evaluating whether a Promotion should be applied, each of the defined conditions is checked in turn. If all of them are _true_, then any defined actions are applied to the order.

Vendure comes with some built-in conditions, but you can also create your own conditions (see section below).

### Actions

A promotion action defines exactly how the order discount should be calculated. At least one action must be specified for a valid Promotion.

Vendure comes with some built-in actions, but you can also create your own actions (see section below).

## Creating custom conditions

To create a custom condition, you need to define a new [`PromotionCondition` object]({{< relref "promotion-condition" >}}). 
Here is an annotated example of one of the built-in PromotionsConditions:

```TypeScript
import { LanguageCode, PromotionCondition } from '@vendure/core';

export const minimumOrderAmount = new PromotionCondition({
  /** A unique identifier for the condition */
  code: 'minimum_order_amount',

  /** 
   * A human-readable description. Values defined in the 
   * `args` object can be interpolated using the curly-braces syntax.
   */
  description: [
    { languageCode: LanguageCode.en, value: 'If order total is greater than { amount }' },
  ],

  /**
   * Arguments which can be specified when configuring the condition 
   * in the Admin UI. The values of these args are then available during 
   * the execution of the `check` function.
   */
  args: {
   amount: {
     type: 'int',
     // The optional `ui` object allows you to customize
     // how this arg is rendered in the Admin UI.
     ui: { component: 'currency-form-input' },
   },
    taxInclusive: { type: 'boolean' },
  },

  /**
   * This is the business logic of the condition. It is a function that 
   * must resolve to a boolean value indicating whether the condition has
   * been satisfied.
   */
  check(order, args) {
    if (args.taxInclusive) {
      return order.subTotal >= args.amount;
    } else {
      return order.subTotalBeforeTax >= args.amount;
    }
  },
});
```

Custom PromotionConditions are then passed into the VendureConfig [PromotionOptions]({{< relref "promotion-options" >}}) to make them available when setting up Promotions:

```TypeScript
import { defaultPromotionConditions, VendureConfig } from '@vendure/core';
import { minimumOrderAmount } from './minimum-order-amount';

export const config: VendureConfig = {
  // ...
  promotionOptions: {
    promotionConditions: [
      ...defaultPromotionConditions,
      minimumOrderAmount,
    ],
  }
}
```

## Creating custom actions

There are two kinds of PromotionAction:

* [`PromotionItemAction`]({{< relref "promotion-action" >}}#promotionitemaction) applies a discount on the OrderItem level, i.e. it would be used for a promotion like "50% off USB cables".
* [`PromotionOrderAction`]({{< relref "promotion-action" >}}#promotionorderaction) applies a discount on the Order level, i.e. it would be used for a promotion like "5% off the order total".

Their implementations are similar, with the difference being the arguments passed to the `execute()` function of each.

Here's an example of a simple PromotionOrderAction. 

```TypeScript
import { LanguageCode, PromotionOrderAction } from '@vendure/core';

export const orderPercentageDiscount = new PromotionOrderAction({
  // See the custom condition example above for explanations 
  // of code, description & args fields.
  code: 'order_percentage_discount',
  description: [{ languageCode: LanguageCode.en, value: 'Discount order by { discount }%' }],
  args: {
    discount: {
      type: 'int',
      ui: {
        component: 'number-form-input',
        suffix: '%',
      },
    },
  },

  /**
   * This is the function that defines the actual amount to be discounted.
   * It should return a negative number representing the discount in
   * pennies/cents etc. Rounding to an integer is handled automatically.
   */
  execute(order, args) {
      return -order.subTotal * (args.discount / 100);
  },
});

```

Custom PromotionActions are then passed into the VendureConfig [PromotionOptions]({{< relref "promotion-options" >}}) to make them available when setting up Promotions:

```TypeScript
import { defaultPromotionActions, VendureConfig } from '@vendure/core';
import { orderPercentageDiscount } from './order-percentage-discount';

export const config: VendureConfig = {
  // ...
  promotionOptions: {
    promotionActions: [
      ...defaultPromotionActions,
      orderPercentageDiscount,
    ],
  }
}
```
