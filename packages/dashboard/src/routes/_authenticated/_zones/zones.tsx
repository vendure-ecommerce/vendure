import { Trans } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';
import { ListPage } from '@/framework/page/list-page.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { zoneListQuery } from './zones.graphql.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { ZoneCountriesSheet } from './components/zone-countries-sheet.js';

export const Route = createFileRoute('/_authenticated/_zones/zones')({
    component: ZoneListPage,
    loader: () => ({ breadcrumb: () => <Trans>Zones</Trans> }),
});

function ZoneListPage() {
    return (
        <ListPage
            listQuery={addCustomFields(zoneListQuery)}
            route={Route}
            title="Zones"
            defaultVisibility={{
                name: true,
            }}
            customizeColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => <DetailPageButton id={row.original.id} label={row.original.name} />,
                },
            }}
            additionalColumns={[
                {
                    id: 'regions',
                    header: 'Regions',
                    cell: ({ row }) => (
                        <ZoneCountriesSheet zoneId={row.original.id} zoneName={row.original.name}>
                            <Trans>Edit members</Trans>
                        </ZoneCountriesSheet>
                    ),
                },
            ]}
        />
    );
}
