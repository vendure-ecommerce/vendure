---
title: "Stock Control"
showtoc: true
---

# Stock Control

Vendure includes features to help manage your stock levels, stock allocations and back orders. The basic purpose is to help you keep track of how many of a given ProductVariant you have available to sell.

Stock control is enabled globally via the Global Settings:

{{< figure src="./global-stock-control.jpg" >}}

It can be disabled if, for example, you manage your stock with a separate inventory management system and synchronize stock levels into Vendure automatically. The setting can also be overridden at the individual ProductVariant level.

## Stock Control Concepts

* **Stock on hand:** This refers to the number of physical units of a particular variant which you have in stock right now. This can be zero or more, but not negative.
* **Allocated:** This refers to the number of units which have been assigned to Orders, but which have not yet been fulfilled.
* **Out-of-stock threshold:** This value determines the stock level at which the variant is considered "out of stock". This value is set globally, but can be overridden for specific variants. It defaults to `0`.
* **Saleable:** This means the number of units that can be sold right now. The formula is:
    `saleable = stockOnHand - allocated - outOfStockThreshold`

Here's a table to better illustrate the relationship between these concepts:

Stock on hand | Allocated | Out-of-stock threshold | Saleable
--------------|-----------|------------------------|----------
10            | 0         | 0                      | 10
10            | 0         | 3                      | 7
10            | 5         | 0                      | 5
10            | 5         | 3                      | 2
10            | 10        | 0                      | 0
10            | 10        | -5                     | 5

The saleable value is what determines whether the customer is able to add a variant to an order. If there is 0 saleable stock, then any attempt to add to the order will result in an [`InsufficientStockError`]({{< relref "/docs/graphql-api/shop/object-types" >}}#insufficientstockerror).

```JSON
{
  "data": {
    "addItemToOrder": {
      "errorCode": "INSUFFICIENT_STOCK_ERROR",
      "message": "Only 105 items were added to the order due to insufficient stock",
      "quantityAvailable": 105,
      "order": {
        "id": "2",
        "totalQuantity": 106
      }
    }
  }
}
```

### Back orders

You may have noticed that the `outOfStockThreshold` value can be set to a negative number. This allows you to sell variants even when you don't physically have them in stock. This is known as a "back order". 

Back orders can be really useful to allow orders to keep flowing even when stockOnHand temporarily drops to zero. For many businesses with predictable re-supply schedules they make a lot of sense.

Once a customer completes checkout, those variants in the order are marked as `allocated`. When a Fulfillment is created, those allocations are converted to Sales and the `stockOnHand` of each variant is adjusted. Fulfillments may only be created if there is sufficient stock on hand.

### Configurable stock allocation

By default, stock is allocated when checkout completes, which means when the Order transitions to the `'PaymentAuthorized'` or `'PaymentSettled'` state. However, you may have special requirements which mean you wish to allocate stock earlier or later in the order process. With the new [StockAllocationStrategy]({{< relref "stock-allocation-strategy" >}}) you can tailor allocation to your exact needs.
