import { ContentLanguageSelector } from '@/components/layout/content-language-selector.js';
import { ErrorPage } from '@/components/shared/error-page.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { TranslatableFormField } from '@/components/shared/translatable-form-field.js';
import { Button } from '@/components/ui/button.js';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Switch } from '@/components/ui/switch.js';
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
import { FacetValuesTable } from './components/facet-values-table.js';
import { createFacetDocument, facetDetailDocument, updateFacetDocument } from './facets.graphql.js';

export const Route = createFileRoute('/_authenticated/_facets/facets_/$id')({
    component: FacetDetailPage,
    loader: async ({ context, params }) => {
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(facetDetailDocument), { id: params.id }),
                  { id: params.id },
              );
        if (!isNew && !result.facet) {
            throw new Error(`Facet with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: [
                { path: '/facets', label: 'Facets' },
                isNew ? <Trans>New facet</Trans> : result.facet.name,
            ],
        };
    },
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

export function FacetDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: addCustomFields(facetDetailDocument),
        entityField: 'facet',
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
                    customFields: translation.customFields,
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
            toast(i18n.t('Successfully updated facet'), {
                position: 'top-right',
            });
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../${data?.id}`, from: Route.id });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update facet'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const [price, taxCategoryId] = form.watch(['price', 'taxCategoryId']);

    return (
        <Page>
            <PageTitle>{creatingNewEntity ? <Trans>New facet</Trans> : (entity?.name ?? '')}</PageTitle>
            <Form {...form}>
                <form onSubmit={submitHandler} className="space-y-8"> 
                    <PageActionBar>
                        <ContentLanguageSelector />
                        <PermissionGuard requires={['UpdateProduct', 'UpdateCatalog']}>
                            <Button
                                type="submit"
                                disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                            >
                                <Trans>Update</Trans>
                            </Button>
                        </PermissionGuard>
                    </PageActionBar>
                    <PageLayout>
                        <PageBlock column="side">
                            <FormField
                                control={form.control}
                                name="isPrivate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Trans>Private</Trans>
                                        </FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>
                                            <Trans>Private facets are not visible in the shop</Trans>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </PageBlock>
                        <PageBlock column="main">
                            <div className="md:flex w-full gap-4">
                                <div className="w-1/2">
                                    <TranslatableFormField
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
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    <Trans>Code</Trans>
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
                        <CustomFieldsPageBlock column="main" entityType="Facet" control={form.control} />
                        {!creatingNewEntity && (
                            <PageBlock column="main" title={<Trans>Facet values</Trans>}>
                                <FacetValuesTable facetId={entity?.id} />
                            </PageBlock>
                        )}
                    </PageLayout>
                </form>
            </Form>
        </Page>
    );
}
