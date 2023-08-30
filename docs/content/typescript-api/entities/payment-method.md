---
title: "PaymentMethod"
weight: 10
date: 2023-07-14T16:57:49.934Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaymentMethod
<div class="symbol">


# PaymentMethod

{{< generation-info sourceFile="packages/core/src/entity/payment-method/payment-method.entity.ts" sourceLine="21" packageName="@vendure/core">}}

A PaymentMethod is created automatically according to the configured <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>s defined
in the <a href='/typescript-api/payment/payment-options#paymentoptions'>PaymentOptions</a> config.

## Signature

```TypeScript
class PaymentMethod extends VendureEntity implements Translatable, ChannelAware, HasCustomFields {
  constructor(input?: DeepPartial<PaymentMethod>)
  name: LocaleString;
  @Column({ default: '' }) @Column({ default: '' }) code: string;
  description: LocaleString;
  @OneToMany(type => PaymentMethodTranslation, translation => translation.base, { eager: true }) @OneToMany(type => PaymentMethodTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<PaymentMethod>>;
  @Column() @Column() enabled: boolean;
  @Column('simple-json', { nullable: true }) @Column('simple-json', { nullable: true }) checker: ConfigurableOperation | null;
  @Column('simple-json') @Column('simple-json') handler: ConfigurableOperation;
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
  @Column(type => CustomPaymentMethodFields) @Column(type => CustomPaymentMethodFields)
    customFields: CustomPaymentMethodFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62;) => PaymentMethod"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### description

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### enabled

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### checker

{{< member-info kind="property" type="ConfigurableOperation | null"  >}}

{{< member-description >}}{{< /member-description >}}

### handler

{{< member-info kind="property" type="ConfigurableOperation"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomPaymentMethodFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
