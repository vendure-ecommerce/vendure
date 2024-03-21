---
title: "Testing"
showtoc: true
---

# Testing

Vendure plugins allow you to extend all aspects of the standard Vendure server. When a plugin gets somewhat complex (defining new entities, extending the GraphQL schema, implementing custom resolvers), you may wish to create automated tests to ensure your plugin is correct.

The `@vendure/testing` package gives you some simple but powerful tooling for creating end-to-end tests for your custom Vendure code.

By "end-to-end" we mean we are testing the _entire server stack_ - from API, to services, to database - by making a real API request, and then making assertions about the response. This is a very effective way to ensure that _all_ parts of your plugin are working correctly together.

:::info
For a working example of a Vendure plugin with e2e testing, see the [real-world-vendure Reviews plugin](https://github.com/vendure-ecommerce/real-world-vendure/tree/master/src/plugins/reviews)
:::

## Usage

### Install dependencies

* [`@vendure/testing`](https://www.npmjs.com/package/@vendure/testing)
* [`vitest`](https://vitest.dev/) You'll need to install a testing framework. In this example, we will use [Vitest](https://vitest.dev/) as it has very good support for the modern JavaScript features that Vendure uses, and is very fast.
* [`graphql-tag`](https://www.npmjs.com/package/graphql-tag) This is not strictly required but makes it much easier to create the DocumentNodes needed to query your server.
* We also need to install some packages to allow us to compile TypeScript code that uses decorators:
  - `@swc/core`
  - `unplugin-swc`

### Configure Vitest

Create a `vitest.config.js` file in the root of your project:

```ts
import path from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: '**/*.e2e-spec.ts',
        typecheck: {
            tsconfig: path.join(__dirname, 'tsconfig.e2e.json'),
        },
    },
    plugins: [
        // SWC required to support decorators used in test plugins
        // See https://github.com/vitest-dev/vitest/issues/708#issuecomment-1118628479
        // Vite plugin
        swc.vite({
            jsc: {
                transform: {
                    // See https://github.com/vendure-ecommerce/vendure/issues/2099
                    useDefineForClassFields: false,
                },
            },
        }),
    ],
});
```

and a `tsconfig.e2e.json` tsconfig file for the tests:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["node"],
    "lib": ["es2015"],
    "useDefineForClassFields": false,
    "skipLibCheck": true,
    "inlineSourceMap": false,
    "sourceMap": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true
  }
}

```

### Register database-specific initializers

The `@vendure/testing` package uses "initializers" to create the test databases and populate them with initial data. We ship with initializers for `sqljs`, `postgres` and `mysql`. Custom initializers can be created to support running e2e tests against other databases supported by TypeORM. See the [`TestDbInitializer` docs](/reference/typescript-api/testing/test-db-initializer/) for more details.

```ts title="src/plugins/my-plugin/e2e/my-plugin.e2e-spec.ts"
import {
    MysqlInitializer,
    PostgresInitializer,
    SqljsInitializer,
    registerInitializer,
} from '@vendure/testing';

const sqliteDataDir = path.join(__dirname, '__data__');

registerInitializer('sqljs', new SqljsInitializer(sqliteDataDir));
registerInitializer('postgres', new PostgresInitializer());
registerInitializer('mysql', new MysqlInitializer());
```

:::info
Note re. the `sqliteDataDir`: The first time this test suite is run with the `SqljsInitializer`, the populated data will be saved into an SQLite file, stored in the directory specified by this constructor arg. On subsequent runs of the test suite, the data-population step will be skipped and the initial data directly loaded from the SQLite file. This method of caching significantly speeds up the e2e test runs. All the .sqlite files created in the `sqliteDataDir` can safely be deleted at any time.
:::

### Create a test environment

The `@vendure/testing` package exports a [`createTestEnvironment` function](/reference/typescript-api/testing/create-test-environment/) which is used to set up a Vendure server and GraphQL clients to interact with both the Shop and Admin APIs:

```ts title="src/plugins/my-plugin/e2e/my-plugin.e2e-spec.ts"
import { createTestEnvironment, testConfig } from '@vendure/testing';
import { describe } from 'vitest';
import { MyPlugin } from '../my-plugin.ts';

describe('my plugin', () => {

    const {server, adminClient, shopClient} = createTestEnvironment({
        ...testConfig,
        plugins: [MyPlugin],
    });

});
```

Notice that we pass a [`VendureConfig`](/reference/typescript-api/configuration/vendure-config/) object into the `createTestEnvironment` function. The testing package provides a special [`testConfig`](/reference/typescript-api/testing/test-config/) which is pre-configured for e2e tests, but any aspect can be overridden for your tests. Here we are configuring the server to load the plugin under test, `MyPlugin`. 

:::caution
**Note**: If you need to deeply merge in some custom configuration, use the [`mergeConfig` function](/reference/typescript-api/configuration/merge-config/) which is provided by `@vendure/core`.
:::

### Initialize the server

The [`TestServer`](/reference/typescript-api/testing/test-server/) needs to be initialized before it can be used. The `TestServer.init()` method takes an options object which defines how to populate the server:

```ts title="src/plugins/my-plugin/e2e/my-plugin.e2e-spec.ts"
import { beforeAll, afterAll } from 'vitest';
import { myInitialData } from './fixtures/my-initial-data.ts';

// ...

beforeAll(async () => {
    await server.init({
        productsCsvPath: path.join(__dirname, 'fixtures/e2e-products.csv'),
        initialData: myInitialData,
        customerCount: 2,
    });
    await adminClient.asSuperAdmin();
}, 60000);

afterAll(async () => {
    await server.destroy();
});
```

An explanation of the options:

* `productsCsvPath` This is a path to an optional CSV file containing product data. See [Product Import Format](/guides/developer-guide/importing-data/#product-import-format). You can see [an example used in the Vendure e2e tests](https://github.com/vendure-ecommerce/vendure/blob/master/packages/core/e2e/fixtures/e2e-products-full.csv) to get an idea of how it works. To start with you can just copy this file directly and use it as-is.
* `initialData` This is an object which defines how other non-product data (Collections, ShippingMethods, Countries etc.) is populated. See [Initial Data Format](/guides/developer-guide/importing-data/#initial-data). You can [copy this example from the Vendure e2e tests](https://github.com/vendure-ecommerce/vendure/blob/master/e2e-common/e2e-initial-data.ts)
* `customerCount` Specifies the number of fake Customers to create. Defaults to 10 if not specified.

### Write your tests

Now we are all set up to create a test. Let's test one of the GraphQL queries used by our fictional plugin:

```ts title="src/plugins/my-plugin/e2e/my-plugin.e2e-spec.ts"
import gql from 'graphql-tag';
import { it, expect, beforeAll, afterAll } from 'vitest';
import { myInitialData } from './fixtures/my-initial-data.ts';

it('myNewQuery returns the expected result', async () => {
    adminClient.asSuperAdmin(); // log in as the SuperAdmin user

    const query = gql`
    query MyNewQuery($id: ID!) {
      myNewQuery(id: $id) {
        field1
        field2
      }
    }
  `;
    const result = await adminClient.query(query, {id: 123});

    expect(result.myNewQuery).toEqual({ /* ... */})
});
```

Running the test will then assert that your new query works as expected.

### Run your tests

All that's left is to run your tests to find out whether your code behaves as expected!

:::caution
**Note:** When using **Vitest** with multiple test suites (multiple `.e2e-spec.ts` files), it will attempt to run them in parallel. If all the test servers are running
on the same port (the default in the `testConfig` is `3050`), then this will cause a port conflict. To avoid this, you can manually set a unique port for each test suite:

```ts title="src/plugins/my-plugin/e2e/my-plugin.e2e-spec.ts"
import { createTestEnvironment, testConfig } from '@vendure/testing';
import { describe } from 'vitest';
import { MyPlugin } from '../my-plugin.ts';

describe('my plugin', () => {

    const {server, adminClient, shopClient} = createTestEnvironment({
        ...testConfig,
        // highlight-next-line
        port: 3051,
        plugins: [MyPlugin],
    });

});
```
:::

## Accessing internal services

It is possible to access any internal service of the Vendure server via the `server.app` object, which is an instance of the NestJS `INestApplication`.

For example, to access the `ProductService`:

```ts title="src/plugins/my-plugin/e2e/my-plugin.e2e-spec.ts"
import { createTestEnvironment, testConfig } from '@vendure/testing';
import { describe, beforeAll } from 'vitest';
import { MyPlugin } from '../my-plugin.ts';

describe('my plugin', () => {
    
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        plugins: [MyPlugin],
    });
    
    // highlight-next-line
    let productService: ProductService;
    
    beforeAll(async () => {
        await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products.csv'),
            initialData: myInitialData,
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();
        // highlight-next-line
        productService = server.app.get(ProductService);
    }, 60000);

});
```
