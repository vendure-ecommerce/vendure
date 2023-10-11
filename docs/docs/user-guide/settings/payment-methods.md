---
title: "Payment Methods"
---

# Payment Methods

Payment methods define how your storefront handles payments. Your storefront may offer multiple payment methods or just one.

A Payment method consists of two parts: an **eligibility checker** and a **handler**

## Payment eligibility checker

This is an optional part which can be useful in certain situations where you want to limit a payment method based on things like:

* Billing address
* Order contents or total price
* Customer group

Since these requirements are particular to your business needs, Vendure does not provide any built-in checkers, but your developers can create one to suit your requirements.

## Payment handler

The payment handler contains the actual logic for processing a payment. Again, since there are many ways to handle payments, Vendure only provides a "dummy handler" by default and it is up to your developers to create integrations. 

Payment handlers can be created which enable payment via:

* Popular payment services such as Stripe, Paypal, Braintree, Klarna etc
* Pay-on-delivery
* Store credit
* etc


