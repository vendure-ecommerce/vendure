---
title: "PromotionOptions"
weight: 10
date: 2023-07-21T07:17:00.625Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PromotionOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="704" packageName="@vendure/core" />



```ts title="Signature"
interface PromotionOptions {
  promotionConditions?: Array<PromotionCondition<any>>;
  promotionActions?: Array<PromotionAction<any>>;
}
```

<div className="members-wrapper">

### promotionConditions

<MemberInfo kind="property" type="Array&#60;<a href='/docs/reference/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>&#60;any&#62;&#62;"   />

An array of conditions which can be used to construct Promotions
### promotionActions

<MemberInfo kind="property" type="Array&#60;<a href='/docs/reference/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>&#60;any&#62;&#62;"   />

An array of actions which can be used to construct Promotions


</div>
