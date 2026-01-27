import { SlugInput } from '@/vdb/components/data-input/index.js';
import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { TranslatableFormFieldWrapper } from '@/vdb/components/shared/translatable-form-field.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { NEW_ENTITY_PATH } from '@/vdb/constants.js';
import { extendDetailFormQuery } from '@/vdb/framework/document-extension/extend-detail-form-query.js';
import { addCustomFields } from '@/vdb/framework/document-introspection/add-custom-fields.js';
import {    CustomFieldsPageBlock,
    DetailFormGrid,
    Page,
    PageActionBar,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/vdb/framework/layout-engine/page-layout.js';
import { ActionBarItem } from '@/vdb/framework/layout-engine/action-bar-item-wrapper.js';
import { getDetailQueryOptions, useDetailPage } from '@/vdb/framework/page/use-detail-page.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, ParsedLocation, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ProductOptionsTable } from './components/product-options-table.js';
import {
    createProductOptionGroupDocument,
    productIdNameDocument,
    productOptionGroupDetailDocument,
    updateProductOptionGroupDocument,
} from './product-option-groups.graphql.js';

const pageId = 'product-option-group-detail';

export const Route = createFileRoute('/_authenticated/_products/products_/$productId/option-groups/$id')({
    component: ProductOptionGroupDetailPage,
    loader: async ({ context, params }: { context: any; params: any; location: ParsedLocation }) => {
        if (!params.id) {
            throw new Error('ID param is required');
        }

        const { extendedQuery: extendedQueryDocument } = extendDetailFormQuery(
            addCustomFields(productOptionGroupDetailDocument),
            pageId,
        );
        const result = await context.queryClient.ensureQueryData(
            getDetailQueryOptions(extendedQueryDocument, { id: params.id }),
        );
        const productResult = await context.queryClient.fetchQuery({
            queryKey: [pageId, 'productIdName', params.productId],
            queryFn: () => api.query(productIdNameDocument, { id: params.productId }),
        });
        const entityName = 'ProductOptionGroup';

        if (!result.productOptionGroup) {
            throw new Error(`${entityName} with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/products', label: <Trans>Products</Trans> },
                { path: `/products/${productResult.product.id}`, label: productResult.product.name },
                { path: `/products/${productResult.product.id}`, label: <Trans>Option Groups</Trans> },
                result.productOptionGroup?.name,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function ProductOptionGroupDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { t } = useLingui();

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
                options: [],
                customFields: entity.customFields,
            };
        },
        transformCreateInput: values => {
            return {
                ...values,
                options: [],
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(
                creatingNewEntity
                    ? t`Successfully created product option group`
                    : t`Successfully updated product option group`,
            );
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast(
                creatingNewEntity
                    ? t`Failed to create product option group`
                    : t`Failed to update product option group`,
                {
                    description: err instanceof Error ? err.message : 'Unknown error',
                },
            );
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>
                {creatingNewEntity ? <Trans>New product option group</Trans> : (entity?.name ?? '')}
            </PageTitle>
            <PageActionBar>
                <ActionBarItem itemId="save-button" requiresPermission={['UpdateProduct', 'UpdateCatalog']}>
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                    >
                        {creatingNewEntity ? <Trans>Create</Trans> : <Trans>Update</Trans>}
                    </Button>
                </ActionBarItem>
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
                            render={({ field }) => (
                                <SlugInput
                                    fieldName="code"
                                    watchFieldName="name"
                                    entityName="ProductOptionGroup"
                                    entityId={entity?.id}
                                    {...field}
                                />
                            )}
                        />
                    </DetailFormGrid>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="ProductOptionGroup" control={form.control} />
                {entity && (
                    <PageBlock column="main" blockId="product-options" title={<Trans>Product Options</Trans>}>
                        <ProductOptionsTable productOptionGroupId={entity?.id} />
                    </PageBlock>
                )}
            </PageLayout>
        </Page>
    );
}
