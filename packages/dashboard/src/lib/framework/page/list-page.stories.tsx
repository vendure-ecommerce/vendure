import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import type { Meta, StoryObj } from '@storybook/react';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { ListPage, ListPageProps } from './list-page.js';

// Sample GraphQL query for countries
const countryItemFragment = graphql(`
    fragment CountryItem on Country {
        id
        createdAt
        updatedAt
        name
        code
        enabled
    }
`);

const countriesListQuery = graphql(
    `
        query CountriesList($options: CountryListOptions) {
            countries(options: $options) {
                items {
                    ...CountryItem
                }
                totalItems
            }
        }
    `,
    [countryItemFragment],
);

const deleteCountryDocument = graphql(`
    mutation DeleteCountry($id: ID!) {
        deleteCountry(id: $id) {
            result
            message
        }
    }
`);

// Wrapper component that sets up the router
function ListPageStoryWrapper(props: Omit<ListPageProps<any, any, any, any>, 'route'>) {
    const StoryComponent = () => <ListPage {...props} route={() => countriesRoute} />;

    const rootRoute = createRootRoute();
    const countriesRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: '/countries',
        component: StoryComponent,
        loader: () => ({ breadcrumb: 'Countries' }),
    });

    const router = createRouter({
        routeTree: rootRoute.addChildren([countriesRoute]),
        history: createMemoryHistory({
            initialEntries: ['/countries'],
        }),
    });

    return <RouterProvider router={router} />;
}

const meta = {
    title: 'Framework/ListPage',
    component: ListPageStoryWrapper,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        pageId: {
            control: 'text',
            description: 'Unique identifier for the list page',
        },
        title: {
            control: 'text',
            description: 'Page title displayed in the header',
        },
        listQuery: {
            control: false,
            description: 'GraphQL query document for fetching list data',
        },
        deleteMutation: {
            control: false,
            description: 'GraphQL mutation document for deleting items',
        },
        customizeColumns: {
            control: false,
            description: 'Customize column rendering and behavior',
        },
        defaultVisibility: {
            control: 'object',
            description: 'Default visible columns',
        },
    },
} satisfies Meta<typeof ListPageStoryWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic example of a ListPage showing countries from the demo API.
 * This demonstrates the minimal configuration needed to render a list.
 */
export const BasicList: Story = {
    args: {
        pageId: 'country-list',
        listQuery: countriesListQuery,
        title: 'Countries',
        defaultVisibility: {
            name: true,
            code: true,
            enabled: true,
        },
    },
};

/**
 * ListPage with custom column rendering and delete mutation.
 * Shows how to customize the name column to render as a detail page button.
 */
export const WithCustomColumns: Story = {
    args: {
        pageId: 'country-list-custom',
        listQuery: countriesListQuery,
        deleteMutation: deleteCountryDocument,
        title: 'Countries',
        defaultVisibility: {
            name: true,
            code: true,
            enabled: true,
        },
        customizeColumns: {
            name: {
                cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
            },
        },
    },
};

/**
 * ListPage with search functionality.
 * Demonstrates how to configure search to filter on multiple fields.
 */
export const WithSearch: Story = {
    args: {
        pageId: 'country-list-search',
        listQuery: countriesListQuery,
        title: 'Countries',
        defaultVisibility: {
            name: true,
            code: true,
            enabled: true,
        },
        onSearchTermChange: (searchTerm: string) => {
            return {
                name: {
                    contains: searchTerm,
                },
                code: {
                    contains: searchTerm,
                },
            };
        },
        transformVariables: (variables: any) => {
            return {
                ...variables,
                options: {
                    ...variables.options,
                    filterOperator: 'OR',
                },
            };
        },
        customizeColumns: {
            name: {
                cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
            },
        },
    },
};

/**
 * Complete example with action bar and all features.
 * Shows the full ListPage configuration including custom action buttons.
 */
export const Complete: Story = {
    args: {
        pageId: 'country-list-complete',
        listQuery: countriesListQuery,
        deleteMutation: deleteCountryDocument,
        title: 'Countries',
        defaultVisibility: {
            name: true,
            code: true,
            enabled: true,
        },
        onSearchTermChange: (searchTerm: string) => {
            return {
                name: {
                    contains: searchTerm,
                },
                code: {
                    contains: searchTerm,
                },
            };
        },
        transformVariables: (variables: any) => {
            return {
                ...variables,
                options: {
                    ...variables.options,
                    filterOperator: 'OR',
                },
            };
        },
        customizeColumns: {
            name: {
                cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
            },
        },
        children: (
            <PageActionBarRight>
                <Button>
                    <PlusIcon />
                    Add Country
                </Button>
            </PageActionBarRight>
        ),
    },
};
