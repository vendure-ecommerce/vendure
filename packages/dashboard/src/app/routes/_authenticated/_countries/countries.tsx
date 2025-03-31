import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBar, PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { Link, createFileRoute } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { countriesListQuery, deleteCountryDocument } from './countries.graphql.js';

export const Route = createFileRoute('/_authenticated/_countries/countries')({
    component: CountryListPage,
    loader: () => ({ breadcrumb: () => <Trans>Countries</Trans> }),
});

function CountryListPage() {
    return (
        <ListPage
            pageId="country-list"
            listQuery={countriesListQuery}
            deleteMutation={deleteCountryDocument}
            route={Route}
            title="Countries"
            defaultVisibility={{
                name: true,
                code: true,
                enabled: true,
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: {
                        contains: searchTerm,
                    },
                    code: {
                        contains: searchTerm,
                    },
                };
            }}
            transformVariables={variables => {
                return {
                    ...variables,
                    options: {
                        ...variables.options,
                        filterOperator: 'OR',
                    },
                };
            }}
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
            }}
        >
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['CreateCountry']}>
                        <Button asChild>
                            <Link to="./new">
                                <PlusIcon />
                                <Trans>Add Country</Trans>
                            </Link>
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
        </ListPage>
    );
}
