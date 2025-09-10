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
import { countryDetailDocument, createCountryDocument, updateCountryDocument } from './countries.graphql.js';

const pageId = 'country-detail';

export const Route = createFileRoute('/_authenticated/_countries/countries_/$id')({
    component: CountryDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: countryDetailDocument,
        breadcrumb: (isNew, entity) => [
            { path: '/countries', label: <Trans>Countries</Trans> },
            isNew ? <Trans>New country</Trans> : entity?.name,
        ],
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function CountryDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: countryDetailDocument,
        createDocument: createCountryDocument,
        updateDocument: updateCountryDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                name: entity.name,
                code: entity.code,
                enabled: entity.enabled,
                translations: entity.translations,
                customFields: entity.customFields,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(i18n.t(creatingNewEntity ? 'Successfully created country' : 'Successfully updated country'));
            form.reset(form.getValues());
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast(i18n.t(creatingNewEntity ? 'Failed to create country' : 'Failed to update country'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{creatingNewEntity ? <Trans>New country</Trans> : (entity?.name ?? '')}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateCountry']}>
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
                <PageBlock column="side" blockId="enabled">
                    <FormFieldWrapper
                        control={form.control}
                        label={<Trans>Enabled</Trans>}
                        name="enabled"
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
                            render={({ field }) => <Input placeholder="" {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="code"
                            label={<Trans>Code</Trans>}
                            render={({ field }) => <Input placeholder="" {...field} />}
                        />
                    </DetailFormGrid>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="Country" control={form.control} />
            </PageLayout>
        </Page>
    );
}
