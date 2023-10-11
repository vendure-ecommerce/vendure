---
title: "Configurable Products"
---

A "configurable product" is one where aspects can be configured by the customer, and are unrelated to the product's variants. Examples include:

- Engraving text on an item
- A gift message inserted with the packaging
- An uploaded image to be printed on a t-shirt

In Vendure this is done by defining one or more [custom fields](/guides/developer-guide/custom-fields/) on the [OrderLine](/reference/typescript-api/entities/order-line/) entity.

## Defining custom fields

Let's take the example of an engraving service. Some products can be engraved, others cannot. We will record this information in a custom field on the [ProductVariant](/reference/typescript-api/entities/product-variant/) entity:

```ts title="src/vendure-config.ts"
import { VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
    // ...
    customFields: {
        ProductVariant: [
            {
                name: 'engravable',
                type: 'boolean',
                defaultValue: false,
                label: [
                    { languageCode: LanguageCode.en, value: 'Engravable' },
                ],
            },
        ],
    },
};
```

For those variants that _are_ engravable, we need to be able to record the text to be engraved. This is done by defining a custom field on the [OrderLine](/reference/typescript-api/entities/order-line/) entity:

```ts title="src/vendure-config.ts"
import { VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
    // ...
    customFields: {
        OrderLine: [
            {
                name: 'engravingText',
                type: 'string',
                validate: value => {
                    if (value.length > 100) {
                        return 'Engraving text must be less than 100 characters';
                    }
                },
                label: [
                    { languageCode: LanguageCode.en, value: 'Engraving text' },
                ],
            },
        ]
    },
};
```

## Setting the custom field value

Once the custom fields are defined, the [addItemToOrder mutation](/reference/graphql-api/shop/mutations/#additemtoorder) will have a third argument available, which accepts values for the custom field defined above:

```graphql
mutation {
    addItemToOrder(
        productVariantId: "42"
        quantity: 1
        // highlight-start
        customFields: {
            engravingText: "Thanks for all the fish!"
        }
        // highlight-end
    ) {
        ...on Order {
            id
            lines {
                id
                quantity
                customFields {
                    engravingText
                }
            }
        }
    }
}
```

Your storefront application will need to provide a `<textarea>` for the customer to enter the engraving text, which would be displayed conditionally depending on the value of the `engravable` custom field on the `ProductVariant`. 

## Modifying the price

The values of these OrderLine custom fields can even be used to modify the price. This is done by defining a custom [OrderItemPriceCalculationStrategy](/reference/typescript-api/orders/order-item-price-calculation-strategy/). 

Let's say that our engraving service costs and extra $10 on top of the regular price of the product variant. Here's a strategy to implement this:

```ts title="src/engraving-price-calculation-strategy.ts"
import {
    RequestContext, PriceCalculationResult,
    ProductVariant, OrderItemPriceCalculationStrategy
} from '@vendure/core';

export class EngravingPriceStrategy implements OrderItemPriceCalculationStrategy {

    calculateUnitPrice(
        ctx: RequestContext,
        productVariant: ProductVariant,
        customFields: { engravingText?: string },
    ) {
        let price = productVariant.listPrice;
        if (customFields.engravingText) {
            // Add $10 for engraving
            price += 1000;
        }
        return {
            price,
            priceIncludesTax: productVariant.listPriceIncludesTax,
        };
    }
}
```

This is then added to the config:

```ts title="src/vendure-config.ts"
import { VendureConfig } from '@vendure/core';
import { EngravingPriceStrategy } from './engraving-price-calculation-strategy';

export const config: VendureConfig = {
    // ...
    orderOptions: {
        orderItemPriceCalculationStrategy: new EngravingPriceStrategy(),
    },
};
```
