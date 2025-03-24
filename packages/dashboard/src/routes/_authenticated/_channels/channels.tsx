import { Link, createFileRoute } from '@tanstack/react-router';
import { channelListQuery } from './channels.graphql.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Button } from '@/components/ui/button.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { PlusIcon } from 'lucide-react';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { Trans } from '@lingui/react/macro';
import { ChannelCodeLabel } from './components/channel-code-label.js';

export const Route = createFileRoute('/_authenticated/_channels/channels')({
    component: ChannelListPage,
    loader: () => ({ breadcrumb: () => <Trans>Channels</Trans> }),
});

function ChannelListPage() {
    return (
        <ListPage
            title="Channels"
            listQuery={addCustomFields(channelListQuery)}
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
                        return <DetailPageButton id={row.original.id} label={<ChannelCodeLabel code={row.original.code} />} />;
                    },
                },
            }}
        >
            <PageActionBar>
                <PermissionGuard requires={['CreateChannel']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Channel
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}
