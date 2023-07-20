---
title: "CustomerGroup"
weight: 10
date: 2023-07-14T16:57:49.870Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CustomerGroup
<div class="symbol">


# CustomerGroup

{{< generation-info sourceFile="packages/core/src/entity/customer-group/customer-group.entity.ts" sourceLine="16" packageName="@vendure/core">}}

A grouping of <a href='/typescript-api/entities/customer#customer'>Customer</a>s which enables features such as group-based promotions
or tax rules.

## Signature

```TypeScript
class CustomerGroup extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<CustomerGroup>)
  @Column() @Column() name: string;
  @ManyToMany(type => Customer, customer => customer.groups) @ManyToMany(type => Customer, customer => customer.groups)
    customers: Customer[];
  @Column(type => CustomCustomerGroupFields) @Column(type => CustomCustomerGroupFields)
    customFields: CustomCustomerGroupFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>&#62;) => CustomerGroup"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### customers

{{< member-info kind="property" type="<a href='/typescript-api/entities/customer#customer'>Customer</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomCustomerGroupFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
