import { Money } from '@/components/data-display/money.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { createDraftOrderDocument, orderListDocument } from './orders.graphql.js';
import { useServerConfig } from '@/hooks/use-server-config.js';
import { PageActionBarRight } from '@/framework/layout-engine/page-layout.js';
import { PlusIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/graphql/api.js';
import { ResultOf } from '@/graphql/graphql.js';

export const Route = createFileRoute('/_authenticated/_orders/orders')({
    component: OrderListPage,
    loader: () => ({ breadcrumb: () => <Trans>Orders</Trans> }),
});

function OrderListPage() {
    const serverConfig = useServerConfig();
    const navigate = useNavigate();
    const { mutate: createDraftOrder } = useMutation({
        mutationFn: api.mutate(createDraftOrderDocument),
        onSuccess: (result: ResultOf<typeof createDraftOrderDocument>) => {
            navigate({ to: '/orders/draft/$id', params: { id: result.createDraftOrder.id } });
        }
    })
    return (
        <ListPage
            pageId="order-list"
            title="Orders"
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
                    header: 'Total',
                    cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        const currencyCode = row.original.currencyCode;
                        return <Money value={value} currencyCode={currencyCode} />;
                    },
                },
                totalWithTax: {
                    header: 'Total with Tax',
                    cell: ({ cell, row }) => {
                        const value = cell.getValue();
                        const currencyCode = row.original.currencyCode;
                        return <Money value={value} currencyCode={currencyCode} />;
                    },
                },
                state: {
                    header: 'State',
                    cell: ({ cell }) => {
                        const value = cell.getValue() as string;
                        return <Badge variant="outline">{value}</Badge>;
                    },
                },
                code: {
                    header: 'Code',
                    cell: ({ cell, row }) => {
                        const value = cell.getValue() as string;
                        const id = row.original.id;
                        return <DetailPageButton id={id} label={value} />;
                    },
                },
                customer: {
                    header: 'Customer',
                    cell: ({ cell }) => {
                        const value = cell.getValue();
                        if (!value) {
                            return null;
                        }
                        return (
                            <Button asChild variant="ghost">
                                <Link to={`/customers/${value.id}`}>
                                    {value.firstName} {value.lastName}
                                </Link>
                            </Button>
                        );
                    },
                },
                shippingLines: {
                    header: 'Shipping',
                    cell: ({ cell }) => {
                        const value = cell.getValue();
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
                    title: 'State',
                    options: serverConfig?.orderProcess.map(state => {
                        return {
                            label: state.name,
                            value: state.name,
                        }
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
