---
title: "Uploading Files"
showtoc: true
---

# Uploading Files 

Vendure handles file uploads with the [GraphQL multipart request specification](https://github.com/jaydenseric/graphql-multipart-request-spec). Internally, we use the [graphql-upload package](https://github.com/jaydenseric/graphql-upload). Once uploaded, a file is known as an [Asset]({{< relref "/docs/typescript-api/entities/asset" >}}). Assets are typically used for images, but can represent any kind of binary data such as PDF files or videos.

## Upload clients

Here is a [list of client implementations](https://github.com/jaydenseric/graphql-multipart-request-spec#client) that will allow you to upload files using the spec. If you are using Apollo Client, then you should install the [apollo-upload-client](https://github.com/jaydenseric/apollo-upload-client) npm package.

For testing, it is even possible to use a [plain curl request](https://github.com/jaydenseric/graphql-multipart-request-spec#single-file).

## The `createAssets` mutation

The [createAssets mutation]({{< relref "/docs/graphql-api/admin/mutations" >}}#createassets) in the Admin API is the only means of uploading files by default. 

Here's an example of how a file upload would look using the `apollo-upload-client` package:

```TypeScript
import { gql, useMutation } from "@apollo/client";

const MUTATION = gql`
  mutation CreateAssets($input: [CreateAssetInput!]!) {
    createAssets(input: $input) {
      ... on Asset {
        id
        name
        fileSize
      }
      ... on ErrorResult {
        message
      }
    }
  }
`;

function UploadFile() {
  const [mutate] = useMutation(MUTATION);

  function onChange(event) {
    const { target } = event;  
    if (target.validity.valid) {
      mutate({ 
        variables: {
          input: target.files.map(file => ({ file }))
        }  
      });
    }
  }

  return <input type="file" required onChange={onChange} />;
}
```

## Custom upload mutations

How about if you want to implement a custom mutation for file uploads? Let's take an example where we want to allow customers to set an avatar image. To do this, we'll add a [custom field]({{< relref "customizing-models" >}}) to the Customer entity and then define a new mutation in the Shop API.

### Configuration

Let's define a custom field to associate the avatar Asset with the Customer:

```TypeScript
import { Asset } from '@vendure/core';

const config = {
  // ...
  customFields: {
    Customer: [
      { 
        name: 'avatar',
        type: 'relation',
        entity: Asset,
        nullable: true,
      },
    ],
  },
}
```

In a later step, we will refactor this config to encapsulate it in a plugin.

### Schema definition

Next, we will define the schema for the mutation:

```TypeScript
// api-extensions.ts
import gql from 'graphql-tag';

export const shopApiExtensions = gql`
extend type Mutation {
  setCustomerAvatar(file: Upload!): Asset
}`
```

### Resolver

The resolver will make use of the built-in [AssetService]({{< relref "asset-service" >}}) to handle the processing of the uploaded file into an Asset.

```TypeScript
// customer-avatar.resolver.ts
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Asset } from '@vendure/common/lib/generated-types';
import { Allow, AssetService, Ctx, CustomerService, isGraphQlErrorResult,
  Permission, RequestContext, Transaction } from '@vendure/core';

@Resolver()
export class CustomerAvatarResolver {
  constructor(private assetService: AssetService, private customerService: CustomerService) {}

  @Transaction()
  @Mutation()
  @Allow(Permission.Authenticated)
  async setCustomerAvatar(
    @Ctx() ctx: RequestContext,
    @Args() args: { file: any },
  ): Promise<Asset | undefined> {
    const userId = ctx.activeUserId;
    if (!userId) {
      return;
    }
    const customer = await this.customerService.findOneByUserId(ctx, userId);
    if (!customer) {
      return;
    }
    // Create an Asset from the uploaded file
    const asset = await this.assetService.create(ctx, {
      file: args.file,
      tags: ['avatar'],
    });
    // Check to make sure there was no error when
    // creating the Asset
    if (isGraphQlErrorResult(asset)) {
      // MimeTypeError
      throw asset;
    }
    // Asset created correctly, so assign it as the
    // avatar of the current Customer
    await this.customerService.update(ctx, {
      id: customer.id,
      customFields: {
        avatarId: asset.id,
      },
    });

    return asset;
  }
}
```

### Complete Customer Avatar Plugin

We can group all of this together into a plugin:

```TypeScript
import { Asset, PluginCommonModule, VendurePlugin } from '@vendure/core';

import { shopApiExtensions } from './api-extensions';
import { CustomerAvatarResolver } from './customer-avatar.resolver';

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [CustomerAvatarResolver],
  },
  configuration: config => {
    config.customFields.Customer.push({
      name: 'avatar',
      type: 'relation',
      entity: Asset,
      nullable: true,
    });
    return config;
  },
})
export class CustomerAvatarPlugin {}
```

### Uploading a Customer Avatar

In our storefront, we would then upload a Customer's avatar like this:

```TypeScript
import { gql, useMutation } from "@apollo/client";

const MUTATION = gql`
  mutation SetCustomerAvatar($file: Upload!) {
    setCustomerAvatar(file: $file) {
      id
      name
      fileSize
    }
  }
`;

function UploadAvatar() {
  const [mutate] = useMutation(MUTATION);

  function onChange(event) {
    const { target } = event;  
    if (target.validity.valid && target.files.length === 1) {
      mutate({ 
        variables: {
          file: target.files[0],
        }  
      });
    }
  }

  return <input type="file" required onChange={onChange} />;
}
```
