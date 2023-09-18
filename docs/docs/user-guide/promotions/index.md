---
title: "Promotions"
weight: 4
---

# Promotions

Promotions are a means of offering discounts on an order based on various criteria. A Promotion consists of _conditions_ and _actions_.

* **conditions** are the rules which determine whether the Promotion should be applied to the order.
* **actions** specify exactly how this Promotion should modify the order.

## Promotion Conditions

A condition defines the criteria that must be met for the Promotion to be activated. Vendure comes with some simple conditions provided which enable things like:

* If the order total is at least $X
* Buy at least X of a certain product
* But at least X of any product with the specified [FacetValues]({{< relref "/user-guide/catalog/facets" >}})
* If the customer is a member of the specified [Customer Group]({{< relref "/user-guide/customers" >}}#customer-groups)

Vendure allows completely custom conditions to be defined by your developers, implementing the specific logic needed by your business.

## Coupon codes

A coupon code can be any text which will activate a Promotion. A coupon code can be used in conjunction with conditions if desired.


{{< alert "primary" >}}
Note: Promotions **must** have either a **coupon code** _or_ **at least 1 condition** defined.
{{< /alert >}}

## Promotion Actions

If all the defined conditions pass (or if the specified coupon code is used), then the actions are performed on the order. Vendure comes with some commonly-used actions which allow promotions like:

* Discount the whole order by a fixed amount
* Discount the whole order by a percentage
* Discount selected products by a percentage
* Free shipping

## Coupon code per-customer limit

If a per-customer limit is specified, then the specified coupon code may only be used that many times by a single Customer. For guest checkouts, the "same customer" status is determined by the email address used when checking out.
