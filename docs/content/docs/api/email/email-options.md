---
title: "EmailOptions"
weight: 10
date: 2019-01-30T10:57:03.856Z
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# EmailOptions

{{< generation-info source="/server/src/config/vendure-config.ts">}}



### emailTemplatePath

{{< member-info kind="property" type="string" >}}

Path to the email template files.

### emailTypes

{{< member-info kind="property" type="EmailTypes&#60;EmailType&#62;" >}}

Configuration for the creation and templating of each email type

### generator

{{< member-info kind="property" type="EmailGenerator" >}}

The EmailGenerator uses the EmailContext and template to generate the email body

### transport

{{< member-info kind="property" type="EmailTransportOptions" >}}

Configuration for the transport (email sending) method

