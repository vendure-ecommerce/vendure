import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { TranslatableFormFieldWrapper } from '@/vdb/components/shared/translatable-form-field.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Switch } from '@/vdb/components/ui/switch.js';
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
import { FacetValuesTable } from './components/facet-values-table.js';
import { createFacetDocument, facetDetailDocument, updateFacetDocument } from './facets.graphql.js';

const pageId = 'facet-detail';

export const Route = createFileRoute('/_authenticated/_facets/facets_/$id')({
    component: FacetDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: facetDetailDocument,
        breadcrumb(isNew, entity) {
            return [{ path: '/facets', label: <Trans>Facets</Trans> }, isNew ? <Trans>New facet</Trans> : entity?.name];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function FacetDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: facetDetailDocument,
        createDocument: createFacetDocument,
        updateDocument: updateFacetDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                isPrivate: entity.isPrivate,
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
            toast(i18n.t(creatingNewEntity ? 'Successfully created facet' : 'Successfully updated facet'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast(i18n.t(creatingNewEntity ? 'Failed to create facet' : 'Failed to update facet'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{creatingNewEntity ? <Trans>New facet</Trans> : (entity?.name ?? '')}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                        >
                            {creatingNewEntity ? <Trans>Create</Trans> : <Trans>Update</Trans>}
                        </Button>
                    </PermissionGuard>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="side" blockId="privacy">
                    <FormFieldWrapper
                        control={form.control}
                        name="isPrivate"
                        label={<Trans>Private</Trans>}
                        description={<Trans>Private facets are not visible in the shop</Trans>}
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                </PageBlock>
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
                <CustomFieldsPageBlock column="main" entityType="Facet" control={form.control} />
                {entity && (
                    <PageBlock column="main" blockId="facet-values" title={<Trans>Facet values</Trans>}>
                        <FacetValuesTable facetId={entity?.id} />
                    </PageBlock>
                )}
            </PageLayout>
        </Page>
    );
}
