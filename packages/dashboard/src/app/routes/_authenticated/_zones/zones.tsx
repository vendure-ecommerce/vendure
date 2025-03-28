import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBar, PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { ZoneCountriesSheet } from './components/zone-countries-sheet.js';
import { deleteZoneDocument, zoneListQuery } from './zones.graphql.js';

export const Route = createFileRoute('/_authenticated/_zones/zones')({
    component: ZoneListPage,
    loader: () => ({ breadcrumb: () => <Trans>Zones</Trans> }),
});

function ZoneListPage() {
    return (
        <ListPage
            pageId="zone-list"
            listQuery={zoneListQuery}
            deleteMutation={deleteZoneDocument}
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
        >
            <PageActionBar>
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
            </PageActionBar>
        </ListPage>
    );
}
