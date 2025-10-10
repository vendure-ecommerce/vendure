---
title: 'Creating List Pages'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Setup

:::info
This guide assumes you have a `CmsPlugin` with an `Article` entity, as covered in the [Extending the Dashboard: Plugin Setup](/guides/extending-the-dashboard/extending-overview/#plugin-setup) guide.
:::

List pages can be easily created for any query in the Admin API that follows the [PaginatedList pattern](/guides/how-to/paginated-list/).

For example, the `articles` query of our `CmsPlugin` looks like this:

```graphql
type ArticleList implements PaginatedList {
  items: [Article!]!
  totalItems: Int!
}

extend type Query {
  articles(options: ArticleListOptions): ArticleList!
}
```

## List Page Example

First we'll create a new `article-list.tsx` file in the `./src/plugins/cms/dashboard` directory:

```tsx title="src/plugins/cms/dashboard/article-list.tsx"
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

Let's register this route (and we can also remove the test page) in our `index.tsx` file:

```tsx title="src/plugins/cms/dashboard/index.tsx"
import { defineDashboardExtension } from '@vendure/dashboard';

// highlight-next-line
import { articleList } from './article-list';

defineDashboardExtension({
    routes: [
        // highlight-next-line
        articleList,
    ],
});
```

:::note
After adding new Dashboard files to your plugin, you'll need to re-start the dev server for those
files to be picked up by Vite:

```bash
q # to stop the running dev server
npx vite # to restart
```
:::

## The ListPage Component

The `ListPage` component can be customized to your exact needs, such as:

- Setting the columns which are visible by default
- Setting the default order of the columns
- Defining bulk actions ("delete all selected" etc.)

See the [ListPage component reference](/reference/dashboard/list-views/list-page) for an explanation of the available options.
