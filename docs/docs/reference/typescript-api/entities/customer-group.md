---
title: "CustomerGroup"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomerGroup

<GenerationInfo sourceFile="packages/core/src/entity/customer-group/customer-group.entity.ts" sourceLine="17" packageName="@vendure/core" />

A grouping of <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>s which enables features such as group-based promotions
or tax rules.

```ts title="Signature"
class CustomerGroup extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<CustomerGroup>)
    @Column() name: string;
    @ManyToMany(type => Customer, customer => customer.groups)
    customers: Customer[];
    @Column(type => CustomCustomerGroupFields)
    customFields: CustomCustomerGroupFields;
    @OneToMany(type => TaxRate, taxRate => taxRate.zone)
    taxRates: TaxRate[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;) => CustomerGroup`}   />


### name

<MemberInfo kind="property" type={`string`}   />


### customers

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomCustomerGroupFields`}   />


### taxRates

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>[]`}   />




</div>
