---
title: "Getting data into production"
showtoc: true
weight: 4
---

# Getting data into production

Once you have set up your production deployment, you'll need some way to get your products and other data into the system.

The main tasks will be:

1. Creation of the database schema
2. Importing initial data like roles, tax rates, countries etc.
3. Importing catalog data like products, variants, options, facets
4. Importing other data used by your application

## Creating the database schema

The first item - creation of the schema - can be automatically handled by TypeORM's `synchronize` feature. Switching it on for the initial
run will automatically create the schema. This can be done by using an environment variable:

```ts title="src/vendure-config.ts"
import { VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
    // ...
    dbConnectionOptions: {
        type: 'postgres',
        // highlight-next-line
        synchronize: process.env.DB_SYNCHRONIZE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    // ...
};
```

Set the `DB_SYNCHRONIZE` variable to `true` on first start, and then after the schema is created, set it to `false`.

## Importing initial & catalog data

Importing initial and catalog data can be handled by Vendure `populate()` helper function - see the [Importing Product Data guide](/guides/developer-guide/importing-data/).

## Importing other data

Any kinds of data not covered by the `populate()` function can be imported using a custom script, which can use any Vendure service or service defined by your custom plugins to populate data in any way you like. See the [Stand-alone scripts guide](/guides/developer-guide/stand-alone-scripts/).
