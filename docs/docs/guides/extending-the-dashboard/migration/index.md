---
title: Migrating from Admin UI
sidebar_position: 1
---

# Migrating from Admin UI

If you have existing extensions to the legacy Angular-based Admin UI, you will want to migrate to the new Dashboard to enjoy
an improved developer experience, many more customization options, and ongoing support from the Vendure team.

## AI-Assisted Migration

We highly recommend using AI tools such as Claude Code, Codex etc to assist with migrations from the legacy Angular-based UI extensions
to the new React-based Dashboard.

:::info
The results of AI-assisted migration are heavily dependent on the model that you use. We tested with
Claude Code using Sonnet 4.5, and had good results
:::

In our testing, we were able to perform complete migrations quickly using the following approach:

1. Use the provided prompt or Claude skill and specify which plugin you wish to migrate (do 1 at a time)
2. Allow the AI tool to complete the migration
3. Manually clean up & fix any issues that remain

Using this approach we were able to migrate complete plugins involving list/details views, widgets, and custom field components
in around 20-30 minutes.

### Full Prompt

Paste this into your AI assistant and make sure to specify the plugin by path, i.e.:

```
Migrate the plugin at @src/plugins/my-plugin/ 
to use the new dashboard.

[Pasted text #1 +1390 lines]
```

<div style={{ width: '100%', height: '500px', overflow: 'auto' }}>

<!-- Note: the following code block should not be edited. It is auto-generated from the files in the 
     `.claude/skills/vendure-dashboard-migration` dir, by running the npm script `generate-migration-prompt` from
     the `./docs` dir. -->
````md
## Instructions

1. If not explicitly stated by the user, find out which plugin they want to migrate.
2. Read and understand the overall rules for migration
    - the "General" section below
    - the "Common Tasks" section below
3. Check the tsconfig setup <tsconfig-setup>. This may or may not already be set up.
    - the "TSConfig setup" section below
4. Identify each part of the Admin UI extensions that needs to be
   migrated, and use the data from the appropriate sections to guide
   the migration:
    - the "Forms" section below
    - the "Custom Field Inputs" section below
    - the "List Pages" section below
    - the "Detail Pages" section below
    - the "Adding Nav Menu Items" section below
    - the "Action Bar Items" section below
    - the "Custom Detail Components" section below
    - the "Page Tabs" section below
    - the "Widgets" section below
5. Ensure you have followed the instructions marked "Important" for each section

## General

- For short we use "old" to refer to code written for the Angular Admin UI, and "new" for the React Dashboard
- old code is usually in a plugin's "ui" dir
- new code should be in a plugin's "dashboard" dir
- new code imports all components from `@vendure/dashboard`. It can also import the following as needed:
    - hooks or anything else needed from `react`
    - hooks etc from `@tanstack/react-query`
    - `Link`, `useNavigate` etc from `@tanstack/react-router`
    - `useForm` etc from `react-hook-form`
    - `toast` from `sonner`
    - icons from `lucide-react`
    - for i18n: `Trans`, `useLingui` from `@lingui/react/macro`
- Default to the style conventions of the current project as much as possible (single vs double quotes,
  indent size etc)


## Directory Structure
Given as an example - projects may differ in conventions

### Old

```
- /path/to/plugin
    - /ui
        - providers.ts
        - routes.ts
            - /components
                - /example
                    - example.component.ts
                    - example.component.html
                    - example.component.scss
                    - example.graphql.ts
```


### New

```
- /path/to/plugin
    - /dashboard
        - index.tsx
            - /components
                - example.tsx
```

## Registering extensions

### Old

```ts title="src/plugins/my-plugin/my.plugin.ts"
import * as path from 'path';
import { VendurePlugin } from '@vendure/core';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';

@VendurePlugin({
    // ...
})
export class MyPlugin {
    static ui: AdminUiExtension = {
        id: 'my-plugin-ui',
        extensionPath: path.join(__dirname, 'ui'),
        routes: [{ route: 'my-plugin', filePath: 'routes.ts' }],
        providers: ['providers.ts'],
    };
}
```

### New

```ts title="src/plugins/my-plugin/my.plugin.ts"
import { VendurePlugin } from '@vendure/core';

@VendurePlugin({
    // ...
    // Note that this needs to match the relative path to the
    // index.tsx file from the plugin file
    dashboard: '../dashboard/index.tsx',
})
export class MyPlugin {
    // Do not remove any existing AdminUiExtension def
    // to preserve backward compatibility
    static ui: AdminUiExtension = { /* ... */ }
}
```

Important:
  - Ensure the `dashboard` path is correct relative to the locations of the plugin.ts file and the index.ts file

## Styling

### Old

custom design system based on Clarity UI

```html
<button class="button primary">Primary</button>
<button class="button secondary">Secondary</button>
<button class="button success">Success</button>
<button class="button warning">Warning</button>
<button class="button danger">Danger</button>

<button class="button-ghost">Ghost</button>

<a class="button-ghost" [routerLink]="['/extensions/my-plugin/my-custom-route']">
    <clr-icon shape="arrow" dir="right"></clr-icon>
    John Smith
</a>

<button class="button-small">Small</button>

<button class="button-small">
    <clr-icon shape="layers"></clr-icon>
    Assign to channel
</button>

<clr-icon shape="star" size="8"></clr-icon>

<img [src]="product.featuredAsset?.preview + '?preset=small'" alt="Product preview" />
```

### New

tailwind + shadcn/ui. Shadcn components import from `@vendure/dashboard`

```tsx
import { Button, DetailPageButton, VendureImage } from '@vendure/dashboard';
import { Star } from 'lucide-react';

export function MyComponent() {
    // non-exhaustive - all standard Shadcn props are available
    return (
        <Button variant="default">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Danger</Button>
        <Button variant="ghost">Ghost</Button>
        
        <DetailPageButton id="123" label="John Smith" />
        <DetailPageButton href="/affiliates/my-custom-route" label="John Smith" />
        
        <Star />
        
        <VendureImage
            src={entity.product.featuredAsset}
            alt={entity.product.name}
            preset='small'
        />
    )
} 
```

Important:

  - When using `Badge`, prefer variant="secondary" unless especially important data
  - Where possible avoid specific tailwind colours like `text-blue-600`. Instead use (where possible)
    the Shadcn theme colours, eg:
    ```
    --color-background
    --color-foreground
    --color-primary
    --color-primary-foreground
    --color-secondary
    --color-secondary-foreground
    --color-muted
    --color-muted-foreground
    --color-accent
    --color-accent-foreground
    --color-destructive
    --color-destructive-foreground
    --color-success
    --color-success-foreground
    ```
  - Buttons which link to detail pages should use `DetailPageButton`

## Data access

### Old

```ts
import { DataService } from '@vendure/admin-ui/core';
import { graphql } from "../gql";  
  
export const GET_CUSTOMER_NAME = graphql(`  
    query GetCustomerName($id: ID!) {  
        customer(id: $id) {  
            id  
            firstName            
            lastName
            addresses {
              ...AddressFragment
            }
        }    
	}
`);

this.dataService.query(GET_CUSTOMER_NAME, {  
    id: customerId,  
}),
```

### New

```ts
import { useQuery } from '@tanstack/react-query';  
import { api } from '@vendure/dashboard';  
import { graphql } from '@/gql';

const addressFragment = graphql(`
   # ...
`);

const getCustomerNameDocument = graphql(`  
    query GetCustomerName($id: ID!) {  
        customer(id: $id) {  
            id  
            firstName            
            lastName              
            addresses {
              ...AddressFragment
            }
        }    
	}
`, [addressFragment]);  // Fragments MUST be explicitly referenced

const { data, isLoading, error } = useQuery({  
	queryKey: ['customer-name', customerId],  
	queryFn: () => api.query(getCustomerNameDocument, { id: customerId }),
});
```

Note on graphql fragments: if common fragments are used across files, you may need
to extract them into a common-fragments.graphql.ts file, because with gql.tada they
*must* be explicitly referenced in every document that uses them.

## Common Tasks

### Formatting Dates, Currencies, and Numbers

```tsx
import {useLocalFormat} from '@vendure/dashboard';
// ...
// Intl API formatting tools
const {
    formatCurrency,
    formatNumber,
    formatDate,
    formatRelativeDate,
    formatLanguageName,
    formatRegionName,
    formatCurrencyName,
    toMajorUnits,
    toMinorUnits,
} = useLocalFormat();

formatCurrency(value: number, currency: string, precision?: number)
formatCurrencyName(currencyCode: string, display: 'full' | 'symbol' | 'name' = 'full')
formatNumber(value: number) // human-readable
formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions)
formatRelativeDate(value: string | Date, options?: Intl.RelativeTimeFormatOptions)
```

### Links

Example link destinations:
- Customer detail | <Link to="/customers/$id" params={{ id }}>text</Link>
- Customer list | <Link to="/customers">text</Link>
- Order detail | <Link to="/orders/$id" params={{ id }}>text</Link>

Important: when linking to detail pages, prefer the `DetailPageButton`. If not in a table column,
add `className='border'`.

## TSConfig setup

If not already set up, we need to make sure we have configured tsconfig with:

1. jsx support. Usually create `tsconfig.dashboard.json` like this:
    ```json
    {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "composite": true,
        "jsx": "react-jsx"
      },
      "include": [
        "src/dashboard/**/*.ts",
        "src/dashboard/**/*.tsx"
      ]
    }
    ```
   then reference it from the appropriate tsconfig.json
    ```
    {
        // ...etc
        "references": [
            {
                "path": "./tsconfig.dashboard.json"
            },
        ]
    }
    ```
   This may already be set up (check this). In an Nx-like monorepo
   where each plugin is a separate project, this will need to be done
   per-plugin.
2. Path mapping.
    ```json
     "paths": {
        // Import alias for the GraphQL types, this needs to point to
        // the location specified in the vite.config.mts file as `gqlOutputPath`
        // so will vary depending on project structure
        "@/gql": ["./apps/server/src/gql/graphql.ts"],
        // This line allows TypeScript to properly resolve internal
        // Vendure Dashboard imports, which is necessary for
        // type safety in your dashboard extensions.
        // This path assumes a root-level tsconfig.json file.
        // You may need to adjust it if your project structure is different.
        "@/vdb/*": [
          "./node_modules/@vendure/dashboard/src/lib/*"
     }
     ```
   In an Nx-like monorepo, this would be added to the tsconfig.base.json or
   equivalent.

## Forms

### Old (Angular)
```html
<div class="form-grid">
    <vdr-form-field label="Page title">
        <input type="text" />
    </vdr-form-field>
    <vdr-form-field label="Select input">
        <select>
            <option>Option 1</option>
            <option>Option 2</option>
        </select>
    </vdr-form-field>
    <vdr-form-field label="Checkbox input">
        <input type="checkbox" />
    </vdr-form-field>
    <vdr-form-field label="Textarea input">
        <textarea></textarea>
    </vdr-form-field>
    <vdr-form-field label="Invalid with error">
        <input type="text" [formControl]="invalidFormControl" />
    </vdr-form-field>
    <vdr-rich-text-editor
        class="form-grid-span"
        label="Description"
    ></vdr-rich-text-editor>
</div>
```

### New (React Dashboard)
```tsx
<PageBlock column="main" blockId="main-form">
    <DetailFormGrid>
        <FormFieldWrapper
            control={form.control}
            name="title"
            label="Title"
            render={({ field }) => <Input {...field} />}
        />
        <FormFieldWrapper
            control={form.control}
            name="slug"
            label="Slug"
            render={({ field }) => <Input {...field} />}
        />
    </DetailFormGrid>
    <div className="space-y-6">
        <FormFieldWrapper
            control={form.control}
            name="body"
            label="Content"
            render={({ field }) => (
                <RichTextInput value={field.value ?? ''} onChange={field.onChange} />
            )}
        />
    </div>
</PageBlock>;
```

## Custom Field Inputs

### Old (Angular)

```ts title="src/plugins/common/ui/components/slider-form-input/slider-form-input.component.ts"
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IntCustomFieldConfig, SharedModule, FormInputComponent } from '@vendure/admin-ui/core';

@Component({
    template: `
        <input
            type="range"
            [min]="config.min || 0"
            [max]="config.max || 100"
            [formControl]="formControl" />
        {{ formControl.value }}
    `,
    standalone: true,
    imports: [SharedModule],
})
export class SliderControlComponent implements FormInputComponent<IntCustomFieldConfig> {
    readonly: boolean;
    config: IntCustomFieldConfig;
    formControl: FormControl;
}
```

```ts title="src/plugins/common/ui/providers.ts"
import { registerFormInputComponent } from '@vendure/admin-ui/core';
import { SliderControlComponent } from './components/slider-form-input/slider-form-input.component';

export default [
    registerFormInputComponent('slider-form-input', SliderControlComponent),
];
```

### New (React Dashboard)

```tsx title="src/plugins/my-plugin/dashboard/components/color-picker.tsx"
import { Button, Card, CardContent, cn, DashboardFormComponent, Input } from '@vendure/dashboard';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

// By typing your component as DashboardFormComponent, the props will be correctly typed
export const ColorPickerComponent: DashboardFormComponent = ({ value, onChange, name }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { getFieldState } = useFormContext();
    const error = getFieldState(name).error;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn('w-8 h-8 border-2 border-gray-300 p-0', error && 'border-red-500')}
                    style={{ backgroundColor: error ? 'transparent' : value || '#ffffff' }}
                    onClick={() => setIsOpen(!isOpen)}
                />
                <Input value={value || ''} onChange={e => onChange(e.target.value)} placeholder="#ffffff" />
            </div>

            {isOpen && (
                <Card>
                    <CardContent className="grid grid-cols-4 gap-2 p-2">
                        {colors.map(color => (
                            <Button
                                key={color}
                                type="button"
                                variant="outline"
                                size="icon"
                                className="w-8 h-8 border-2 border-gray-300 hover:border-gray-500 p-0"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                    onChange(color);
                                    setIsOpen(false);
                                }}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
```

```tsx title="src/plugins/my-plugin/dashboard/index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';
import { ColorPickerComponent } from './components/color-picker';

defineDashboardExtension({
    customFormComponents: {
        // Custom field components for custom fields
        customFields: [
            {
                // The "id" is a global identifier for this custom component. We will
                // reference it in the next step.
                id: 'color-picker',
                component: ColorPickerComponent,
            },
        ],
    },
    // ... other extension properties
});
```

## List Pages

### Old (Angular)
```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TypedBaseListComponent, SharedModule } from '@vendure/admin-ui/core';
// This is the TypedDocumentNode generated by GraphQL Code Generator
import { graphql } from '../../gql';

const getReviewListDocument = graphql(`
  query GetReviewList($options: ReviewListOptions) {
    reviews(options: $options) {
      items {
        id
        createdAt
        updatedAt
        title
        rating
        text
        authorName
        productId
      }
      totalItems
    }
  }
`);

@Component({
selector: 'review-list',
templateUrl: './review-list.component.html',
styleUrls: ['./review-list.component.scss'],
changeDetection: ChangeDetectionStrategy.OnPush,
standalone: true,
imports: [SharedModule],
})
export class ReviewListComponent extends TypedBaseListComponent<typeof getReviewListDocument, 'reviews'> {

    // Here we set up the filters that will be available
    // to use in the data table
    readonly filters = this.createFilterCollection()
        .addIdFilter()
        .addDateFilters()
        .addFilter({
            name: 'title',
            type: {kind: 'text'},
            label: 'Title',
            filterField: 'title',
        })
        .addFilter({
            name: 'rating',
            type: {kind: 'number'},
            label: 'Rating',
            filterField: 'rating',
        })
        .addFilter({
            name: 'authorName',
            type: {kind: 'text'},
            label: 'Author',
            filterField: 'authorName',
        })
        .connectToRoute(this.route);

    // Here we set up the sorting options that will be available
    // to use in the data table
    readonly sorts = this.createSortCollection()
        .defaultSort('createdAt', 'DESC')
        .addSort({name: 'createdAt'})
        .addSort({name: 'updatedAt'})
        .addSort({name: 'title'})
        .addSort({name: 'rating'})
        .addSort({name: 'authorName'})
        .connectToRoute(this.route);

    constructor() {
        super();
        super.configure({
            document: getReviewListDocument,
            getItems: data => data.reviews,
            setVariables: (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        title: {
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

```html
<!-- optional if you want some buttons at the top -->
<vdr-page-block>
    <vdr-action-bar>
        <vdr-ab-left></vdr-ab-left>
        <vdr-ab-right>
            <a class="btn btn-primary" *vdrIfPermissions="['CreateReview']" [routerLink]="['./', 'create']">
                <clr-icon shape="plus"></clr-icon>
                Create a review
            </a>
        </vdr-ab-right>
    </vdr-action-bar>
</vdr-page-block>

<!-- The data table -->
<vdr-data-table-2
        id="review-list"
        [items]="items$ | async"
        [itemsPerPage]="itemsPerPage$ | async"
        [totalItems]="totalItems$ | async"
        [currentPage]="currentPage$ | async"
        [filters]="filters"
        (pageChange)="setPageNumber($event)"
        (itemsPerPageChange)="setItemsPerPage($event)"
>
    <!-- optional if you want to support bulk actions -->
    <vdr-bulk-action-menu
            locationId="review-list"
            [hostComponent]="this"
            [selectionManager]="selectionManager"
    />
    
    <!-- Adds a search bar -->
    <vdr-dt2-search
            [searchTermControl]="searchTermControl"
            searchTermPlaceholder="Filter by title"
    />
    
    <!-- Here we define all the available columns -->
    <vdr-dt2-column id="id" [heading]="'common.id' | translate" [hiddenByDefault]="true">
        <ng-template let-review="item">
            {{ review.id }}
        </ng-template>
    </vdr-dt2-column>
    <vdr-dt2-column
            id="created-at"
            [heading]="'common.created-at' | translate"
            [hiddenByDefault]="true"
            [sort]="sorts.get('createdAt')"
    >
        <ng-template let-review="item">
            {{ review.createdAt | localeDate : 'short' }}
        </ng-template>
    </vdr-dt2-column>
    <vdr-dt2-column
            id="updated-at"
            [heading]="'common.updated-at' | translate"
            [hiddenByDefault]="true"
            [sort]="sorts.get('updatedAt')"
    >
        <ng-template let-review="item">
            {{ review.updatedAt | localeDate : 'short' }}
        </ng-template>
    </vdr-dt2-column>
    <vdr-dt2-column id="title" heading="Title" [optional]="false" [sort]="sorts.get('title')">
        <ng-template let-review="item">
            <a class="button-ghost" [routerLink]="['./', review.id]"
            ><span>{{ review.title }}</span>
                <clr-icon shape="arrow right"></clr-icon>
            </a>
        </ng-template>
    </vdr-dt2-column>
    <vdr-dt2-column id="rating" heading="Rating" [sort]="sorts.get('rating')">
        <ng-template let-review="item"><my-star-rating-component [rating]="review.rating"    /></ng-template>
    </vdr-dt2-column>
    <vdr-dt2-column id="author" heading="Author" [sort]="sorts.get('authorName')">
        <ng-template let-review="item">{{ review.authorName }}</ng-template>
    </vdr-dt2-column>
</vdr-data-table-2>
```

```ts
import { registerRouteComponent } from '@vendure/admin-ui/core';

import { ReviewListComponent } from './components/review-list/review-list.component';

export default [
    registerRouteComponent({
        path: '',
        component: ReviewListComponent,
        breadcrumb: 'Product reviews',
    }),
]
```

### New (React Dashboard)

```tsx
import {
    Button,
    DashboardRouteDefinition,
    ListPage,
    PageActionBarRight,
    DetailPageButton,
} from '@vendure/dashboard';
import { Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';

// This function is generated for you by the `vendureDashboardPlugin` in your Vite config.
// It uses gql-tada to generate TypeScript types which give you type safety as you write
// your queries and mutations.
import { graphql } from '@/gql';

// The fields you select here will be automatically used to generate the appropriate columns in the
// data table below.
const getArticleList = graphql(`
    query GetArticles($options: ArticleListOptions) {
        articles(options: $options) {
            items {
                id
                createdAt
                updatedAt
                isPublished
                title
                slug
                body
                customFields
            }
            totalItems
        }
    }
`);

const deleteArticleDocument = graphql(`
    mutation DeleteArticle($id: ID!) {
        deleteArticle(id: $id) {
            result
        }
    }
`);

export const articleList: DashboardRouteDefinition = {
    navMenuItem: {
        sectionId: 'catalog',
        id: 'articles',
        url: '/articles',
        title: 'CMS Articles',
    },
    path: '/articles',
    loader: () => ({
        breadcrumb: 'Articles',
    }),
    component: route => (
        <ListPage
            pageId="article-list"
            title="Articles"
            listQuery={getArticleList}
            deleteMutation={deleteArticleDocument}
            route={route}
            customizeColumns={{
                title: {
                    cell: ({ row }) => {
                        const post = row.original;
                        return <DetailPageButton id={post.id} label={post.title} />;
                    },
                },
            }}
            defaultVisibility={{
                type: true,
                summary: true,
                state: true,
                rating: true,
                authorName: true,
                authorLocation: true,
            }}
            defaultColumnOrder={[
                'type',
                'summary',
                'authorName',
                'authorLocation',
                'rating',
            ]}
        >
            <PageActionBarRight>
                <Button asChild>
                    <Link to="./new">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        New article
                    </Link>
                </Button>
            </PageActionBarRight>
        </ListPage>
    ),
};
```

Important:
    - When using `defaultVisibility`, specify the specific visible ones with `true`. *Do not* mix
      true and false values. It is implicit that any not specified will default to `false`.
    - The `id`, `createdAt` and `updatedAt` never need to be specified in `customizeColumns`, defaultVisibility` or `defaultColumnOrder`.
      They are handled correctly by default.
    - By default the DataTable will handle column names based on the field name,
      e.g. `authorName` -> `Author Name`, `rating` -> `Rating`, so an explicit cell header is
      not needed unless the column header title must significantly differ from the field name.
    - If a custom `cell` function needs to access fields _other_ than the one being rendered,
      those other fields *must* be declared as dependencies:
      ```tsx
      customizeColumns={{
        name: {
          // Note, we DO NOT need to declare "name" as a dependency here,
          // since we are handling the `name` column already.
          meta: { dependencies: ['reviewCount'] },
          cell: ({ row }) => {
            const { name, reviewCount } = row.original;
            return <Badge variant="outline">{name} ({reviewCount})</Badge>
          },
        },
      }}
      ```

## Detail Pages

### Old (Angular)
```ts
import { ResultOf } from '@graphql-typed-document-node/core';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TypedBaseDetailComponent, LanguageCode, NotificationService, SharedModule } from '@vendure/admin-ui/core';

// This is the TypedDocumentNode & type generated by GraphQL Code Generator
import { graphql } from '../../gql';

export const reviewDetailFragment = graphql(`
  fragment ReviewDetail on ProductReview {
    id
    createdAt
    updatedAt
    title
    rating
    text
    authorName
    productId
  }
`);

export const getReviewDetailDocument = graphql(`
  query GetReviewDetail($id: ID!) {
    review(id: $id) {
      ...ReviewDetail
    }
  }
`);

export const createReviewDocument = graphql(`
  mutation CreateReview($input: CreateProductReviewInput!) {
    createProductReview(input: $input) {
      ...ReviewDetail
    }
  }
`);

export const updateReviewDocument = graphql(`
  mutation UpdateReview($input: UpdateProductReviewInput!) {
    updateProductReview(input: $input) {
      ...ReviewDetail
    }
  }
`);

@Component({
    selector: 'review-detail',
    templateUrl: './review-detail.component.html',
    styleUrls: ['./review-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SharedModule],
})
export class ReviewDetailComponent extends TypedBaseDetailComponent<typeof getReviewDetailDocument, 'review'> implements OnInit, OnDestroy {
    detailForm = this.formBuilder.group({
        title: [''],
        rating: [1],
        authorName: [''],
    });

    constructor(private formBuilder: FormBuilder, private notificationService: NotificationService) {
        super();
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.destroy();
    }

    create() {
        const { title, rating, authorName } = this.detailForm.value;
        if (!title || rating == null || !authorName) {
            return;
        }
        this.dataService
            .mutate(createReviewDocument, {
                input: { title, rating, authorName },
            })
            .subscribe(({ createProductReview }) => {
                if (createProductReview.id) {
                    this.notificationService.success('Review created');
                    this.router.navigate(['extensions', 'reviews', createProductReview.id]);
                }
            });
    }

    update() {
        const { title, rating, authorName } = this.detailForm.value;
        this.dataService
            .mutate(updateReviewDocument, {
                input: { id: this.id, title, rating, authorName },
            })
            .subscribe(() => {
                this.notificationService.success('Review updated');
            });
    }

    protected setFormValues(entity: NonNullable<ResultOf<typeof getReviewDetailDocument>['review']>, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            title: entity.name,
            rating: entity.rating,
            authorName: entity.authorName,
            productId: entity.productId,
        });
    }
}
```

```html
<vdr-page-block>
    <vdr-action-bar>
        <vdr-ab-left></vdr-ab-left>
        <vdr-ab-right>
            <button
                class="button primary"
                *ngIf="isNew$ | async; else updateButton"
                (click)="create()"
                [disabled]="detailForm.pristine || detailForm.invalid"
            >
                {{ 'common.create' | translate }}
            </button>
            <ng-template #updateButton>
                <button
                    class="btn btn-primary"
                    (click)="update()"
                    [disabled]="detailForm.pristine || detailForm.invalid"
                >
                    {{ 'common.update' | translate }}
                </button>
            </ng-template>
        </vdr-ab-right>
    </vdr-action-bar>
</vdr-page-block>

<form class="form" [formGroup]="detailForm">
    <vdr-page-detail-layout>
        <!-- The sidebar is used for displaying "metadata" type information about the entity -->
        <vdr-page-detail-sidebar>
            <vdr-card *ngIf="entity$ | async as entity">
                <vdr-page-entity-info [entity]="entity" />
            </vdr-card>
        </vdr-page-detail-sidebar>

        <!-- The main content area is used for displaying the entity's fields -->
        <vdr-page-block>
            <!-- The vdr-card is the container for grouping items together on a page -->
            <!-- it can also take an optional [title] property to display a title -->
            <vdr-card>
                <!-- the form-grid class is used to lay out the form fields -->
                <div class="form-grid">
                    <vdr-form-field label="Title" for="title">
                        <input id="title" type="text" formControlName="title" />
                    </vdr-form-field>
                    <vdr-form-field label="Rating" for="rating">
                        <input id="rating" type="number" min="1" max="5" formControlName="rating" />
                    </vdr-form-field>

                    <!-- etc -->
                </div>
            </vdr-card>
        </vdr-page-block>
    </vdr-page-detail-layout>
</form>
```

```ts
import { registerRouteComponent } from '@vendure/admin-ui/core';

import { ReviewDetailComponent, getReviewDetailDocument } from './components/review-detail/review-detail.component';

export default [
    registerRouteComponent({
        path: ':id',
        component: ReviewDetailComponent,
        query: getReviewDetailDocument,
        entityKey: 'productReview',
        getBreadcrumbs: entity => [
            {
                label: 'Product reviews',
                link: ['/extensions', 'product-reviews'],
            },
            {
                label: `#${entity?.id} (${entity?.product.name})`,
                link: [],
            },
        ],
    }),
]
```

### New (React Dashboard)

```tsx
import {
    DashboardRouteDefinition,
    detailPageRouteLoader,
    useDetailPage,
    Page,
    PageTitle,
    PageActionBar,
    PageActionBarRight,
    PermissionGuard,
    Button,
    PageLayout,
    PageBlock,
    FormFieldWrapper,
    DetailFormGrid,
    Switch,
    Input,
    RichTextInput,
    CustomFieldsPageBlock,
} from '@vendure/dashboard';
import { AnyRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { graphql } from '@/gql';

const articleDetailDocument = graphql(`
    query GetArticleDetail($id: ID!) {
        article(id: $id) {
            id
            createdAt
            updatedAt
            isPublished
            title
            slug
            body
            customFields
        }
    }
`);

const createArticleDocument = graphql(`
    mutation CreateArticle($input: CreateArticleInput!) {
        createArticle(input: $input) {
            id
        }
    }
`);

const updateArticleDocument = graphql(`
    mutation UpdateArticle($input: UpdateArticleInput!) {
        updateArticle(input: $input) {
            id
        }
    }
`);

export const articleDetail: DashboardRouteDefinition = {
    path: '/articles/$id',
    loader: detailPageRouteLoader({
        queryDocument: articleDetailDocument,
        breadcrumb: (isNew, entity) => [
            { path: '/articles', label: 'Articles' },
            isNew ? 'New article' : entity?.title,
        ],
    }),
    component: route => {
        return <ArticleDetailPage route={route} />;
    },
};

function ArticleDetailPage({ route }: { route: AnyRoute }) {
const params = route.useParams();
const navigate = useNavigate();
const creatingNewEntity = params.id === 'new';

    const { form, submitHandler, entity, isPending, resetForm, refreshEntity } = useDetailPage({
        queryDocument: articleDetailDocument,
        createDocument: createArticleDocument,
        updateDocument: updateArticleDocument,
        setValuesForUpdate: article => {
            return {
                id: article?.id ?? '',
                isPublished: article?.isPublished ?? false,
                title: article?.title ?? '',
                slug: article?.slug ?? '',
                body: article?.body ?? '',
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success('Successfully updated article');
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error('Failed to update article', {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="article-detail" form={form} submitHandler={submitHandler}>
            <PageTitle>{creatingNewEntity ? 'New article' : (entity?.title ?? '')}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                        >
                            Update
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="side" blockId="publish-status" title="Status" description="Current status of this article">
                    <FormFieldWrapper
                        control={form.control}
                        name="isPublished"
                        label="Is Published"
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                </PageBlock>
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            name="title"
                            label="Title"
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="slug"
                            label="Slug"
                            render={({ field }) => <Input {...field} />}
                        />
                    </DetailFormGrid>
                    <div className="space-y-6">
                        <FormFieldWrapper
                            control={form.control}
                            name="body"
                            label="Content"
                            render={({ field }) => (
                                <RichTextInput value={field.value ?? ''} onChange={field.onChange} />
                            )}
                        />
                    </div>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="Article" control={form.control} />
            </PageLayout>
        </Page>
    );
}
```

Important:
    - The PageBlock component should *never* contain any Card-like component, because it already
      renders like a card.
    - Use `refreshEntity` to trigger a manual reload of the entity data (e.g. after a mutation
      succeeds)
    - The `DetailFormGrid` has a built-in `mb-6`, but for components not wrapped in this,
      manually ensure there is a y gap of 6 (e.g. wrap in `<div className="space-y-6">`)

## Adding Nav Menu Items

### Old (Angular)
```ts
import { addNavMenuSection } from '@vendure/admin-ui/core';

export default [
    addNavMenuSection({
        id: 'greeter',
        label: 'My Extensions',
        items: [{
            id: 'greeter',
            label: 'Greeter',
            routerLink: ['/extensions/greet'],
            // Icon can be any of https://core.clarity.design/foundation/icons/shapes/
            icon: 'cursor-hand-open',
        }],
    },
    // Add this section before the "settings" section
    'settings'),
];
```

### New (React Dashboard)

```tsx
import { defineDashboardExtension } from '@vendure/dashboard';

defineDashboardExtension({
    routes: [
        {
            path: '/my-custom-page',
            component: () => <div>My Custom Page</div>,
            navMenuItem: {
                // The section where this item should appear
                sectionId: 'catalog',
                // Unique identifier for this menu item
                id: 'my-custom-page',
                // Display text in the navigation
                title: 'My Custom Page',
                // Optional: URL if different from path
                url: '/my-custom-page',
            },
        },
    ],
});
```

## Action Bar Items

### Old (Angular)
```ts
import { addActionBarItem } from '@vendure/admin-ui/core';

export default [
    addActionBarItem({
        id: 'print-invoice',
        locationId: 'order-detail',
        label: 'Print invoice',
        icon: 'printer',
        routerLink: route => {
            const id = route.snapshot.params.id;
            return ['./extensions/order-invoices', id];
        },
        requiresPermission: 'ReadOrder',
    }),
];
```

### New (React Dashboard)

```tsx
import { Button, defineDashboardExtension } from '@vendure/dashboard';
import { useState } from 'react';

defineDashboardExtension({
    actionBarItems: [
        {
            pageId: 'product-detail',
            component: ({ context }) => {
                const [count, setCount] = useState(0);
                return (
                    <Button type="button" variant="secondary" onClick={() => setCount(x => x + 1)}>
                        Counter: {count}
                    </Button>
                );
            },
        },
    ],
});
```

## Custom Detail Components

### Old (Angular)
```ts title="src/plugins/cms/ui/components/product-info/product-info.component.ts"
import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DataService, CustomDetailComponent, SharedModule } from '@vendure/admin-ui/core';
import { CmsDataService } from '../../providers/cms-data.service';

@Component({
    template: `
        <vdr-card title="CMS Info">
            <pre>{{ extraInfo$ | async | json }}</pre>
        </vdr-card>`,
    standalone: true,
    providers: [CmsDataService],
    imports: [SharedModule],
})
export class ProductInfoComponent implements CustomDetailComponent, OnInit {
    // These two properties are provided by Vendure and will vary
    // depending on the particular detail page you are embedding this
    // component into. In this case, it will be a "product" entity.
    entity$: Observable<any>
    detailForm: FormGroup;

    extraInfo$: Observable<any>;

    constructor(private cmsDataService: CmsDataService) {
    }

    ngOnInit() {
        this.extraInfo$ = this.entity$.pipe(
            switchMap(entity => this.cmsDataService.getDataFor(entity.id))
        );
    }
}
```

### New (React Dashboard)

```tsx title="src/plugins/my-plugin/dashboard/index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';

defineDashboardExtension({
    pageBlocks: [
        {
            id: 'related-articles',
            title: 'Related Articles',
            location: {
                // This is the pageId of the page where this block will be
                pageId: 'product-detail',
                // can be "main" or "side"
                column: 'side',
                position: {
                    // Blocks are positioned relative to existing blocks on
                    // the page.
                    blockId: 'facet-values',
                    // Can be "before", "after" or "replace"
                    // Here we'll place it after the `facet-values` block.
                    order: 'after',
                },
            },
            component: ({ context }) => {
                // In the component, you can use the `context` prop to
                // access the entity and the form instance.
                return <div className="text-sm">Articles related to {context.entity.name}</div>;
            },
        },
    ],
});
```

## Page Tabs

### Old (Angular)
```ts
import { registerPageTab } from '@vendure/admin-ui/core';

import { ReviewListComponent } from './components/review-list/review-list.component';

export default [
    registerPageTab({
        location: 'product-detail',
        tab: 'Reviews',
        route: 'reviews',
        tabIcon: 'star',
        component: ReviewListComponent,
    }),
];
```

### New (React Dashboard)

Page tabs are not supported by the Dashboard. Suggest alternative such as a new route.

## Widgets

### Old (Angular)
```ts title="src/plugins/reviews/ui/components/reviews-widget/reviews-widget.component.ts"
import { Component, OnInit } from '@angular/core';
import { DataService, SharedModule } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'reviews-widget',
    template: `
        <ul>
            <li *ngFor="let review of pendingReviews$ | async">
                <a [routerLink]="['/extensions', 'product-reviews', review.id]">{{ review.summary }}</a>
                <span class="rating">{{ review.rating }} / 5</span>
            </li>
        </ul>
    `,
    standalone: true,
    imports: [SharedModule],
})
export class ReviewsWidgetComponent implements OnInit {
    pendingReviews$: Observable<any[]>;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.pendingReviews$ = this.dataService.query(gql`
            query GetAllReviews($options: ProductReviewListOptions) {
                productReviews(options: $options) {
                    items {
                        id
                        createdAt
                        authorName
                        summary
                        rating
                    }
                }
            }`, {
                options: {
                    filter: { state: { eq: 'new' } },
                    take: 10,
                },
            })
            .mapStream(data => data.productReviews.items);
    }
}
```

```ts title="src/plugins/reviews/ui/providers.ts"
import { registerDashboardWidget } from '@vendure/admin-ui/core';

export default [
    registerDashboardWidget('reviews', {
        title: 'Latest reviews',
        supportedWidths: [4, 6, 8, 12],
        requiresPermissions: ['ReadReview'],
        loadComponent: () =>
            import('./reviews-widget/reviews-widget.component').then(
                m => m.ReviewsWidgetComponent,
            ),
    }),
];
```

### New (React Dashboard)

```tsx title="custom-widget.tsx"
import { Badge, DashboardBaseWidget, useLocalFormat, useWidgetFilters } from '@vendure/dashboard';

export function CustomWidget() {
    const { dateRange } = useWidgetFilters();
    const { formatDate } = useLocalFormat();
    return (
        <DashboardBaseWidget id="custom-widget" title="Custom Widget" description="This is a custom widget">
            <div className="flex flex-wrap gap-1">
                <span>Displaying results from</span>
                <Badge variant="secondary">{formatDate(dateRange.from)}</Badge>
                <span>to</span>
                <Badge variant="secondary">{formatDate(dateRange.to)}</Badge>
            </div>
        </DashboardBaseWidget>
    );
}
```

```tsx title="index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';

import { CustomWidget } from './custom-widget';

defineDashboardExtension({
    widgets: [
        {
            id: 'custom-widget',
            name: 'Custom Widget',
            component: CustomWidget,
            defaultSize: { w: 3, h: 3 },
        },
    ],
});
```
````

</div>

### Claude Skills

If you use Claude Code, you can use [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) to set
up a specialized skill for migrating plugins. This has the advantage that you do not need to continually paste in the full prompt,
and it can also be potentially more token-efficient.

To set up a the skill, run this from the root of your project:

```
npx degit vendure-ecommerce/vendure/.claude/skills#minor .claude/skills
```

This command uses [degit](https://github.com/Rich-Harris/degit) to copy over the vendure-dashboard-migration skill to 
your local `./claude/skills` directory.

You can then have Claude Code use the skill with a prompt like:

```
Use the vendure-dashboard-migration skill to migrate 
@src/plugins/my-plugin to use the dashboard
```

:::note
The individual files in the skill contain the exact same content as the full prompt above,
but are more easily reused and can be more token-efficient
:::

### Manual Cleanup

It is very likely you'll still need to do _some_ manual cleanup after an AI-assisted migration. You might run into
things like:

- Non-optimum styling choices
- Issues with the [tsconfig setup](/guides/extending-the-dashboard/getting-started/#installation--setup) not being perfectly implemented.
- For more complex repo structures like a monorepo with plugins as separate libs, you may need to manually implement
  the initial setup of the config files.

## Manual Migration

If you would rather do a full manual migration, you should first follow the [Dashboard Getting Started guide](/guides/extending-the-dashboard/getting-started/)
and the [Extending the Dashboard guide](http://localhost:3001/guides/extending-the-dashboard/extending-overview/).

The remainder of this document details specific features, and how they are now implemented in the new Dashboard.

### Forms

Forms in the Angular Admin UI used `vdr-form-field` components within a `form-grid` class. In the Dashboard, forms use `FormFieldWrapper` with react-hook-form, wrapped in either `DetailFormGrid` for grid layouts or div containers with `space-y-6` for vertical spacing.

| Admin UI | Dashboard | Imported From | Notes |
|----------|-----------|---------------|-------|
| `vdr-form-field` | `FormFieldWrapper` | `@vendure/dashboard` | Uses react-hook-form |
| `form-grid` (class) | `DetailFormGrid` | `@vendure/dashboard` | For grid layouts |
| `vdr-rich-text-editor` | `RichTextInput` | `@vendure/dashboard` | |
| - | `Input` | `@vendure/dashboard` | Basic text input |
| `FormGroup` | `useForm` | `react-hook-form` | Form state management |

```tsx
<PageBlock column="main" blockId="main-form">
    <DetailFormGrid>
        <FormFieldWrapper
            control={form.control}
            name="title"
            label="Title"
            render={({ field }) => <Input {...field} />}
        />
    </DetailFormGrid>
    <div className="space-y-6">
        <FormFieldWrapper
            control={form.control}
            name="body"
            label="Content"
            render={({ field }) => (
                <RichTextInput value={field.value ?? ''} onChange={field.onChange} />
            )}
        />
    </div>
</PageBlock>
```

### Custom Field Inputs

Custom field inputs now use the `DashboardFormComponent` type and are registered via `customFormComponents.customFields` in the Dashboard extension definition. Components receive `value`, `onChange`, and `name` props, and can use `useFormContext()` to access field state and errors.

| Admin UI | Dashboard | Imported From | Notes |
|----------|-----------|---------------|-------|
| `FormInputComponent<T>` | `DashboardFormComponent` | `@vendure/dashboard` | Type for custom field components |
| `registerFormInputComponent()` | `customFormComponents.customFields` | `@vendure/dashboard` | Registration method |
| `formControl` (prop) | `value`, `onChange`, `name` (props) | - | Component receives these props |
| - | `useFormContext()` | `react-hook-form` | Access field state and errors |

```tsx
export const ColorPickerComponent: DashboardFormComponent = ({ value, onChange, name }) => {
    const { getFieldState } = useFormContext();
    const error = getFieldState(name).error;

    return (
        <Input value={value || ''} onChange={e => onChange(e.target.value)} />
    );
};

// Register in index.tsx
defineDashboardExtension({
    customFormComponents: {
        customFields: [
            { id: 'color-picker', component: ColorPickerComponent },
        ],
    },
});
```

### List Pages

List pages migrate from `TypedBaseListComponent` to the `ListPage` component. The `ListPage` automatically generates columns from the GraphQL query fields. Use `customizeColumns` to customize specific columns (e.g., linking with `DetailPageButton`), `defaultVisibility` to control which columns show by default, and `defaultColumnOrder` to set column order.

| Admin UI | Dashboard | Imported From | Notes |
|----------|-----------|---------------|-------|
| `TypedBaseListComponent` | `ListPage` | `@vendure/dashboard` | Main list component |
| `vdr-data-table-2` | `ListPage` | `@vendure/dashboard` | Auto-generates columns |
| `vdr-dt2-column` | `customizeColumns` | - | Prop on `ListPage` |
| `[hiddenByDefault]` | `defaultVisibility` | - | Prop on `ListPage` |
| `registerRouteComponent()` | `DashboardRouteDefinition` | `@vendure/dashboard` | Route registration |
| `[routerLink]` | `DetailPageButton` | `@vendure/dashboard` | For linking to detail pages |

```tsx
export const articleList: DashboardRouteDefinition = {
    path: '/articles',
    component: route => (
        <ListPage
            pageId="article-list"
            title="Articles"
            listQuery={getArticleList}
            deleteMutation={deleteArticleDocument}
            route={route}
            customizeColumns={{
                title: {
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.title} />,
                },
            }}
            defaultVisibility={{
                title: true,
                authorName: true,
            }}
        >
            <PageActionBarRight>
                <Button asChild>
                    <Link to="./new"><PlusIcon /> New article</Link>
                </Button>
            </PageActionBarRight>
        </ListPage>
    ),
};
```

**Important**: When using `defaultVisibility`, only specify visible columns with `true`. The `id`, `createdAt`, and `updatedAt` columns are handled automatically. If a custom `cell` function accesses fields other than the one being rendered, declare them in `meta.dependencies`.

### Detail Pages

Detail pages migrate from `TypedBaseDetailComponent` to the `useDetailPage` hook. The hook handles form initialization, entity loading, and mutations. Use `detailPageRouteLoader` for the route loader, and structure the page with `Page`, `PageActionBar`, `PageLayout`, `PageBlock`, and `DetailFormGrid` components.

| Admin UI | Dashboard | Imported From | Notes |
|----------|-----------|---------------|-------|
| `TypedBaseDetailComponent` | `useDetailPage()` | `@vendure/dashboard` | Hook for detail page logic |
| `this.init()` | `useDetailPage()` | `@vendure/dashboard` | Automatic initialization |
| `this.entity$` | `entity` | - | Returned from `useDetailPage` |
| `FormBuilder` | `form` | - | Returned from `useDetailPage` |
| `dataService.mutate()` | `submitHandler` | - | Returned from `useDetailPage` |
| `vdr-page-detail-layout` | `PageLayout` | `@vendure/dashboard` | Layout component |
| `vdr-page-block` | `PageBlock` | `@vendure/dashboard` | Content block |
| `registerRouteComponent()` | `detailPageRouteLoader()` | `@vendure/dashboard` | Route loader helper |

```tsx
export const articleDetail: DashboardRouteDefinition = {
    path: '/articles/$id',
    loader: detailPageRouteLoader({
        queryDocument: articleDetailDocument,
        breadcrumb: (isNew, entity) => [
            { path: '/articles', label: 'Articles' },
            isNew ? 'New article' : entity?.title,
        ],
    }),
    component: route => {
        const { form, submitHandler, entity, isPending, refreshEntity } = useDetailPage({
            queryDocument: articleDetailDocument,
            createDocument: createArticleDocument,
            updateDocument: updateArticleDocument,
            setValuesForUpdate: article => ({
                title: article?.title ?? '',
                slug: article?.slug ?? '',
            }),
            params: { id: route.useParams().id },
            onSuccess: async data => {
                toast.success('Successfully updated');
            },
        });

        return (
            <Page pageId="article-detail" form={form} submitHandler={submitHandler}>
                <PageLayout>
                    <PageBlock column="main" blockId="main-form">
                        <DetailFormGrid>
                            <FormFieldWrapper control={form.control} name="title" label="Title"
                                render={({ field }) => <Input {...field} />} />
                        </DetailFormGrid>
                    </PageBlock>
                </PageLayout>
            </Page>
        );
    },
};
```

**Important**: `PageBlock` already renders as a card, so never nest Card components inside it. Use `refreshEntity` to manually reload entity data after mutations. Ensure vertical spacing of 6 units for components not in `DetailFormGrid`.

### Nav Menu Items

Nav menu items are now configured via the `navMenuItem` property on route definitions within the `routes` array. Specify `sectionId` (e.g., 'catalog'), unique `id`, and `title`.

| Admin UI | Dashboard | Imported From | Notes |
|----------|-----------|---------------|-------|
| `addNavMenuSection()` | `navMenuItem` | - | Defined on route in `routes` array |
| `label` | `title` | - | Display text |
| `routerLink` | `path` | - | Route path |
| `icon` | - | - | Not supported in Dashboard |

```tsx
defineDashboardExtension({
    routes: [
        {
            path: '/my-custom-page',
            component: () => <div>My Custom Page</div>,
            navMenuItem: {
                sectionId: 'catalog',
                id: 'my-custom-page',
                title: 'My Custom Page',
            },
        },
    ],
});
```

### Action Bar Items

Action bar items migrate from `addActionBarItem` to the `actionBarItems` array in the Dashboard extension. Each item specifies a `pageId` and a `component` function that receives `context`.

| Admin UI | Dashboard | Imported From | Notes |
|----------|-----------|---------------|-------|
| `addActionBarItem()` | `actionBarItems` | - | Array in `defineDashboardExtension` |
| `locationId` | `pageId` | - | Identifies target page |
| `label` | - | - | Render button/component directly |
| `icon` | - | `lucide-react` | Use icon components in button |
| `routerLink` | `Link` / `useNavigate()` | `@tanstack/react-router` | For navigation |

```tsx
defineDashboardExtension({
    actionBarItems: [
        {
            pageId: 'product-detail',
            component: ({ context }) => (
                <Button type="button" variant="secondary" onClick={() => handleAction()}>
                    Custom Action
                </Button>
            ),
        },
    ],
});
```

### Custom Detail Components (Page Blocks)

Custom detail components (Angular `CustomDetailComponent`) are now implemented as page blocks via the `pageBlocks` array. Each block specifies `id`, `title`, `location` (pageId, column, position), and a `component` function that receives `context` with `entity` and form access.

| Admin UI | Dashboard | Imported From | Notes |
|----------|-----------|---------------|-------|
| `CustomDetailComponent` | `pageBlocks` | - | Array in `defineDashboardExtension` |
| `entity$` (Observable) | `context.entity` | - | Available in component function |
| `detailForm` | `context.form` | - | Available in component function |
| `registerCustomDetailComponent()` | `pageBlocks[].location` | - | Positioning configuration |

```tsx
defineDashboardExtension({
    pageBlocks: [
        {
            id: 'related-articles',
            title: 'Related Articles',
            location: {
                pageId: 'product-detail',
                column: 'side',
                position: { blockId: 'facet-values', order: 'after' },
            },
            component: ({ context }) => (
                <div>Articles related to {context.entity.name}</div>
            ),
        },
    ],
});
```

### Page Tabs

Page tabs (`registerPageTab`) are not supported in the Dashboard. Consider alternative approaches such as creating a new route or using page blocks.

| Admin UI | Dashboard | Imported From | Notes |
|----------|-----------|---------------|-------|
| `registerPageTab()` | - | - | Not supported; use routes or page blocks instead |

### Widgets

Dashboard widgets migrate from `registerDashboardWidget` to the `widgets` array. Each widget specifies `id`, `name`, `component`, and `defaultSize`. Widget components can use `useWidgetFilters()` and `useLocalFormat()` hooks, and should wrap content in `DashboardBaseWidget`.

| Admin UI | Dashboard | Imported From | Notes |
|----------|-----------|---------------|-------|
| `registerDashboardWidget()` | `widgets` | - | Array in `defineDashboardExtension` |
| `title` | `name` | - | Widget display name |
| `loadComponent` | `component` | - | Widget component function |
| `supportedWidths` | `defaultSize` | - | Object with `w` and `h` properties |
| - | `DashboardBaseWidget` | `@vendure/dashboard` | Wrapper component for widgets |
| - | `useWidgetFilters()` | `@vendure/dashboard` | Access date range filters |
| - | `useLocalFormat()` | `@vendure/dashboard` | Formatting utilities |

```tsx
export function CustomWidget() {
    const { dateRange } = useWidgetFilters();
    const { formatDate } = useLocalFormat();
    return (
        <DashboardBaseWidget id="custom-widget" title="Custom Widget" description="Widget description">
            <div>
                <Badge variant="secondary">{formatDate(dateRange.from)}</Badge>
                to
                <Badge variant="secondary">{formatDate(dateRange.to)}</Badge>
            </div>
        </DashboardBaseWidget>
    );
}

defineDashboardExtension({
    widgets: [
        { id: 'custom-widget', name: 'Custom Widget', component: CustomWidget, defaultSize: { w: 3, h: 3 } },
    ],
});
```


