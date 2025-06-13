import { ChannelCodeLabel } from '@/components/shared/channel-code-label.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { channelListQuery, deleteChannelDocument } from './channels.graphql.js';
import { useLocalFormat } from '@/hooks/use-local-format.js';

export const Route = createFileRoute('/_authenticated/_channels/channels')({
    component: ChannelListPage,
    loader: () => ({ breadcrumb: () => <Trans>Channels</Trans> }),
});

function ChannelListPage() {
    const { formatLanguageName } = useLocalFormat();
    return (
        <ListPage
            pageId="channel-list"
            title="Channels"
            listQuery={channelListQuery}
            deleteMutation={deleteChannelDocument}
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
                    header: 'Code',
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
                    header: 'Seller',
                    cell: ({ row }) => {
                        return row.original.seller?.name;
                    }
                },
                defaultLanguageCode: {
                    header: 'Default Language',
                    cell: ({ row }) => {
                        return formatLanguageName(row.original.defaultLanguageCode);
                    }
                },
            }}
        >
            <PageActionBarRight>
                <PermissionGuard requires={['CreateChannel']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Channel
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBarRight>
        </ListPage>
    );
}
