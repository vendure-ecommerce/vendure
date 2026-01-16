---
title: "CustomerHistoryEntry"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomerHistoryEntry

<GenerationInfo sourceFile="packages/core/src/entity/history-entry/customer-history-entry.entity.ts" sourceLine="14" packageName="@vendure/core" />

Represents an event in the history of a particular <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>.

```ts title="Signature"
class CustomerHistoryEntry extends HistoryEntry {
    constructor(input: DeepPartial<CustomerHistoryEntry>)
    @Index()
    @ManyToOne(type => Customer, { onDelete: 'CASCADE' })
    customer: Customer;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/customer-history-entry#customerhistoryentry'>CustomerHistoryEntry</a>&#62;) => CustomerHistoryEntry`}   />


### customer

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>`}   />




</div>
