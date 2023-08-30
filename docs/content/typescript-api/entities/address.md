---
title: "Address"
weight: 10
date: 2023-07-14T16:57:49.823Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Address
<div class="symbol">


# Address

{{< generation-info sourceFile="packages/core/src/entity/address/address.entity.ts" sourceLine="16" packageName="@vendure/core">}}

Represents a <a href='/typescript-api/entities/customer#customer'>Customer</a>'s address.

## Signature

```TypeScript
class Address extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<Address>)
  @Index() @ManyToOne(type => Customer, customer => customer.addresses) @Index()
    @ManyToOne(type => Customer, customer => customer.addresses)
    customer: Customer;
  @Column({ default: '' }) @Column({ default: '' }) fullName: string;
  @Column({ default: '' }) @Column({ default: '' })
    company: string;
  @Column() @Column() streetLine1: string;
  @Column({ default: '' }) @Column({ default: '' })
    streetLine2: string;
  @Column({ default: '' }) @Column({ default: '' }) city: string;
  @Column({ default: '' }) @Column({ default: '' })
    province: string;
  @Column({ default: '' }) @Column({ default: '' }) postalCode: string;
  @Index() @ManyToOne(type => Country) @Index()
    @ManyToOne(type => Country)
    country: Country;
  @Column({ default: '' }) @Column({ default: '' })
    phoneNumber: string;
  @Column({ default: false }) @Column({ default: false })
    defaultShippingAddress: boolean;
  @Column({ default: false }) @Column({ default: false })
    defaultBillingAddress: boolean;
  @Column(type => CustomAddressFields) @Column(type => CustomAddressFields)
    customFields: CustomAddressFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/address#address'>Address</a>&#62;) => Address"  >}}

{{< member-description >}}{{< /member-description >}}

### customer

{{< member-info kind="property" type="<a href='/typescript-api/entities/customer#customer'>Customer</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### fullName

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### company

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### streetLine1

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### streetLine2

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### city

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### province

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### postalCode

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### country

{{< member-info kind="property" type="<a href='/typescript-api/entities/country#country'>Country</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### phoneNumber

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### defaultShippingAddress

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### defaultBillingAddress

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomAddressFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
