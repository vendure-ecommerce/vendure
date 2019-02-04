---
title: "Writing a Vendure Plugin"
weight: 0
---

# Writing a Vendure Plugin

A Vendure plugin is a class which implements the [`VendurePlugin` interface]({{< relref "vendure-plugin" >}}). This interface allows the plugin to:

1. Modify the [VendureConfig]({{< relref "vendure-config" >}}) object.
2. Extend the GraphQL API, including modifying existing types and adding completely new queries and mutations.
3. Define new database entities and interact directly with the database.
4. Run code before the server bootstraps, such as starting webservers.

## Example: RandomCatPlugin

Let's learn about these capabilities by writing a plugin which defines a new database entity and GraphQL mutation.

This plugin will add a new mutation, `addRandomCat`, to the GraphQL API which allows us to conveniently link a random cat image from [http://random.cat](http://random.cat) to any product in out catalog.

### Step 1: Define a new custom field

We need a place to store the url of the cat image, so we will add a custom field to the Product entity. This is done by modifying the VendureConfig object in the the plugin's [`configure` method]({{< relref "vendure-plugin" >}}#configure):

```ts 
import { VendurePlugin } from '@vendure/core';

export class RandomCatPlugin implements VendurePlugin {
    configure(config) {
        config.customFields.Product.push({
            type: 'string',
            name: 'catImageUrl',
        });
        return config;
    }
}
```

### Step 2: Create a service to fetch the data

Now we will create a service which is responsible for making the HTTP call to the random.cat API and returning the URL of a random cat image:

```ts 
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

### Step 3: Extend the GraphQL API

Next we will extend the Vendure GraphQL API to add our new mutation. This is done by implementing the [`defineGraphQlTypes` method](({{< relref "vendure-plugin" >}}#definegraphqltypes)) in our plugin.

```ts 
import gql from 'graphql-tag';

export class RandomCatPlugin implements VendurePlugin {

    configure(config) {
        // as above
    }

    defineGraphQlTypes() {
        return gql`
            extend type Mutation {
                addRandomCat(id: ID!): Product!
            }
        `;
    }
}
```

### Step 4: Create a resolver

Now that we've defined the new mutation, we'll need a resolver function to handle it. To do this, we'll create a new resolver class, following the [Nest GraphQL resolver architecture](https://docs.nestjs.com/graphql/resolvers-map). In short, this will be a class which has the `@Resolver()` decorator and features a method to handle our new mutation.

```ts 
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, Allow, ProductService, RequestContext } from '@vendure/core';

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
* The `@Allow()` decorator enables us to define permissions restrictions on the mutation. Only those users whose permissions include `UpdateCatalog` may perform this operation. For a full list of available permissions, see the [Permission enum]({{< relref "enums" >}}#permission).
* The `@Ctx()` decorator injects the current `RequestContext` into the resolver. This provides information about the current request such as the current Session, User and Channel. It is required by most of the internal service methods.
* The `@Args()` decorator injects the arguments passed to the mutation as an object.

### Step 5: Export the providers

In order that the Vendure server (and the underlying Nest framework) is able to use the `CatFetcher` and `RandomCatResolver` classes, we must export them via the [`defineProviders` method](({{< relref "vendure-plugin" >}}#defineproviders)) in our plugin:

```ts 
export class RandomCatPlugin implements VendurePlugin {

    configure(config) {
        // as above
    }

    defineGraphQlTypes() {
        // as above
    }

    defineProviders() {
        return [CatFetcher, RandomCatResolver];
    }
}
```

### Step 6: Add the plugin to the Vendure config

Finally we need to add an instance of our plugin to the config object with which we bootstrap out Vendure server:

```ts 
import { bootstrap } from '@vendure/core';

bootstrap({
    // .. config options
    plugins: [
        new RandomCatPlugin(),
    ],
});
```

### Step 7: Test the plugin

Once we have started the Vendure server with the new config, we should be able to send the following GraphQL query:

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

```ts
import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import gql from 'graphql-tag';
import http from 'http';
import { Allow, Ctx, Permission, ProductService, RequestContext, VendureConfig, VendurePlugin } from '@vendure/core';

export class RandomCatPlugin implements VendurePlugin {
    configure(config: Required<VendureConfig>) {
        config.customFields.Product.push({
            type: 'string',
            name: 'catImageUrl',
        });
        return config;
    }

    defineGraphQlTypes() {
        return gql`
            extend type Mutation {
                addRandomCat(id: ID!): Product!
            }
        `;
    }

    defineProviders() {
        return [CatFetcher, RandomCatResolver];
    }
}

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
