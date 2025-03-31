import { Money } from '@/components/data-display/money.js';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import { ListPage } from '@/framework/page/list-page.js';
import { Trans } from '@/lib/trans.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { orderListDocument } from './orders.graphql.js';

export const Route = createFileRoute('/_authenticated/_orders/orders')({
    component: OrderListPage,
    loader: () => ({ breadcrumb: () => <Trans>Orders</Trans> }),
});

function OrderListPage() {
    return (
        <ListPage
            pageId="order-list"
            title="Orders"
            onSearchTermChange={searchTerm => {
                return {
                    code: {
                        contains: searchTerm,
                    },
                    customerLastName: {
                        contains: searchTerm,
                    },
                    transactionId: {
                        contains: searchTerm,
                    },
                };
            }}
            defaultSort={[{ id: 'orderPlacedAt', desc: true }]}
            transformVariables={variables => {
                return {
                    ...variables,
                    filterOperator: 'OR',
                };
            }}
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
        />
    );
}
