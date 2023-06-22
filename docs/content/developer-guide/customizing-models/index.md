---
title: 'Customizing Models'
showtoc: true
---

# Customizing Models with custom fields

Custom fields allow you to add your own custom data properties to many of the Vendure entities. The entities which may have custom fields defined are listed in the [CustomFields documentation]({{< relref "/typescript-api/custom-fields" >}})

They are specified in the VendureConfig:

```TypeScript
const config = {
  // ...
  customFields: {
    Product: [
      { name: 'infoUrl', type: 'string' },
      { name: 'downloadable', type: 'boolean' },
      { name: 'shortName', type: 'localeString' },
    ],
    User: [
      { name: 'socialLoginToken', type: 'string', unique: true },
    ],
  },
}
```

With the example config above, the following will occur:

1. The database schema will be altered, and a column will be added for each custom field. **Note: changes to custom fields require a database migration**. See the [Migrations guide]({{< relref "migrations" >}}).
2. The GraphQL APIs will be modified to add the custom fields to the `Product` and `User` types respectively.
3. If you are using the [admin-ui-plugin]({{< relref "/typescript-api/core-plugins/admin-ui-plugin" >}}), the Admin UI detail pages will now contain form inputs to allow the custom field data to be added or edited, and the list view data tables will allow custom field columns to be added, sorted and filtered. 


{{< figure src="custom-fields-data-table.webp" >}}

The values of the custom fields can then be set and queried via the GraphQL APIs:

```GraphQL
mutation {
  updateProduct(input: {
    id: 1
    customFields: {
      infoUrl: "https://some-url.com",
      downloadable: true,
    }
    translations: [
      { languageCode: en, customFields: { shortName: "foo" } }
    ]
  }) {
    id
    customFields {
      infoUrl
      downloadable
      shortName
    }
  }
}
```

## Available custom field types

The following types are available for custom fields:

| Type           | Description                  | Example                                   |
| -------------- | ---------------------------- | ----------------------------------------- |
| `string`       | Short string data            | url, label                                |
| `localeString` | Localized short strings      | localized url                             |
| `text`         | Long text data               | extended product info, json config object |
| `localText`    | Localized long tex           | localized extended product info           |
| `int`          | Integer                      | product weight, customer loyalty points   |
| `float`        | Floating point number        | product review rating                     |
| `boolean`      | Boolean                      | isDownloadable flag on product            |
| `datetime`     | A datetime                   | date that variant is back in stock        |
| `relation`     | A relation to another entity | Asset used as a customer avatar           |

To see the underlying DB data type and GraphQL type used for each, see the [CustomFieldType doc]({{< relref "custom-field-type" >}}).

## CustomField UI Form Inputs

By default, the Admin UI will use an appropriate input component depending on the `type` of the custom field.
For instance, `string` fields will use a `<input type="text">` component, and `boolean` fields will use a `<input type="checkbox">` component.

These defaults can be overridden by using the `ui` property of the custom field config object. For example, if we want a number to be displayed as a currency input:

```TypeScript {hl_lines=[8]}
const config = {
  // ...
  customFields: {
    ProductVariant: [
      {
        name: 'rrp',
        type: 'int',
        ui: { component: 'currency-form-input' },
      },
    ]
  }
}
```

The built-in form inputs are listed in the [DefaultFormConfigHash docs]({{< relref "default-form-config-hash" >}}).

If you want to use a completely custom form input component which is not provided by the Admin UI, you'll need to create a plugin which [extends the Admin UI]({{< relref "extending-the-admin-ui" >}}) with [custom form inputs]({{< relref "custom-form-inputs" >}}).

Here's an example config demonstrating several ways to customize the UI controls for custom fields:

```TypeScript
import { LanguageCode, VendureConfig } from '@vendure/core';

const config: VendureConfig = {
  // ...
  customFields: {
    Product: [
      // Rich text editor
      {name: 'additionalInfo', type: 'text', ui: {component: 'rich-text-form-input'}},
      // JSON editor
      {name: 'specs', type: 'text', ui: {component: 'json-editor-form-input'}},
      // Numeric with suffix
      {
        name: 'weight',
        type: 'int',
        ui: {component: 'number-form-input', suffix: 'g'},
      },
      // Currency input
      {
        name: 'RRP',
        type: 'int',
        ui: {component: 'currency-form-input'},
      },
      // Select with options
      {
        name: 'pageType',
        type: 'string',
        ui: {
          component: 'select-form-input',
          options: [
            {value: 'static', label: [{languageCode: LanguageCode.en, value: 'Static'}]},
            {value: 'dynamic', label: [{languageCode: LanguageCode.en, value: 'Dynamic'}]},
          ],
        },
      },
      // Text with prefix
      {
        name: 'link',
        type: 'string',
        ui: {
          component: 'text-form-input',
          prefix: 'https://',
        },
      },
    ],
  },
};
```

and the resulting UI:

{{< figure src="custom-fields-ui.webp" >}}

## Tabbed custom fields

With a large, complex project, it's common for lots of custom fields to be required. This can get visually noisy in the UI, so Vendure supports tabbed custom fields. Just specify the tab name in the `ui` object, and those fields with the same tab name will be grouped in the UI! The tab name can also be a translation token if you need to support multiple languages.

```TypeScript
const config = {
  // ...
  customFields: {
    Product: [
      { name: 'additionalInfo', type: 'text', ui: { component: 'rich-text-form-input' } },
      { name: 'specs', type: 'text', ui: { component: 'json-editor-form-input' } },
      { name: 'width', type: 'int', ui: { tab: 'Shipping' } },
      { name: 'height', type: 'int', ui: { tab: 'Shipping' } },
      { name: 'depth', type: 'int', ui: { tab: 'Shipping' } },
      { name: 'weight', type: 'int', ui: { tab: 'Shipping' } },
    ],
  },
}
```

## Configurable Order Products

One common use of custom fields is to support configurable products. Imagine we are selling pens which allow some text to be engraved. To do this we would add a **custom field on the OrderLine**:

```TypeScript
OrderLine: [
  {
    name: 'engravingText',
    type: 'string',
    label: [
      {
        languageCode: LanguageCode.en,
        value: 'The text to engrave on the product'
      },
    ],
  },
]
```

Once defined, the [addItemToOrder mutation]({{< relref "/graphql-api/shop/mutations" >}}#additemtoorder) will have a third argument available, which accepts values for the custom field defined above:

```GraphQL
mutation {
  addItemToOrder(
    productVariantId: "42"
    quantity: 1
    customFields: {
      engravingText: "Thanks for all the fish!"
    }
  ) {
    ...on Order {
      id
      lines {
        id
        quantity
        customFields {
          engravingText
        }
      }
    }
  }
}
```

Furthermore, the values of these OrderLine custom fields can even be used to modify the price. This is done by defining a custom [OrderItemPriceCalculationStrategy]({{< relref "order-item-price-calculation-strategy" >}}):

```TypeScript
import { RequestContext, PriceCalculationResult,
  ProductVariant, OrderItemPriceCalculationStrategy } from '@vendure/core';

export class EngravingPriceStrategy implements OrderItemPriceCalculationStrategy {

  calculateUnitPrice(
    ctx: RequestContext,
    productVariant: ProductVariant,
    customFields: { engravingText?: string },
  ) {
    let price = productVariant.listPrice;
    if (customFields.engravingText) {
      // Add $5 for engraving
      price += 500;
    }
    return {
      price,
      priceIncludesTax: productVariant.listPriceIncludesTax,
    };
  }
}
```

## TypeScript Typings

Because custom fields are generated at run-time, TypeScript has no way of knowing about them based on your
VendureConfig. Consider the example above - let's say we have a [plugin]({{< relref "/plugins" >}}) which needs to
access the custom field values on a Product entity.

Attempting to access the custom field will result in a TS compiler error:

```TypeScript {hl_lines=[12,13]}
import { RequestContext, TransactionalConnection, ID, Product } from '@vendure/core';

export class MyService {
  constructor(private connection: TransactionalConnection) {}

  async getInfoUrl(ctx: RequestContext, productId: ID) {
    const product = await this.connection
      .getRepository(ctx, Product)
      .findOne(productId);

    return product.customFields.infoUrl;
  }                           // ^ TS2339: Property 'infoUrl'
}                             // does not exist on type 'CustomProductFields'.
```

The "easy" way to solve this is to assert the `customFields` object as `any`:

```TypeScript
return (product.customFields as any).infoUrl;
```

However, this sacrifices type safety. To make our custom fields type-safe we can take advantage of a couple of more advanced TypeScript features - [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) and [ambient modules](https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules). This allows us to extend the built-in `CustomProductFields` interface to add our custom fields to it:

```TypeScript
// types.ts

// Note: we are using deep a import here, rather than importing from `@vendure/core` due to
// a possible bug in TypeScript (https://github.com/microsoft/TypeScript/issues/46617) which
// causes issues when multiple plugins extend the same custom fields interface.
import { CustomProductFields } from '@vendure/core/dist/entity/custom-entity-fields';

declare module '@vendure/core/dist/entity/custom-entity-fields' {
  interface CustomProductFields {
    infoUrl: string;
    downloadable: boolean;
    shortName: string;
  }
}
```

When this file is then imported into our service file (either directly or indirectly), TypeScript will know about our custom fields, and we do not need to do any type assertions.

```TypeScript
return product.customFields.infoUrl;
// no error, plus TS autocomplete works.
```

{{< alert "warning" >}}
Note that for the typings to work correctly, **order of imports matters**.

One way to ensure that your custom field typings always get imported first is to include them as the first item in the tsconfig "include" array.
{{< /alert >}}

{{< alert "primary" >}}
For a working example of this setup, see the [real-world-vendure repo](https://github.com/vendure-ecommerce/real-world-vendure/blob/master/src/plugins/reviews/types.ts)
{{< /alert >}}

## Examples

### defaultValue & nullable

A default value for the custom field may be specified, and also whether the field may be nullable (or empty). Any fields set to `nullable: false` should have a default value specified.

```TypeScript
Product: [
  {
    name: 'downloadable',
    type: 'boolean',
    defaultValue: false,
    nullable: false,
  },
]
```

### Labels and descriptions

Labels and descriptions can be specified to supply more information about the purpose of the custom field, and also to allow translations to be set. In the Admin UI, the `label` will be used in any forms featuring the custom field, and will fall back to `name` if no label is specified.

```TypeScript
Product: [
  {
    name: 'extendedDescription',
    type: 'localeString',
    label: [
      { languageCode: LanguageCode.en, value: 'Extended description' },
      { languageCode: LanguageCode.de, value: 'Erweiterte Beschreibung' },
    ],
    description: [
      { languageCode: LanguageCode.en, value: 'Technical specs, external links and images' },
      { languageCode: LanguageCode.de, value: 'Technische Daten, externe Links und Bilder' },
    ],
    length: 65535,
  },
]
```

### Lists

A custom field may hold an array of values by setting the `list` property to `true`:

```TypeScript
Product: [
  {
    name: 'keywords',
    type: 'localeString',
    list: true,
  },
]
```

### Validation

Certain custom field types may be configured with validation parameters:

```TypeScript
Product: [
  {
    name: 'partCode',
    type: 'string',
    pattern: '^[0-9]{4}\-[A-Z]{3-4}$'
  },
  {
    name: 'location',
    type: 'string',
    options: [
      { value: 'warehouse1' },
      { value: 'warehouse2' },
      { value: 'shop' },
    ]
  },
  {
    name: 'weight',
    type: 'int',
    min: 0,
    max: 9999,
    step: 1,
  },
]
```

In the above examples, attempting to set a custom field value which does not conform to the specified parameters (e.g. a `partCode` of `'121A'`) will throw an exception. In the Admin UI, these constraints will also be expressed in the form fields used to enter the data.

For even more control over validation, a `validate` function may be provided to any field type, which will run whenever the value is set via the GraphQL API. This function can even be asynchronous and may use the [Injector]({{< relref "injector" >}}) to access providers. Returning a string or LocalizedString means validation failed.

```TypeScript
Product: [
  {
    name: 'partCode',
    type: 'string',
    validate: async(value, injector) => {
      const partCodeService = injector.get(PartCodeService);
      const isValid = await partCodeService.validateCode(value);
      if (!isValid) {
        return `Part code ${value} is not valid`;
      }
    },
  },
]
```

### public, readonly & internal

Some custom fields may be used internally in your business logic, or for integration with external systems. In this case the can restrict access to the information they contain. In this example, the Customer entity has an externalId relating to an external integration.

-   `public: false` means that it will not be exposed via the Shop API.
-   `readonly: true` means it will be exposed, but cannot be updated via the Admin API. It can only be changed programmatically in plugin code.
-   `internal: false` - means the field _will_ be exposed via the GraphQL APIs (in this case on the Admin API due to the `public: false` setting). If it was set to `internal: true`, then the field would not be exposed _at all_ in either of the GraphQL APIs, and will not be visible in the Admin UI. Internal custom fields are useful for purely internal implementation details.

```TypeScript
Customer: [
  {
    name: 'externalId',
    type: 'string',
    public: false,
    readonly: true,
    internal: false,
  },
],
```

### Relations

It is possible to set up custom fields that hold references to other entities using the `'relation'` type:

```TypeScript
Customer: [
  {
    name: 'avatar',
    type: 'relation',
    entity: Asset,
    // may be omitted if the entity name matches the GraphQL type name,
    // which is true for all built-in entities.
    graphQLType: 'Asset',
    // Whether to "eagerly" load the relation
    // See https://typeorm.io/#/eager-and-lazy-relations
    eager: false,
  },
]
```

In this example, we set up a many-to-one relationship from Customer to Asset, allowing us to specify an avatar image for each Customer. Relation custom fields are unique in that the input and output names are not the same - the input will expect an ID and will be named `'<field name>Id'` or `'<field name>Ids'` for list types.

```GraphQL
mutation {
  updateCustomer(input: {
    id: 1
    customFields: {
      avatarId: 42,
    }
  }) {
    id
    customFields {
      avatar {
        id
        name
        preview
      }
    }
  }
}
```

{{% alert %}}
**UI for relation type**

The Admin UI app has built-in selection components for "relation" custom fields that reference certain common entity types, such as Asset, Product, ProductVariant and Customer. If you are relating to an entity not covered by the built-in selection components, you will see a generic relation component which allows you to manually enter the ID of the entity you wish to select.

If the generic selector is not suitable, or is you wish to replace one of the built-in selector components, you can create a UI extension that defines a custom field control for that custom field. You can read more about this in the [custom form input guide]({{< relref "custom-form-inputs" >}})
{{< /alert >}}
