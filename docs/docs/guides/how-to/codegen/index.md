---
title: "GraphQL Code Generation"
---

Code generation means the automatic generation of TypeScript types based on your GraphQL schema and your GraphQL operations.
This is a very powerful feature that allows you to write your code in a type-safe manner, without you needing to manually
write any types for your API calls.

To do this, we will use [Graphql Code Generator](https://the-guild.dev/graphql/codegen).

:::cli
Use `npx vendure add` and select "Set up GraphQL code generation" to quickly set up code generation.
:::

:::note
This guide is for adding codegen to your Vendure plugins & Admin UI extensions. For a guide on adding codegen to your storefront, see the [Storefront Codegen](/guides/storefront/codegen/) guide.
:::

## Installation

It is recommended to use the `vendure add` CLI command as detailed above to set up codegen. 
If you prefer to set it up manually, follow the steps below.

First, install the required dependencies:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript
```

## Configuration

Add a `codegen.ts` file to your project root with the following contents:

```ts title="codegen.ts"
import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    // This assumes your server is running on the standard port
    // and with the default admin API path. Adjust accordingly.
    schema: 'http://localhost:3000/admin-api',
    config: {
        // This tells codegen that the `Money` scalar is a number
        scalars: { Money: 'number' },
        // This ensures generated enums do not conflict with the built-in types.
        namingConvention: { enumValues: 'keep' },
    },
    generates: {
        // The path to the generated type file in your
        // plugin directory. Adjust accordingly.
        'src/plugins/organization/gql/generated.ts': {
            plugins: ['typescript'],
        },
    },
};

export default config;
```

This assumes that we have an "organization" plugin which adds support for grouping customers into organizations, e.g. for B2B use-cases.

## Running codegen

You can now add a script to your package.json to run codegen:

```json title="package.json"
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts"
  }
}
```

**Ensure your server is running**, then run the codegen script:

```bash
npm run codegen
```

This will generate a file at `src/plugins/organization/gql/generated.ts` which contains all the GraphQL types corresponding to your schema.

## Using generated types in resolvers & services

You would then use these types in your resolvers and service methods, for example:

```ts title="src/plugins/organization/services/organization.service.ts"
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, PaginatedList, RequestContext, Transaction } from '@vendure/core';

import { organizationPermission } from '../constants';
import { Organization } from '../entities/organization.entity';
import { OrganizationService } from '../services/organization.service';
// highlight-next-line
import { QueryOrganizationArgs, MutationCreateOrganizationArgs } from '../gql/generated';

@Resolver()
export class AdminResolver {
    constructor(private organizationService: OrganizationService) {}

    @Query()
    @Allow(organizationPermission.Read)
    // highlight-next-line
    organization(@Ctx() ctx: RequestContext, @Args() args: QueryOrganizationArgs): Promise<Organization> {
        return this.organizationService.findOne(ctx, args.id);
    }
    
    @Transaction()
    @Mutation()
    @Allow(organizationPermission.Create)
    createOrganization(
        @Ctx() ctx: RequestContext,
        // highlight-next-line
        @Args() args: MutationCreateOrganizationArgs,
    ): Promise<Organization> {
        return this.organizationService.create(ctx, args.input);
    }

    // ... etc
}
```

In your service methods you can directly use any input types defined in your schema:

```ts title="src/plugins/organization/services/organization.service.ts"
import { Injectable } from '@nestjs/common';
import { RequestContext, TransactionalConnection } from '@vendure/core';

import { Organization } from '../entities/organization.entity';
// highlight-next-line
import { CreateOrganizationInput, UpdateOrganizationInput } from "../gql/generated";

@Injectable()
export class OrganizationService {
    constructor(private connection: TransactionalConnection) {}

    // highlight-next-line
    async create(ctx: RequestContext, input: CreateOrganizationInput): Promise<Organization> {
        return this.connection.getRepository(ctx, Organization).save(new Organization(input));
    }

    // highlight-next-line
    async update(ctx: RequestContext, input: UpdateOrganizationInput): Promise<Organization> {
        const example = await this.connection.getEntityOrThrow(ctx, Organization, input.id);
        const updated = {...example, ...input};
        return this.connection.getRepository(ctx, Organization).save(updated);
    }
}
```

## Codegen for Admin UI extensions

When you create Admin UI extensions, very often those UI components will be making API calls to the Admin API. In this case, you can use codegen to generate the types for those API calls.

To do this, we will use the ["client preset" plugin](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client). Assuming you have already completed the setup above, you'll need to install the following additional dependency:

```bash
npm install -D @graphql-codegen/client-preset
```

Then add the following to your `codegen.ts` file:

```ts title="codegen.ts"
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: 'http://localhost:3000/admin-api',
    config: {
        scalars: { Money: 'number' },
        namingConvention: { enumValues: 'keep' },
    },
    generates: {
        // highlight-start
        'apps/marketplace/src/plugins/marketplace/ui/gql/': {
            preset: 'client',
            documents: 'apps/marketplace/src/plugins/marketplace/ui/**/*.ts',
            // This disables the "fragment masking" feature. Fragment masking
            // can improve component isolation but introduces some additional
            // complexity that we will avoid for now.
            presetConfig: {
                fragmentMasking: false,
            },
        },
        // highlight-end
        'apps/marketplace/src/plugins/marketplace/gql/generated.ts': {
            plugins: ['typescript'],
        },
    },
};

export default config;
```

For the client preset plugin, we need to specify a _directory_ (`.../ui/gql/`) because a number of files will get generated.

### Use the `graphql()` function

In your Admin UI components, you can now use the `graphql()` function exported from the generated file to define your
GraphQL operations. For example:

```ts title="apps/marketplace/src/plugins/marketplace/ui/components/organization-list/organization-list.component.ts"
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule, TypedBaseListComponent } from '@vendure/admin-ui/core';
import { graphql } from '../../gql';

// highlight-start
const getOrganizationListDocument = graphql(`
    query GetOrganizationList($options: OrganizationListOptions) {
        organizations(options: $options) {
            items {
                id
                createdAt
                updatedAt
                name
                invoiceEmailAddresses
            }
            totalItems
        }
    }
`);
// highlight-end

@Component({
    selector: 'organization-list',
    templateUrl: './organization-list.component.html',
    styleUrls: ['./organization-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SharedModule],
})
export class OrganizationListComponent extends TypedBaseListComponent<
    // highlight-start
    typeof getOrganizationListDocument,
    'organizations'
    // highlight-end
> {
    
    // Sort & filter definitions omitted for brevity.
    // For a complete ListComponent example, see the 
    // "Creating List Views" guide.

    constructor() {
        super();
        super.configure({
            // highlight-next-line
            document: getOrganizationListDocument,
            getItems: (data) => data.organizations,
            setVariables: (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
            refreshListOnChanges: [this.filters.valueChanges, this.sorts.valueChanges],
        });
    }
}
```

Whenever you write a new GraphQL operation, or change an existing one, you will need to re-run the codegen script to generate the types for that operation.

## Codegen watch mode

You can also set up file watching as described in the [Graphql Code Generator watch mode docs](https://the-guild.dev/graphql/codegen/docs/getting-started/development-workflow#watch-mode).
