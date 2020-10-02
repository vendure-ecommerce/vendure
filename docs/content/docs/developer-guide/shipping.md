---
title: "Shipping & Fulfillment"
showtoc: true
---
# Shipping & Fulfillment

Shipping in Vendure is handled by [ShippingMethods]({{< relref "shipping-method" >}}). Multiple ShippingMethods can be set up and then your storefront can query [`eligibleShippingMethods`]({{< relref "/docs/graphql-api/shop/queries" >}}#eligibleshippingmethods) to find out which ones can be applied to the active order.

A ShippingMethod is composed of a **checker** and a **calculator**. When querying `eligibleShippingMethods`, each of the defined ShippingMethods' checker functions are executed to find out whether the order is eligible for that method, and if so, the calculator is executed to determine the shipping cost.

## Creating a custom checker

Custom checkers can be created by defining a [`ShippingEligibilityChecker` object]({{< relref "shipping-eligibility-checker" >}}).

For example, you could create a checker which works with a custom "weight" field to only apply to orders below a certain weight:

```TypeScript
import { LanguageCode, ShippingEligibilityChecker } from '@vendure/core';

export const maxWeightChecker = new ShippingEligibilityChecker({
  code: 'max-weight-checker',
  description: [
    { languageCode: LanguageCode.en, value: 'Max Weight Checker' }
  ],
  args: {
    maxWeight: {
      type: 'int',
      ui: { component: 'number-form-input', suffix: 'grams' },
      label: [{ languageCode: LanguageCode.en, value: 'Maximum order weight' }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: 'Order is eligible only if its total weight is less than the specified value',
        },
      ],
    },
  },

  /**
   * Must resolve to a boolean value, where `true` means that the order is
   * eligible for this ShippingMethod.
   *
   * (This example assumes a custom field "weight" is defined on the
   * ProductVariant entity)
   */
  check: (order, args) => {
    const totalWeight = order.lines
      .map((l) => (l.productVariant.customFields as any).weight * l.quantity)
      .reduce((total, lineWeight) => total + lineWeight, 0);
    
    return totalWeight <= args.maxWeight;
  },
});
```
Custom checkers are then passed into the VendureConfig [ShippingOptions]({{< relref "shipping-options" >}}) to make them available when setting up new ShippingMethods:

```TypeScript
import { defaultShippingEligibilityChecker, VendureConfig } from '@vendure/core';
import { maxWeightChecker } from './max-weight-checker';

export const config: VendureConfig = {
  // ...
  shippingOptions: {
    shippingEligibilityCheckers: [
      defaultShippingEligibilityChecker,
      maxWeightChecker,
    ],
  }
}
```

## Creating a custom calculator

Custom calculators can be created by defining a [`ShippingCalculator` object]({{< relref "shipping-calculator" >}}).

For example, you could create a calculator which consults an external data source (e.g. a spreadsheet, database or 3rd-party API) to find out the cost and estimated delivery time for the order.

```TypeScript
import { LanguageCode, ShippingCalculator } from '@vendure/core';
import { shippingDataSource } from './shipping-data-source';

export const externalShippingCalculator = new ShippingCalculator({
  code: 'external-shipping-calculator',
  description: [{ languageCode: LanguageCode.en, value: 'Calculates cost from external source' }],
  args: {
    taxRate: {
      type: 'int',
      ui: { component: 'number-form-input', suffix: '%' },
      label: [{ languageCode: LanguageCode.en, value: 'Tax rate' }],
    },
  },
  calculate: async (order, args) => {
    // `shippingDataSource` is assumed to fetch the data from some
    // external data source.
    const { rate, deliveryDate, courier } = await shippingDataSource.getRate({
      destination: order.shippingAddress,
      contents: order.lines,
    });

    return { 
      price: rate, 
      priceWithTax: rate * ((100 + args.taxRate) / 100),
      // metadata is optional but can be used to pass arbitrary
      // data about the shipping estimate to the storefront.
      metadata: { courier, deliveryDate },
    };
  },
});
```

Custom calculators are then passed into the VendureConfig [ShippingOptions]({{< relref "shipping-options" >}}) to make them available when setting up new ShippingMethods:

```TypeScript
import { defaultShippingCalculator, VendureConfig } from '@vendure/core';
import { externalShippingCalculator } from './external-shipping-calculator';

export const config: VendureConfig = {
  // ...
  shippingOptions: {
    shippingCalculators: [
      defaultShippingCalculator,
      externalShippingCalculator,
    ],
  }
}
```

## Fulfillments

Fulfillments represent the actual shipping status of items in an order. Like Orders, Fulfillments are governed by a [finite state machine]({{< relref "fsm" >}}) and by default, a Fulfillment can be in one of the [following states]({{< relref "fulfillment-state" >}}):

* `Pending` The Fulfillment has been created
* `Shipped` The Fulfillment has been shipped
* `Delivered` The Fulfillment has arrived with the customer
* `Cancelled` The Fulfillment has been cancelled 

These states cover the typical workflow for fulfilling orders. However, it is possible to customize the fulfillment workflow by defining a [CustomFulfillmentProcess]({{< relref "custom-fulfillment-process" >}}) and passing it to your VendureConfig:

```TypeScript
export const config: VendureConfig = {
  // ...
  shippingOptions: {
    customFulfillmentProcess: [myCustomFulfillmentProcess],
  },
};
```

For a more detailed look at how custom processes are used, see the [Customizing The Order Process guide]({{< relref "customizing-the-order-process" >}}).
