---
title: "Configurable Products"
---


One common use of custom fields is to support configurable products. Imagine we are selling pens which allow some text to be engraved. To do this we would add a **custom field on the OrderLine**:

```ts
OrderLine: [
    {
        name: 'engravingText',
        type: 'string',
        label: [
            {
                languageCode: LanguageCode.en,
                value: 'The text to engrave on the product'
            },
        ],
    },
]
```

Once defined, the [addItemToOrder mutation]({{< relref "/reference/graphql-api/shop/mutations" >}}#additemtoorder) will have a third argument available, which accepts values for the custom field defined above:

```graphql
mutation {
    addItemToOrder(
        productVariantId: "42"
        quantity: 1
        customFields: {
            engravingText: "Thanks for all the fish!"
        }
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

Furthermore, the values of these OrderLine custom fields can even be used to modify the price. This is done by defining a custom [OrderItemPriceCalculationStrategy]({{< relref "order-item-price-calculation-strategy" >}}):

```ts
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
            // Add $5 for engraving
            price += 500;
        }
        return {
            price,
            priceIncludesTax: productVariant.listPriceIncludesTax,
        };
    }
}
```
