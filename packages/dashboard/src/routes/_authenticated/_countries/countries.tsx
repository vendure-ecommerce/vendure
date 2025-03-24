import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { Trans } from '@lingui/react/macro';
import { Link, createFileRoute } from '@tanstack/react-router';
import { countriesListQuery } from './countries.graphql.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Badge } from '@/components/ui/badge.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { BooleanDisplayBadge } from '@/components/data-display/boolean.js';

export const Route = createFileRoute('/_authenticated/_countries/countries')({
    component: CountryListPage,
    loader: () => ({ breadcrumb: () => <Trans>Countries</Trans> }),
});

function CountryListPage() {
    return (
        <ListPage
            listQuery={addCustomFields(countriesListQuery)}
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
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
                enabled: {
                    header: 'Enabled',
                    cell: ({ row }) => (
                        <BooleanDisplayBadge value={row.original.enabled} />
                    ),
                },
            }}
        >
            <PageActionBar>
                <PermissionGuard requires={['CreateCountry']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            <Trans>Add Country</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
