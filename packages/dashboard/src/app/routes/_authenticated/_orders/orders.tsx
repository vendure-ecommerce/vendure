import { DetailPageButton } from '@/vdb/components/shared/detail-page-button.js';
import {
    CustomerCell,
    OrderMoneyCell,
    OrderStateCell,
} from '@/vdb/components/shared/table-cell/order-table-cell-components.js';
import { Button } from '@/vdb/components/ui/button.js';
import { PageActionBarRight } from '@/vdb/framework/layout-engine/page-layout.js';
import { ListPage } from '@/vdb/framework/page/list-page.js';
import { api } from '@/vdb/graphql/api.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';
import { useServerConfig } from '@/vdb/hooks/use-server-config.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { createDraftOrderDocument, orderListDocument } from './orders.graphql.js';

export const Route = createFileRoute('/_authenticated/_orders/orders')({
    component: OrderListPage,
    loader: () => ({ breadcrumb: () => <Trans>Orders</Trans> }),
});

function OrderListPage() {
    const serverConfig = useServerConfig();
    const navigate = useNavigate();
    const { i18n } = useLingui();
    const { mutate: createDraftOrder } = useMutation({
        mutationFn: api.mutate(createDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof createDraftOrderDocument>) => {
            navigate({ to: '/orders/draft/$id', params: { id: result.createDraftOrder.id } });
        },
    });
    return (
        <ListPage
            pageId="order-list"
            title={<Trans>Orders</Trans>}
            onSearchTermChange={searchTerm => {
                return {
                    _or: [
                        {
                            code: {
                                contains: searchTerm,
                            },
                        },
                        {
                            customerLastName: {
                                contains: searchTerm,
                            },
                        },
                        {
                            transactionId: {
                                contains: searchTerm,
                            },
                        },
                    ],
                };
            }}
            defaultSort={[{ id: 'orderPlacedAt', desc: true }]}
            listQuery={orderListDocument}
            route={Route}
            customizeColumns={{
                total: {
                    header: () => <Trans>Total</Trans>,
                    cell: OrderMoneyCell,
                },
                totalWithTax: {
                    header: () => <Trans>Total with Tax</Trans>,
                    cell: OrderMoneyCell,
                },
                state: {
                    header: () => <Trans>State</Trans>,
                    cell: OrderStateCell,
                },
                code: {
                    header: () => <Trans>Code</Trans>,
                    cell: ({ cell, row }) => {
                        const value = cell.getValue() as string;
                        const id = row.original.id;
                        return <DetailPageButton id={id} label={value} />;
                    },
                },
                customer: {
                    header: () => <Trans>Customer</Trans>,
                    cell: CustomerCell,
                },
                shippingLines: {
                    header: () => <Trans>Shipping</Trans>,
                    cell: ({ row }) => {
                        const value = row.original.shippingLines;
                        return <div>{value.map(line => line.shippingMethod.name).join(', ')}</div>;
                    },
                },
            }}
            defaultVisibility={{
                id: false,
                createdAt: false,
                updatedAt: false,
                type: false,
                currencyCode: false,
            }}
            facetedFilters={{
                state: {
                    title: i18n.t('State'),
                    options:
                        serverConfig?.orderProcess.map(state => {
                            return {
                                label: state.name,
                                value: state.name,
                            };
                        }) ?? [],
                },
            }}
        >
            <PageActionBarRight>
                <Button onClick={() => createDraftOrder({})}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    <Trans>Draft order</Trans>
                </Button>
            </PageActionBarRight>
        </ListPage>
    );
}
