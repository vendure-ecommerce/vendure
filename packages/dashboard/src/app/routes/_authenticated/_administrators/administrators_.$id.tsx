import { ErrorPage } from '@/components/shared/error-page.js';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { RoleSelector } from '@/components/shared/role-selector.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { NEW_ENTITY_PATH } from '@/constants.js';
import {
    CustomFieldsPageBlock,
    Page,
    PageActionBar,
    PageActionBarRight,
    PageBlock,
    PageLayout,
    PageTitle,
} from '@/framework/layout-engine/page-layout.js';
import { detailPageRouteLoader } from '@/framework/page/detail-page-route-loader.js';
import { useDetailPage } from '@/framework/page/use-detail-page.js';
import { Trans, useLingui } from '@/lib/trans.js';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
    administratorDetailDocument,
    createAdministratorDocument,
    updateAdministratorDocument,
} from './administrators.graphql.js';
import { RolePermissionsDisplay } from './components/role-permissions-display.js';

export const Route = createFileRoute('/_authenticated/_administrators/administrators_/$id')({
    component: AdministratorDetailPage,
    loader: detailPageRouteLoader({
        queryDocument: administratorDetailDocument,
        breadcrumb: (isNew, entity) => {
            const name = `${entity?.firstName} ${entity?.lastName}`;
            return [
                { path: '/administrators', label: 'Administrators' },
                isNew ? <Trans>New administrator</Trans> : name,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function AdministratorDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        queryDocument: administratorDetailDocument,
        createDocument: createAdministratorDocument,
        updateDocument: updateAdministratorDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                firstName: entity.firstName,
                lastName: entity.lastName,
                emailAddress: entity.emailAddress,
                password: '',
                customFields: entity.customFields,
                roleIds: entity.user.roles.map(role => role.id),
            };
        },
        transformUpdateInput: input => {
            return {
                ...input,
                password: input.password || undefined,
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(i18n.t('Successfully updated administrator'), {
                position: 'top-right',
            });
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast(i18n.t('Failed to update administrator'), {
                position: 'top-right',
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const name = `${entity?.firstName} ${entity?.lastName}`;
    const roleIds = form.watch('roleIds');

    return (
        <Page pageId="administrator-detail" form={form} submitHandler={submitHandler}>
            <PageTitle>{creatingNewEntity ? <Trans>New administrator</Trans> : name}</PageTitle>

            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateAdministrator']}>
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
                    <div className="md:grid md:grid-cols-2 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="firstName"
                            label={<Trans>First name</Trans>}
                            render={({ field }) => <Input placeholder="" {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="lastName"
                            label={<Trans>Last name</Trans>}
                            render={({ field }) => <Input placeholder="" {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="emailAddress"
                            label={<Trans>Email Address or identifier</Trans>}
                            render={({ field }) => <Input placeholder="" {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="password"
                            label={<Trans>Password</Trans>}
                            render={({ field }) => <Input placeholder="" type="password" {...field} />}
                        />
                    </div>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="Administrator" control={form.control} />
                <PageBlock column="main" blockId="roles" title={<Trans>Roles</Trans>}>
                    <FormFieldWrapper
                        control={form.control}
                        name="roleIds"
                        render={({ field }) => (
                            <RoleSelector
                                value={field.value ?? []}
                                onChange={field.onChange}
                                multiple={true}
                            />
                        )}
                    />
                    <RolePermissionsDisplay value={roleIds ?? []} />
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
