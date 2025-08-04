import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { TranslatableFormFieldWrapper } from '@/vdb/components/shared/translatable-form-field.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { NEW_ENTITY_PATH } from '@/vdb/constants.js';
import {
    CustomFieldsPageBlock,
    DetailFormGrid,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/vdb/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/vdb/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/vdb/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { ProductOptionsTable } from './components/product-options-table.js';
import { createProductOptionGroupDocument, productOptionGroupDetailDocument, updateProductOptionGroupDocument } from './product-option-groups.graphql.js';

const pageId = 'product-option-group-detail';

export const Route = createFileRoute('/_authenticated/_product-option-groups/product-option-groups_/$id')({
    component: ProductOptionGroupDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: productOptionGroupDetailDocument,
        breadcrumb(isNew, entity) {
            return [{ path: '/product-option-groups', label: 'Product Option Groups' }, isNew ? <Trans>New Product Option Group</Trans> : entity?.name];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function ProductOptionGroupDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: productOptionGroupDetailDocument,
        createDocument: createProductOptionGroupDocument,
        updateDocument: updateProductOptionGroupDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                code: entity.code,
                translations: entity.translations.map(translation => ({
                    id: translation.id,
                    languageCode: translation.languageCode,
                    name: translation.name,
                    customFields: (translation as any).customFields,
                })),
                values: [],
                customFields: entity.customFields,
            };
        },
        transformCreateInput: values => {
            return {
                ...values,
                values: [],
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(i18n.t('Successfully updated product option group'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update product option group'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{creatingNewEntity ? <Trans>New product option group</Trans> : (entity?.name ?? '')}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
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
                        <TranslatableFormFieldWrapper
                            control={form.control}
                            name="name"
                            label={<Trans>Name</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="code"
                            label={<Trans>Code</Trans>}
                            render={({ field }) => <Input {...field} />}
                        />
                    </DetailFormGrid>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="ProductOptionGroup" control={form.control} />
                {entity && (
                    <PageBlock column="main" blockId="product-options" title={<Trans>Product options</Trans>}>
                        <ProductOptionsTable groupId={entity?.id} />
                    </PageBlock>
                )}
            </PageLayout>
        </Page>
    );
}
