---
title: "Customizing Models"
showtoc: true
---
 
# Customizing Models with custom fields

Custom fields allow you to add your own custom data properties to many of the Vendure entities. The entities which may be have custom fields defined are listed in the [CustomFields documentation]({{< relref "/docs/typescript-api/custom-fields" >}})

They are specified in the VendureConfig:

```TypeScript
const config = {
    // ...
    dbConnectionOptions: {
        // ...
        synchronize: true,  
    },
    customFields: {
        Product: [
            { name: 'infoUrl', type: 'string' },
            { name: 'downloadable', type: 'boolean' },
            { name: 'shortName', type: 'localeString' },
        ],
        User: [
            { name: 'socialLoginToken', type: 'string' },
        ],
    },
}
```

With the example config above, the following will occur:

1. The database schema will be altered and a column will be added for each custom field. Note: this step requires the [TypeORM synchronize option](https://typeorm.io/#/connection-options/common-connection-options) to be set to `true` as above.
2. The GraphQL APIs will be modified on bootstrap to add the custom fields to the `Product` and `User` types respectively.
3. If you are using the [admin-ui-plugin]({{< relref "/docs/typescript-api/admin-ui-plugin" >}}), the Admin UI detail pages will now contain form inputs to allow the custom field data to be added or edited.
