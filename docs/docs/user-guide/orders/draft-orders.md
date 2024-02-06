---
title: "Draft Orders"
---

# Draft Orders

{{% alert "warning" %}}
Note: Draft Orders are available from Vendure v1.8+
{{% /alert %}}

Draft Orders are used when an Administrator would like to manually create an order via the Admin UI. For example, this can be useful when:

- A customer phones up to place an order
- A customer wants to place an order in person
- You want to create an order on behalf of a customer, e.g. for a quote.
- When testing Promotions

To create a Draft Order, click the **"Create draft order"** button from the Order List view.

From there you can:

- Add ProductVariants to the Order using the search input marked "Add item to order"
- Optionally activate coupon codes to trigger Promotions
- Set the customer, shipping and billing addresses
- Select the shipping method

Once ready, click the **"Complete draft"** button to convert this Order from a Draft into a regular Order. At this stage the order can be paid for, and you can manually record the payment details.

{{% alert "primary" %}}
Note: Draft Orders do not appear in a Customer's order history in the storefront (Shop API) while still
in the "Draft" state.
{{% /alert %}}
