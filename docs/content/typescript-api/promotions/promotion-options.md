---
title: "PromotionOptions"
weight: 10
date: 2023-07-14T16:57:49.758Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PromotionOptions
<div class="symbol">


# PromotionOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="704" packageName="@vendure/core">}}



## Signature

```TypeScript
interface PromotionOptions {
  promotionConditions?: Array<PromotionCondition<any>>;
  promotionActions?: Array<PromotionAction<any>>;
}
```
## Members

### promotionConditions

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>&#60;any&#62;&#62;"  >}}

{{< member-description >}}An array of conditions which can be used to construct Promotions{{< /member-description >}}

### promotionActions

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;any&#62;&#62;"  >}}

{{< member-description >}}An array of actions which can be used to construct Promotions{{< /member-description >}}


</div>
