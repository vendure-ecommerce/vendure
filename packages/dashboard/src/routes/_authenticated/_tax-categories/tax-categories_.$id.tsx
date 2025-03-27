import { ErrorPage } from '@/components/shared/error-page.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Switch } from '@/components/ui/switch.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
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
import {
    createTaxCategoryDocument,
    taxCategoryDetailQuery,
    updateTaxCategoryDocument,
} from './tax-categories.graphql.js';

export const Route = createFileRoute('/_authenticated/_tax-categories/tax-categories_/$id')({
    component: TaxCategoryDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: taxCategoryDetailQuery,
        breadcrumb(isNew, entity) {
            return [
                { path: '/tax-categories', label: 'Tax categories' },
                isNew ? <Trans>New tax category</Trans> : entity?.name,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function TaxCategoryDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: taxCategoryDetailQuery,
        createDocument: createTaxCategoryDocument,
        updateDocument: updateTaxCategoryDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                name: entity.name,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success(i18n.t('Successfully updated tax category'));
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t('Failed to update tax category'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="tax-category-detail">
            <PageTitle>
                {creatingNewEntity ? <Trans>New tax category</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <PageDetailForm form={form} submitHandler={submitHandler}>
                <PageActionBar>
                    <PageActionBarRight>
                        <PermissionGuard requires={['UpdateTaxCategory']}>
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
                                render={({ field }) => <Input {...field} />}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="isDefault"
                                label={<Trans>Is default tax category</Trans>}
                                render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                            />
                       </DetailFormGrid>
                    </PageBlock>
                    <CustomFieldsPageBlock column="main" entityType="TaxCategory" control={form.control} />
                </PageLayout>
            </PageDetailForm>
        </Page>
    );
}
