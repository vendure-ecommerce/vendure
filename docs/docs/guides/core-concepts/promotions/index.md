---
title: 'Promotions'
---

Promotions are a means of offering discounts on an order based on various criteria. A Promotion consists of _conditions_ and _actions_.

- **conditions** are the rules which determine whether the Promotion should be applied to the order.
- **actions** specify exactly how this Promotion should modify the order.

## Parts of a Promotion

### Constraints

All Promotions can have the following constraints applied to them:

- **Date range** Using the "starts at" and "ends at" fields, the Promotion can be scheduled to only be active during the given date range.
- **Coupon code** A Promotion can require a coupon code first be activated using the [`applyCouponCode` mutation](/reference/graphql-api/shop/mutations/#applycouponcode) in the Shop API.
- **Per-customer limit** A Promotion coupon may be limited to a given number of uses per Customer.

### Conditions

A Promotion may be additionally constrained by one or more conditions. When evaluating whether a Promotion should be applied, each of the defined conditions is checked in turn. If all the conditions evaluate to `true`, then any defined actions are applied to the order.

Vendure comes with some built-in conditions, but you can also create your own conditions (see section below).

### Actions

A promotion action defines exactly how the order discount should be calculated. **At least one** action must be specified for a valid Promotion.

Vendure comes with some built-in actions, but you can also create your own actions (see section below).

## Creating custom conditions

To create a custom condition, you need to define a new [`PromotionCondition` object](/reference/typescript-api/promotions/promotion-condition/).
A promotion condition is an example of a [configurable operation](/guides/developer-guide/strategies-configurable-operations/#configurable-operations).
Here is an annotated example of one of the built-in PromotionConditions.

```ts
import { LanguageCode, PromotionCondition } from '@vendure/core';

export const minimumOrderAmount = new PromotionCondition({
    /** A unique identifier for the condition */
    code: 'minimum_order_amount',

    /**
     * A human-readable description. Values defined in the
     * `args` object can be interpolated using the curly-braces syntax.
     */
    description: [
        {languageCode: LanguageCode.en, value: 'If order total is greater than { amount }'},
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
            ui: {component: 'currency-form-input'},
        },
        taxInclusive: {type: 'boolean'},
    },

    /**
     * This is the business logic of the condition. It is a function that
     * must resolve to a boolean value indicating whether the condition has
     * been satisfied.
     */
    check(ctx, order, args) {
        if (args.taxInclusive) {
            return order.subTotalWithTax >= args.amount;
        } else {
            return order.subTotal >= args.amount;
        }
    },
});
```

Custom promotion conditions are then passed into the VendureConfig [PromotionOptions](/reference/typescript-api/promotions/promotion-options/) to make them available when setting up Promotions:

```ts title="src/vendure-config.ts"
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

There are three kinds of PromotionAction:

- [`PromotionItemAction`](/reference/typescript-api/promotions/promotion-action#promotionitemaction) applies a discount on the `OrderLine` level, i.e. it would be used for a promotion like "50% off USB cables".
- [`PromotionOrderAction`](/reference/typescript-api/promotions/promotion-action#promotionorderaction) applies a discount on the `Order` level, i.e. it would be used for a promotion like "5% off the order total".
- [`PromotionShippingAction`](/reference/typescript-api/promotions/promotion-action#promotionshippingaction) applies a discount on the shipping, i.e. it would be used for a promotion like "free shipping".

The implementations of each type is similar, with the difference being the arguments passed to the `execute()`.

Here's an example of a simple PromotionOrderAction.

```ts
import { LanguageCode, PromotionOrderAction } from '@vendure/core';

export const orderPercentageDiscount = new PromotionOrderAction({
    // See the custom condition example above for explanations
    // of code, description & args fields.
    code: 'order_percentage_discount',
    description: [{languageCode: LanguageCode.en, value: 'Discount order by { discount }%'}],
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
    execute(ctx, order, args) {
        const orderTotal = ctx.channel.pricesIncludeTax ? order.subTotalWithTax : order.subTotal;
        return -orderTotal * (args.discount / 100);
    },
});
```

Custom PromotionActions are then passed into the VendureConfig [PromotionOptions](/reference/typescript-api/promotions/promotion-options) to make them available when setting up Promotions:

```ts title="src/vendure-config.ts"
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
};
```

## Free gift promotions

Vendure v1.8 introduced a new **side effect API** to PromotionActions, which allow you to define some additional action to be performed when a Promotion becomes active or inactive.

A primary use-case of this API is to add a free gift to the Order. Here's an example of a plugin which implements a "free gift" action:

```ts title="src/plugins/free-gift/free-gift.plugin.ts"
import {
	ID, idsAreEqual, isGraphQlErrorResult, LanguageCode, Logger,
	OrderLine, OrderService, PromotionItemAction, VendurePlugin,
} from "@vendure/core";
import { createHash } from "crypto";

let orderService: OrderService;
export const freeGiftAction = new PromotionItemAction({
	code: "free_gift",
	description: [{ languageCode: LanguageCode.en, value: "Add free gifts to the order" }],
	args: {
		productVariantIds: {
			type: "ID",
			list: true,
			ui: { component: "product-selector-form-input" },
			label: [{ languageCode: LanguageCode.en, value: "Gift product variants" }],
		},
	},
	init(injector) {
		orderService = injector.get(OrderService);
	},
	execute(ctx, orderLine, args) {
		// This part is responsible for ensuring the variants marked as
		// "free gifts" have their price reduced to zero
		if (lineContainsIds(args.productVariantIds, orderLine)) {
			const unitPrice = orderLine.productVariant.listPriceIncludesTax
				? orderLine.unitPriceWithTax
				: orderLine.unitPrice;
			return -unitPrice;
		}
		return 0;
	},
	// The onActivate function is part of the side effect API, and
	// allows us to perform some action whenever a Promotion becomes active
	// due to it's conditions & constraints being satisfied.
	async onActivate(ctx, order, args, promotion) {
		for (const id of args.productVariantIds) {
			if (
				!order.lines.find(
					(line) =>
						idsAreEqual(line.productVariant.id, id) &&
						line.customFields.freeGiftPromotionId == null
				)
			) {
				// The order does not yet contain this free gift, so add it
				const result = await orderService.addItemToOrder(ctx, order.id, id, 1, {
					freeGiftPromotionId: promotion.id.toString(),
				});
				if (isGraphQlErrorResult(result)) {
					Logger.error(`Free gift action error for variantId "${id}": ${result.message}`);
				}
			}
		}
	},
	// The onDeactivate function is the other part of the side effect API and is called
	// when an active Promotion becomes no longer active. It should reverse any
	// side effect performed by the onActivate function.
	async onDeactivate(ctx, order, args, promotion) {
		const linesWithFreeGift = order.lines.filter(
			(line) => line.customFields.freeGiftPromotionId === promotion.id.toString()
		);
		for (const line of linesWithFreeGift) {
			await orderService.removeItemFromOrder(ctx, order.id, line.id);
		}
	},
});

function lineContainsIds(ids: ID[], line: OrderLine): boolean {
	return !!ids.find((id) => idsAreEqual(id, line.productVariant.id));
}

@VendurePlugin({
	configuration: (config) => {
		config.customFields.OrderLine.push({
			name: "freeGiftPromotionId",
			type: "string",
			public: true,
			readonly: true,
			nullable: true,
		});
		config.customFields.OrderLine.push({
			name: "freeGiftDescription",
			type: "string",
			public: true,
			readonly: true,
			nullable: true,
		});
		config.promotionOptions.promotionActions.push(freeGiftAction);
		return config;
	},
})
export class FreeGiftPromotionPlugin {}
```

## Dependency relationships

It is possible to establish dependency relationships between a PromotionAction and one or more PromotionConditions.

For example, if we want to set up a "buy 1, get 1 free" offer, we need to:

1. Establish whether the Order contains the particular ProductVariant under offer (done in the PromotionCondition)
2. Apply a discount to the qualifying OrderItem (done in the PromotionAction)

In this scenario, we would have to repeat the logic for checking the Order contents in _both_ the PromotionCondition _and_ the PromotionAction. Not only is this duplicated work for the server, it also means that setting up the promotion relies on the same parameters being input into the PromotionCondition and the PromotionAction.

Instead, we can say that the PromotionAction _depends_ on the PromotionCondition:

```ts
export const buy1Get1FreeAction = new PromotionItemAction({
    code: 'buy_1_get_1_free',
    description: [{
        languageCode: LanguageCode.en,
        value: 'Buy 1, get 1 free',
    }],
    args: {},
    // highlight-next-line
    conditions: [buyXGetYFreeCondition],
    execute(ctx, orderItem, orderLine, args, state) {
        // highlight-next-line
        const freeItemIds = state.buy_x_get_y_free.freeItemIds;
        if (idsContainsItem(freeItemIds, orderItem)) {
            const unitPrice = ctx.channel.pricesIncludeTax ? orderLine.unitPriceWithTax : orderLine.unitPrice;
            return -unitPrice;
        }
        return 0;
    },
});
```

In the above code, we are stating that this PromotionAction _depends_ on the `buyXGetYFreeCondition` PromotionCondition. Attempting to create a Promotion using the `buy1Get1FreeAction` without also using the `buyXGetYFreeCondition` will result in an error.

In turn, the `buyXGetYFreeCondition` can return a _state object_ with the type `{ [key: string]: any; }` instead of just a `true` boolean value. This state object is then passed to the PromotionConditions which depend on it, as part of the last argument (`state`).

```ts
export const buyXGetYFreeCondition = new PromotionCondition({
    code: 'buy_x_get_y_free',
    description: [{
        languageCode: LanguageCode.en,
        value: 'Buy { amountX } of { variantIdsX } products, get { amountY } of { variantIdsY } products free',
    }],
    args: {
        // omitted for brevity
    },
    async check(ctx, order, args) {
        // logic omitted for brevity
        if (freeItemIds.length === 0) {
            return false;
        }
        // highlight-next-line
        return {freeItemIds};
    },
});
```

## Injecting providers

If your PromotionCondition or PromotionAction needs access to the database or other providers, they can be injected by defining an `init()` function in your PromotionAction or PromotionCondition. See the [configurable operation guide](/guides/developer-guide/strategies-configurable-operations/#injecting-dependencies) for details.
