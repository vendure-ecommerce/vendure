import { ChannelCodeLabel } from '@/vdb/components/shared/channel-code-label.js';
import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Trans } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { channelListQuery } from './channels.graphql.js';
import { DeleteChannelsBulkAction } from './components/channel-bulk-actions.js';

export const Route = createFileRoute('/_authenticated/_channels/channels')({
    component: ChannelListPage,
    loader: () => ({ breadcrumb: () => <Trans>Channels</Trans> }),
});

function ChannelListPage() {
    const { formatLanguageName } = useLocalFormat();
    return (
        <ListPage
            pageId="channel-list"
            title={<Trans>Channels</Trans>}
            listQuery={channelListQuery}
            route={Route}
            defaultVisibility={{
                code: true,
                token: true,
                availableCurrencyCodes: false,
                availableLanguageCodes: false,
                defaultTaxZone: false,
                defaultShippingZone: false,
            }}
            onSearchTermChange={searchTerm => {
                return {
                    code: { contains: searchTerm },
                };
            }}
            customizeColumns={{
                code: {
                    header: () => <Trans>Code</Trans>,
                    cell: ({ row }) => {
                        return (
                            <DetailPageButton
                                id={row.original.id}
                                label={<ChannelCodeLabel code={row.original.code} />}
                            />
                        );
                    },
                },
                seller: {
                    header: () => <Trans>Seller</Trans>,
                    cell: ({ row }) => {
                        return row.original.seller?.name;
                    },
                },
                defaultLanguageCode: {
                    header: () => <Trans>Default Language</Trans>,
                    cell: ({ row }) => {
                        return formatLanguageName(row.original.defaultLanguageCode);
                    },
                },
            }}
            bulkActions={[
                {
                    component: DeleteChannelsBulkAction,
                    order: 500,
                },
            ]}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateChannel']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <Trans>New Channel</Trans>
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
