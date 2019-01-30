---
title: "OrderMergeStrategy"
weight: 10
date: 2019-01-30T10:57:03.758Z
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# OrderMergeStrategy

{{< generation-info source="/server/src/config/order-merge-strategy/order-merge-strategy.ts">}}

An OrderMergeStrategy defines what happens when a Customer with an existing Ordersigns in with a guest Order, where both Orders may contain differing OrderLines.Somehow these differing OrderLines need to be reconciled into a single collectionof OrderLines. The OrderMergeStrategy defines the rules governing this reconciliation.

### merge

{{< member-info kind="method" type="(guestOrder: Order, existingOrder: Order) => OrderLine[]" >}}



