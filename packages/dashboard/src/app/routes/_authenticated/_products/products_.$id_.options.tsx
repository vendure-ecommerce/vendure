import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Page, PageBlock, PageLayout, PageTitle } from '@/vdb/framework/layout-engine/page-layout.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { AddOptionGroupDialog } from './components/add-option-group-dialog.js';
import { AddOptionValueDialog } from './components/add-option-value-dialog.js';
import { deleteProductOptionDocument } from './product-option-groups.graphql.js';
import {
    productDetailWithVariantsDocument,
    removeOptionGroupFromProductDocument,
} from './products.graphql.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';

const pageId = 'manage-product-options';
const getQueryKey = (id: string) => ['DetailPage', 'product', id, 'manage-options'];

export const Route = createFileRoute('/_authenticated/_products/products_/$id_/options')({
    component: ManageProductOptions,
    loader: async ({ context, params }) => {
        if (!params.id) {
            throw new Error('ID param is required');
        }
        const result = await context.queryClient.ensureQueryData({
            queryKey: getQueryKey(params.id),
            queryFn: () => api.query(productDetailWithVariantsDocument, { id: params.id }),
        });
        return {
            breadcrumb: [
                { path: '/products', label: <Trans>Products</Trans> },
                { path: `/products/${params.id}`, label: result.product?.name },
                { label: <Trans>Manage Options</Trans> },
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function ManageProductOptions() {
    const { id } = Route.useParams();
    const { t } = useLingui();

    const { data: productData, refetch } = useQuery({
        queryFn: () => api.query(productDetailWithVariantsDocument, { id }),
        queryKey: getQueryKey(id),
    });

    const deleteOptionMutation = useMutation({
        mutationFn: api.mutate(deleteProductOptionDocument),
        onSuccess: (data: ResultOf<typeof deleteProductOptionDocument>) => {
            const result = data.deleteProductOption;
            if (result.result === 'DELETED') {
                toast.success(t`Successfully deleted option`);
                refetch();
            } else {
                toast.error(t`Failed to delete option`, {
                    description: result.message,
                });
            }
        },
        onError: error => {
            toast.error(t`Failed to delete option`, {
                description: error instanceof Error ? error.message : t`Unknown error`,
            });
        },
    });

    const removeOptionGroupMutation = useMutation({
        mutationFn: api.mutate(removeOptionGroupFromProductDocument),
        onSuccess: (data: ResultOf<typeof removeOptionGroupFromProductDocument>) => {
            const result = data.removeOptionGroupFromProduct;
            if ('errorCode' in result) {
                toast.error(t`Failed to remove option group`, {
                    description: result.message,
                });
            } else {
                toast.success(t`Option group removed`);
                refetch();
            }
        },
        onError: error => {
            toast.error(t`Failed to remove option group`, {
                description: error instanceof Error ? error.message : t`Unknown error`,
            });
        },
    });

    const handleDeleteOption = async (optionId: string) => {
        if (confirm(t`Are you sure you want to delete this option?`)) {
            await deleteOptionMutation.mutateAsync({ id: optionId });
        }
    };

    const handleRemoveOptionGroup = async (optionGroupId: string) => {
        if (confirm(t`Are you sure you want to remove this option group from the product?`)) {
            await removeOptionGroupMutation.mutateAsync({
                productId: id,
                optionGroupId,
            });
        }
    };

    if (!productData?.product) {
        return null;
    }

    return (
        <Page pageId={pageId}>
            <PageTitle>
                {productData.product.name} - <Trans>Manage Options</Trans>
            </PageTitle>
            <PageLayout>
                <PageBlock column="main" blockId="option-groups" title={<Trans>Option Groups</Trans>}>
                    <div className="space-y-4 mb-4">
                        {productData.product.optionGroups.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                <Trans>
                                    No option groups defined yet. Add option groups to create different
                                    variants of your product (e.g., Size, Color, Material)
                                </Trans>
                            </p>
                        ) : (
                            productData.product.optionGroups.map(group => (
                                <div key={group.id} className="grid grid-cols-12 gap-4 items-start">
                                    <div className="col-span-3">
                                        <label className="text-sm font-medium">
                                            <Trans>Option</Trans>
                                        </label>
                                        <Input value={group.name} disabled />
                                    </div>
                                    <div className="col-span-8">
                                        <label className="text-sm font-medium">
                                            <Trans>Option values</Trans>
                                        </label>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {group.options.map(option => (
                                                <Badge
                                                    key={option.id}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {option.name}
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-4 w-4 p-0 ml-1 hover:bg-destructive/20"
                                                        onClick={() => handleDeleteOption(option.id)}
                                                        disabled={deleteOptionMutation.isPending}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                            <AddOptionValueDialog
                                                groupId={group.id}
                                                groupName={group.name}
                                                onSuccess={() => refetch()}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex items-end pb-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleRemoveOptionGroup(group.id)}
                                            disabled={removeOptionGroupMutation.isPending}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <AddOptionGroupDialog productId={id} onSuccess={() => refetch()} />
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
