---
title: "Writing a Vendure Plugin"
weight: 2
---

# Writing a Vendure Plugin

This is a complete example of how to implement a simple plugin step-by-step.

{{% alert "primary" %}}
  For a complete working example of a Vendure plugin, see the [real-world-vendure Reviews plugin](https://github.com/vendure-ecommerce/real-world-vendure/tree/master/src/plugins/reviews)
{{% /alert %}}

## Example: RandomCatPlugin

Let's learn about Vendure plugins by writing a plugin which defines a new database entity and GraphQL mutation.

This plugin will add a new mutation, `addRandomCat`, to the GraphQL API which allows us to conveniently link a random cat image from [http://random.cat](http://random.cat) to any product in our catalog.

### Step 1: Define a new custom field

We need a place to store the url of the cat image, so we will add a custom field to the Product entity. This is done by modifying the VendureConfig object via the plugin's [`configuration` metadata property]({{< relref "vendure-plugin-metadata" >}}#configuration):

```TypeScript
import { VendurePlugin } from '@vendure/core';

@VendurePlugin({
  configuration: config => {
    config.customFields.Product.push({
      type: 'string',
      name: 'catImageUrl',
    });
    return config;
  }
})
export class RandomCatPlugin {}
```

### Step 2: Create a service to fetch the data

Now we will create a service which is responsible for making the HTTP call to the random.cat API and returning the URL of a random cat image:

```TypeScript
import http from 'http';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatFetcher {
  /** Fetch a random cat image url from random.cat */
  fetchCat(): Promise<string> {
    return new Promise((resolve) => {
      http.get('http://aws.random.cat/meow', (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => resolve(JSON.parse(data).file));
      });
    });
  }
}
```

{{% alert %}}
The `@Injectable()` decorator is part of the underlying [Nest framework](https://nestjs.com/), and allows us to make use of Nest's powerful dependency injection features. In this case, we'll be able to inject the `CatFetcher` service into the resolver which we will soon create.
{{% /alert %}}


{{% alert "warning" %}}
To use decorators with TypeScript, you must set the "emitDecoratorMetadata" and "experimentalDecorators" compiler options to `true` in your tsconfig.json file.
{{% /alert %}}

### Step 3: Define the new mutation

Next we will define how the GraphQL API should be extended:

```TypeScript
import gql from 'graphql-tag';

const schemaExtension = gql`
  extend type Mutation {
    addRandomCat(id: ID!): Product!
  }
`;
```

We will use this `schemaExtension` variable in a later step.

### Step 4: Create a resolver

Now that we've defined the new mutation, we'll need a resolver function to handle it. To do this, we'll create a new resolver class, following the [Nest GraphQL resolver architecture](https://docs.nestjs.com/graphql/resolvers-map). In short, this will be a class which has the `@Resolver()` decorator and features a method to handle our new mutation.

```TypeScript
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, Allow, ProductService, RequestContext } from '@vendure/core';
import { Permission } from '@vendure/common/lib/generated-types';

@Resolver()
export class RandomCatResolver {

  constructor(private productService: ProductService, private catFetcher: CatFetcher) {}

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async addRandomCat(@Ctx() ctx: RequestContext, @Args() args) {
    const catImageUrl = await this.catFetcher.fetchCat();
    return this.productService.update(ctx, {
      id: args.id,
      customFields: { catImageUrl },
    });
  }
}
```

Some explanations of this code are in order:

* The `@Resolver()` decorator tells Nest that this class contains GraphQL resolvers.
* We are able to use Nest's dependency injection to inject an instance of our `CatFetcher` class into the constructor of the resolver. We are also injecting an instance of the built-in `ProductService` class, which is responsible for operations on Products.
* We use the `@Mutation()` decorator to mark this method as a resolver for a mutation with the corresponding name.
* The `@Allow()` decorator enables us to define permissions restrictions on the mutation. Only those users whose permissions include `UpdateCatalog` may perform this operation. For a full list of available permissions, see the [Permission enum]({{< relref "/docs/graphql-api/admin/enums" >}}#permission).
* The `@Ctx()` decorator injects the current `RequestContext` into the resolver. This provides information about the current request such as the current Session, User and Channel. It is required by most of the internal service methods.
* The `@Args()` decorator injects the arguments passed to the mutation as an object.

### Step 5: Import the PluginCommonModule

In the RandomCatResolver we make use of the ProductService. This is one of the built-in services which Vendure uses internally to interact with the database. It can be injected into our resolver only if we first import the [PluginCommonModule]({{< relref "plugin-common-module" >}}), which is a module which exports a number of providers which are usually needed by plugins.

```TypeScript
@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: config => {
    // omitted
  }
})
export class RandomCatPlugin {}
``` 

### Step 6: Declare any providers used in the resolver

In order that out resolver is able to use Nest's dependency injection to inject and instance of `CatFetcher`, we must add it to the `providers` array in our plugin:

```TypeScript
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [CatFetcher],
  configuration: config => {
    // omitted
  }
})
export class RandomCatPlugin {}
```

### Step 7: Extend the GraphQL API

Now that we've defined the new mutation and we have a resolver capable of handling it, we just need to tell Vendure to extend the API. This is done with the [`adminApiExtensions` metadata property]({{< relref "vendure-plugin-metadata" >}}#adminapiextensions). If we wanted to extend the Shop API, we'd use the [`shopApiExtensions` metadata property]({{< relref "vendure-plugin-metadata" >}}#shopapiextensions) instead.

```TypeScript
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [CatFetcher],
  adminApiExtensions: {
    schema: schemaExtension,
    resolvers: [RandomCatResolver],
  },
  configuration: config => {
    // omitted
  }
})
export class RandomCatPlugin {}
```

### Step 8: Add the plugin to the Vendure config

Finally we need to add an instance of our plugin to the config object with which we bootstrap out Vendure server:

```TypeScript
import { bootstrap } from '@vendure/core';

bootstrap({
    // .. config options
    plugins: [
        RandomCatPlugin,
    ],
});
```

### Step 9: Test the plugin

Once we have started the Vendure server with the new config, we should be able to send the following GraphQL query to the Admin API:

```GraphQL
mutation {
  addRandomCat(id: "1") {
    id
    name
    customFields {
      catImageUrl
    }
  }
}
```

which should yield the following response:

```JSON
{
  "data": {
    "addRandomCat": {
      "id": "1",
      "name": "Spiky Cactus",
      "customFields": {
        "catImageUrl": "https://purr.objects-us-east-1.dream.io/i/OoNx6.jpg"
      }
    }
  }
}
```

### Full example plugin

```TypeScript
import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import gql from 'graphql-tag';
import http from 'http';
import { Allow, Ctx, ProductService, RequestContext, VendureConfig, VendurePlugin } from '@vendure/core';
import { Permission } from '@vendure/common/lib/generated-types';

const schemaExtension = gql`
    extend type Mutation {
        addRandomCat(id: ID!): Product!
    }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [CatFetcher],
  adminApiExtensions: {
    schema: schemaExtension,
    resolvers: [RandomCatResolver],
  },
  configuration: config => {
    config.customFields.Product.push({
      type: 'string',
      name: 'catImageUrl',
    });
    return config;
  }
})
export class RandomCatPlugin {}

@Injectable()
export class CatFetcher {
  /** Fetch a random cat image url from random.cat */
  fetchCat(): Promise<string> {
    return new Promise((resolve) => {
      http.get('http://aws.random.cat/meow', (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => resolve(JSON.parse(data).file));
      });
    });
  }
}

@Resolver()
export class RandomCatResolver {
  constructor(private productService: ProductService, private catFetcher: CatFetcher) {}

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async addRandomCat(@Ctx() ctx: RequestContext, @Args() args) {
    const catImageUrl = await this.catFetcher.fetchCat();
    return this.productService.update(ctx, {
      id: args.id,
      customFields: { catImageUrl },
    });
  }
}
```
