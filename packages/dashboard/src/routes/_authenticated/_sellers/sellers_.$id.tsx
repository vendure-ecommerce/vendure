import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import {
    CustomFieldsPageBlock,
    Page,
    PageActionBar,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { getDetailQueryOptions, useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { CustomerGroupMembersTable } from './components/customer-group-members-table.js';
import {
    createSellerDocument,
    sellerDetailDocument,
    updateSellerDocument,
} from './sellers.graphql.js';
import { CustomerSelector } from '@/components/shared/customer-selector.js';
import { api } from '@/graphql/api.js';
import { addCustomerToGroupDocument } from '../_customers/customers.graphql.js';
import { useMutation } from '@tanstack/react-query';
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';

export const Route = createFileRoute('/_authenticated/_sellers/sellers_/$id')({
    component: SellerDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: sellerDetailDocument,
        breadcrumb: (isNew, entity) => [
            { path: '/sellers', label: 'Sellers' },
            isNew ? <Trans>New seller</Trans> : entity?.name,
        ],
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function SellerDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: sellerDetailDocument,
        createDocument: createSellerDocument,
        updateDocument: updateSellerDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                name: entity.name,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(i18n.t('Successfully updated seller'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../${data?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update seller'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page>
            <PageTitle>
                {creatingNewEntity ? <Trans>New seller</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8">
                    <PageActionBar>
                        <div></div>
                        <PermissionGuard requires={['UpdateSeller']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
                            </Button>
                        </PermissionGuard>
                    </PageActionBar>
                    <PageLayout>
                        <PageBlock column="main">
                            <div className="md:flex w-full gap-4">
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <Trans>Name</Trans>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </PageBlock>
                        <CustomFieldsPageBlock
                            column="main"
                            entityType="Seller"
                            control={form.control}
                        />
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
