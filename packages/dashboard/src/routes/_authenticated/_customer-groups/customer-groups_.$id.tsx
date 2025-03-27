import { ErrorPage } from '@/components/shared/error-page.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import {
    CustomFieldsPageBlock,
    DetailFormGrid,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageDetailForm,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { CustomerGroupMembersTable } from './components/customer-group-members-table.js';
import {
    createCustomerGroupDocument,
    customerGroupDocument,
    updateCustomerGroupDocument,
} from './customer-groups.graphql.js';

export const Route = createFileRoute('/_authenticated/_customer-groups/customer-groups_/$id')({
    component: CustomerGroupDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: customerGroupDocument,
        breadcrumb: (isNew, entity) => [
            { path: '/customer-groups', label: 'Customer groups' },
            isNew ? <Trans>New customer group</Trans> : entity?.name,
        ],
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function CustomerGroupDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        queryDocument: addCustomFields(customerGroupDocument),
        createDocument: createCustomerGroupDocument,
        updateDocument: updateCustomerGroupDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                name: entity.name,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success(i18n.t('Successfully updated customer group'));
            resetForm();
            if (creatingNewEntity && data?.id) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t('Failed to update customer group'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="customer-group-detail">
            <PageTitle>
                {creatingNewEntity ? <Trans>New customer group</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <PageDetailForm form={form} submitHandler={submitHandler}>
                <PageActionBar>
                    <PageActionBarRight>
                        <PermissionGuard requires={['UpdateCustomerGroup']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
                            </Button>
                        </PermissionGuard>
                    </PageActionBarRight>
                </PageActionBar>
                <PageLayout>
                    <PageBlock column="main" blockId="main-form">
                        <DetailFormGrid>
                            <FormFieldWrapper
                                control={form.control}
                                name="name"
                                label={<Trans>Name</Trans>}
                                render={({ field }) => <Input placeholder="" {...field} />}
                            />
                        </DetailFormGrid>
                    </PageBlock>
                    <CustomFieldsPageBlock column="main" entityType="CustomerGroup" control={form.control} />
                    {entity && (
                        <PageBlock column="main" blockId="customers" title={<Trans>Customers</Trans>}>
                            <CustomerGroupMembersTable customerGroupId={entity?.id} />
                        </PageBlock>
                    )}
                </PageLayout>
            </PageDetailForm>
        </Page>
    );
}
