import { ChannelSelector } from '@/vdb/components/shared/channel-selector.js';
import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { NEW_ENTITY_PATH } from '@/vdb/constants.js';
import {
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
import { PermissionsGrid } from './components/permissions-grid.js';
import { createRoleDocument, roleDetailDocument, updateRoleDocument } from './roles.graphql.js';

const pageId = 'role-detail';

export const Route = createFileRoute('/_authenticated/_roles/roles_/$id')({
    component: RoleDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: roleDetailDocument,
        breadcrumb(isNew, entity) {
            return [
                { path: '/roles', label: <Trans>Roles</Trans> },
                isNew ? <Trans>New role</Trans> : entity?.description,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function RoleDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: roleDetailDocument,
        createDocument: createRoleDocument,
        updateDocument: updateRoleDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                code: entity.code,
                description: entity.description,
                permissions: entity.permissions,
                channelIds: entity.channels.map(channel => channel.id),
            };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast.success(i18n.t(creatingNewEntity ? 'Successfully created role' : 'Successfully updated role'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast.error(i18n.t(creatingNewEntity ? 'Failed to create role' : 'Failed to update role'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{creatingNewEntity ? <Trans>New role</Trans> : (entity?.description ?? '')}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateAdministrator']}>
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
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label={<Trans>Description</Trans>}
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
                <PageBlock column="main" blockId="channels">
                    <div className="space-y-8">
                        <div className="md:grid md:grid-cols-2 gap-4">
                            <FormFieldWrapper
                                control={form.control}
                                name="channelIds"
                                label={<Trans>Channels</Trans>}
                                description={
                                    <Trans>
                                        The selected permissions will be applied to the these channels.
                                    </Trans>
                                }
                                render={({ field }) => (
                                    <ChannelSelector
                                        multiple={true}
                                        value={field.value ?? []}
                                        onChange={value => field.onChange(value)}
                                    />
                                )}
                            />
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            name="permissions"
                            label={<Trans>Permissions</Trans>}
                            render={({ field }) => (
                                <PermissionsGrid
                                    value={field.value ?? []}
                                    onChange={value => field.onChange(value)}
                                />
                            )}
                        />
                    </div>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
