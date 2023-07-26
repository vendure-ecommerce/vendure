---
title: "Address"
weight: 10
date: 2023-07-26T18:59:55.698Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Address

<GenerationInfo sourceFile="packages/core/src/entity/address/address.entity.ts" sourceLine="16" packageName="@vendure/core" />

Represents a <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>'s address.

```ts title="Signature"
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
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/address#address'>Address</a>&#62;) => Address`}   />


### customer

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>`}   />


### fullName

<MemberInfo kind="property" type={`string`}   />


### company

<MemberInfo kind="property" type={`string`}   />


### streetLine1

<MemberInfo kind="property" type={`string`}   />


### streetLine2

<MemberInfo kind="property" type={`string`}   />


### city

<MemberInfo kind="property" type={`string`}   />


### province

<MemberInfo kind="property" type={`string`}   />


### postalCode

<MemberInfo kind="property" type={`string`}   />


### country

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/country#country'>Country</a>`}   />


### phoneNumber

<MemberInfo kind="property" type={`string`}   />


### defaultShippingAddress

<MemberInfo kind="property" type={`boolean`}   />


### defaultBillingAddress

<MemberInfo kind="property" type={`boolean`}   />


### customFields

<MemberInfo kind="property" type={`CustomAddressFields`}   />




</div>
