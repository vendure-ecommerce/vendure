import { Money } from '@/components/data-display/money.js';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { ListPage } from '@/framework/page/list-page.js';
import { ResultOf } from '@/graphql/graphql.js';
import { createFileRoute, Link } from '@tanstack/react-router';
import { orderListDocument } from './orders.graphql.js';

export const Route = createFileRoute('/_authenticated/_orders/orders')({
    component: OrderListPage,
});

export function OrderListPage() {
    return (
        <ListPage
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
            transformVariables={variables => {
                return {
                    ...variables,
                    filterOperator: 'OR',
                };
            }}
            listQuery={addCustomFields(orderListDocument)}
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
                        return (
                            <Button asChild variant="ghost">
                                <Link to={`/customers/${id}`}>{value}</Link>
                            </Button>
                        );
                    },
                },
                customer: {
                    header: 'Customer',
                    cell: ({ cell }) => {
                        const value = cell.getValue() as ResultOf<
                            typeof orderListDocument
                        >['orders']['items'][number]['customer'];
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
                        const value = cell.getValue() as ResultOf<typeof orderListDocument>['orders']['items'][number]['shippingLines'];
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
