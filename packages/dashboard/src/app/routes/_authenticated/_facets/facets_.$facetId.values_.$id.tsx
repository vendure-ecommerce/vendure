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
import {
    createFacetValueDocument,
    facetValueDetailDocument,
    updateFacetValueDocument,
} from './facets.graphql.js';
import { PageBreadcrumb } from '@/vdb/components/layout/generated-breadcrumbs.js';

const pageId = 'facet-value-detail';

export const Route = createFileRoute('/_authenticated/_facets/facets_/$facetId/values_/$id')({
    component: FacetValueDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: facetValueDetailDocument,
        breadcrumb(isNew, entity) {
            const facetName = entity?.facet.name ?? 'Facet Value';
            const breadcrumb: PageBreadcrumb[] = [{ path: '/facets', label: <Trans>Facets</Trans> }];
            if (isNew) {
                breadcrumb.push(<Trans>New facet value</Trans>);
            } else if (entity) {
                breadcrumb.push({ path: `/facets/${entity?.facet.id}`, label: facetName }, entity.name);
            }
            return breadcrumb;
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function FacetValueDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: facetValueDetailDocument,
        createDocument: createFacetValueDocument,
        updateDocument: updateFacetValueDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                code: entity.code,
                name: entity.name,
                translations: entity.translations.map(translation => ({
                    id: translation.id,
                    languageCode: translation.languageCode,
                    name: translation.name,
                    customFields: (translation as any).customFields,
                })),
                customFields: entity.customFields as any,
            };
        },
        transformCreateInput: (value): any => {
            return {
                ...value,
                facetId: params.facetId,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(i18n.t(creatingNewEntity ? 'Successfully created facet value' : 'Successfully updated facet value'));
            resetForm();
            const created = Array.isArray(data) ? data[0] : data;
            if (creatingNewEntity && created) {
                await navigate({ to: `../$id`, params: { id: (created as any).id } });
            }
        },
        onError: err => {
            toast(i18n.t(creatingNewEntity ? 'Failed to create facet value' : 'Failed to update facet value'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>
                {creatingNewEntity ? <Trans>New facet value</Trans> : ((entity as any)?.name ?? '')}
            </PageTitle>
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
                <PageBlock column="side" blockId="facet-info">
                    {entity?.facet && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium">
                                <Trans>Facet</Trans>
                            </div>
                            <div className="text-sm text-muted-foreground">{entity?.facet.name}</div>
                            <div className="text-xs text-muted-foreground">{entity?.facet.code}</div>
                        </div>
                    )}
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
                <CustomFieldsPageBlock column="main" entityType="FacetValue" control={form.control} />
            </PageLayout>
        </Page>
    );
}
