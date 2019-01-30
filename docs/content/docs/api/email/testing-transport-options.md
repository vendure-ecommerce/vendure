---
title: "TestingTransportOptions"
weight: 10
date: 2019-01-30T10:57:03.744Z
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# TestingTransportOptions

{{< generation-info source="/server/src/config/email/email-transport-options.ts">}}

Forwards the raw GeneratedEmailContext object to a provided callback, for use in testing.

### type

{{< member-info kind="property" type="'testing'" >}}



### onSend

{{< member-info kind="property" type="(context: GeneratedEmailContext) =&#62; void" >}}

Callback to be invoked when an email would be sent.

