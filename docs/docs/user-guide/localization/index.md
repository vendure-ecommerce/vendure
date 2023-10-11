---
title: "Localization"
weight: 10
---

# Localization

Vendure supports **customer-facing** (Shop API) localization by allowing you to define translations for the following objects:

* Collections
* Countries
* Facets
* FacetValue
* Products
* ProductOptions
* ProductOptionGroups
* ProductVariants
* ShippingMethods  

Vendure supports **admin-facing** (Admin API and Admin UI) localization by allowing you to define translations for labels and descriptions of the following objects:
  
* CustomFields
* CollectionFilters
* PaymentMethodHandlers
* PromotionActions
* PromotionConditions
* ShippingCalculators
* ShippingEligibilityCheckers

## How to enable languages

To select the set of languages you wish to create translations for, set them in the [global settings]({{< relref "/user-guide/settings/global-settings" >}}).

Once more than one language is enabled, you will see a language switcher appear when editing the object types listed above.

![../settings/screen-translations.webp](../settings/screen-translations.webp)

## Setting the Admin UI language

Separately, you can change the language used in the Admin UI from the menu in the top right. Note that changing the UI language has no effect on the localization of your products etc.

![./screen-ui-language.webp](./screen-ui-language.webp)
