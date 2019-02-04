---
title: "DefaultEmailPlugin"
---

# DefaultEmailPlugin

The DefaultEmailPlugin configures the the [EmailOptions]({{< relref "email-options" >}}) to use an [MJML](https://mjml.io/)-based email generator and presents a simplified interface for typical email requirements.

```ts 
const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    new DefaultEmailPlugin({
      templatePath: path.join(__dirname, 'vendure/email/templates'),
      transport: {
        type: 'smtp',
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'username',
          pass: 'password',
        }
      },
    }),
  ],
};
```

## Customizing templates

Emails are generated from templates which use [MJML](https://mjml.io/) syntax. MJML is an open-source HTML-like markup language which makes the task of creating responsive email markup simple. By default, the templates are installed to `<project root>/vendure/email/templates` and can be freely edited.

Dynamic data such as the recipient's name or order items are specified using [Handlebars syntax](https://handlebarsjs.com/):

```HTML
<p>Dear {{ order.customer.firstName }} {{ order.customer.lastName }},</p>

<p>Thank you for your order!</p>

<mj-table cellpadding="6px">
  {{#each order.lines }}
    <tr class="order-row">
      <td>{{ quantity }} x {{ productVariant.name }}</td>
      <td>{{ productVariant.quantity }}</td>
      <td>{{ formatMoney totalPrice }}</td>
    </tr>
  {{/each}}
</mj-table>
```

### Handlebars helpers

The following helper functions are available for use in email templates:

* `formatMoney`: Formats an amount of money (which are always stored as integers in Vendure) as a decimal, e.g. `123` => `1.23`
* `formatDate`: Formats a Date value with the [dateformat](https://www.npmjs.com/package/dateformat) package.

## Dev mode

For development, the `transport` option can be replaced by `devMode: true`. Doing so configures Vendure to use the [file transport]({{< relref "file-transport-options" >}}) and outputs emails as rendered HTML files in a directory named "test-emails" which is located adjacent to the directory configured in the `templatePath`.

```ts 
new DefaultEmailPlugin({
  templatePath: path.join(__dirname, 'vendure/email/templates'),
  devMode: true,
})
```
