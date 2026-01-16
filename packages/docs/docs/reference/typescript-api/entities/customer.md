---
title: "Customer"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Customer

<GenerationInfo sourceFile="packages/core/src/entity/customer/customer.entity.ts" sourceLine="22" packageName="@vendure/core" />

This entity represents a customer of the store, typically an individual person. A Customer can be
a guest, in which case it has no associated <a href='/reference/typescript-api/entities/user#user'>User</a>. Customers with registered account will
have an associated User entity.

```ts title="Signature"
class Customer extends VendureEntity implements ChannelAware, HasCustomFields, SoftDeletable {
    constructor(input?: DeepPartial<Customer>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    @Column({ nullable: true })
    title: string;
    @Column() firstName: string;
    @Column() lastName: string;
    @Column({ nullable: true })
    phoneNumber: string;
    @Column()
    emailAddress: string;
    @ManyToMany(type => CustomerGroup, group => group.customers)
    @JoinTable()
    groups: CustomerGroup[];
    @OneToMany(type => Address, address => address.customer)
    addresses: Address[];
    @OneToMany(type => Order, order => order.customer)
    orders: Order[];
    @OneToOne(type => User, { eager: true })
    @JoinColumn()
    user?: User;
    @Column(type => CustomCustomerFields)
    customFields: CustomCustomerFields;
    @ManyToMany(type => Channel, channel => channel.customers)
    @JoinTable()
    channels: Channel[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;) => Customer`}   />


### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />


### title

<MemberInfo kind="property" type={`string`}   />


### firstName

<MemberInfo kind="property" type={`string`}   />


### lastName

<MemberInfo kind="property" type={`string`}   />


### phoneNumber

<MemberInfo kind="property" type={`string`}   />


### emailAddress

<MemberInfo kind="property" type={`string`}   />


### groups

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>[]`}   />


### addresses

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/address#address'>Address</a>[]`}   />


### orders

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>[]`}   />


### user

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/user#user'>User</a>`}   />


### customFields

<MemberInfo kind="property" type={`CustomCustomerFields`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />




</div>
