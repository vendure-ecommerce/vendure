import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { Trans } from '@/vdb/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { DeleteZonesBulkAction } from './components/zone-bulk-actions.js';
import { ZoneCountriesSheet } from './components/zone-countries-sheet.js';
import { zoneListQuery } from './zones.graphql.js';

export const Route = createFileRoute('/_authenticated/_zones/zones')({
    component: ZoneListPage,
    loader: () => ({ breadcrumb: () => <Trans>Zones</Trans> }),
});

function ZoneListPage() {
    return (
        <ListPage
            pageId="zone-list"
            listQuery={zoneListQuery}
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
            additionalColumns={{
                regions: {
                    header: 'Regions',
                    cell: ({ row }) => (
                        <ZoneCountriesSheet zoneId={row.original.id} zoneName={row.original.name}>
                            <Trans>Edit members</Trans>
                        </ZoneCountriesSheet>
                    ),
                },
            }}
            bulkActions={[
                {
                    component: DeleteZonesBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateZone']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            <Trans>New Zone</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
