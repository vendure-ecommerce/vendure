import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { PageActionBar, PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@lingui/react/macro';
import { Link, createFileRoute } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { ChannelCodeLabel } from '../../../components/shared/channel-code-label.js';
import { channelListQuery, deleteChannelDocument } from './channels.graphql.js';

export const Route = createFileRoute('/_authenticated/_channels/channels')({
    component: ChannelListPage,
    loader: () => ({ breadcrumb: () => <Trans>Channels</Trans> }),
});

function ChannelListPage() {
    return (
        <ListPage
            title="Channels"
            listQuery={channelListQuery}
            deleteMutation={deleteChannelDocument}
            route={Route}
            defaultVisibility={{
                code: true,
                token: true,
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
            }}
        >
            <PageActionBar>
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
            </PageActionBar>
        </ListPage>
    );
}
