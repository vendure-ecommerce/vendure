import React from 'react';
import { ErrorPage } from '@/vdb/components/shared/error-page.js';
import { FormFieldWrapper } from '@/vdb/components/shared/form-field-wrapper.js';
import { PermissionGuard } from '@/vdb/components/shared/permission-guard.js';
import { RoleSelector } from '@/vdb/components/shared/role-selector.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { NEW_ENTITY_PATH } from '@/vdb/constants.js';
import {
    CustomFieldsPageBlock,
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
import { normalizeString } from '@/vdb/lib/utils.js';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
    serviceAccountDetailDocument,
    createServiceAccountDocument,
    updateServiceAccountDocument,
} from './service-accounts.graphql.js';
import { ApiKeysPanel } from './components/api-keys-panel.js';
import { RolePermissionsDisplay } from '../_administrators/components/role-permissions-display.js';

const pageId = 'service-account-detail';

export const Route = createFileRoute('/_authenticated/_service-accounts/service-accounts_/$id')({
    component: ServiceAccountDetailPage,
    loader: detailPageRouteLoader({
        pageId,
        queryDocument: serviceAccountDetailDocument,
        breadcrumb: (isNew, entity) => {
            const name = `${entity?.firstName} ${entity?.lastName}`;
            return [
                { path: '/service-accounts', label: <Trans>Service Accounts</Trans> },
                isNew ? <Trans>New Service Account</Trans> : name,
            ];
        },
    }),
    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
});

function ServiceAccountDetailPage() {
    const params = Route.useParams();
    const navigate = useNavigate();
    const creatingNewEntity = params.id === NEW_ENTITY_PATH;
    const { i18n } = useLingui();

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
        pageId,
        queryDocument: serviceAccountDetailDocument,
        createDocument: createServiceAccountDocument,
        updateDocument: updateServiceAccountDocument,
        setValuesForUpdate: entity => {
            return {
                id: entity.id,
                // keep fields internal but we won't render them; they remain unchanged
                firstName: entity.firstName,
                lastName: entity.lastName,
                emailAddress: entity.emailAddress,
                password: '',
                customFields: entity.customFields,
                roleIds: entity.user.roles.map(role => role.id),
                isServiceAccount: true,
            };
        },
        transformUpdateInput: (input: any) => {
            // Allow updating the service account name (mapped to firstName). Keep other identity fields internal.
            const { firstName, lastName, emailAddress, password, ...rest } = input;
            return { ...rest, firstName, isServiceAccount: true };
        },
        transformCreateInput: (input: any) => {
            function rand(n = 16) {
                const arr = new Uint32Array(n);
                (globalThis.crypto ?? (window as any).crypto).getRandomValues(arr);
                return Array.from(arr, v => v.toString(36)).join('').slice(0, n);
            }
            const baseId = Date.now().toString(36);
            const firstName = input.firstName ?? (input.firstName === '' ? input.firstName : 'Service');
            const lastName = input.lastName ?? (input.lastName === '' ? input.lastName : 'Account');
            // Prefer a kebab-case identifier derived from the name; fall back to random if not available
            const namePartRaw = input.firstName;
            const kebabName = namePartRaw ? normalizeString(String(namePartRaw), '-') : '';
            const generatedId = kebabName && kebabName.length > 0
                ? `svc-${kebabName}-${baseId}-${rand(6)}`
                : `svc-${baseId}-${rand(6)}`;
            // Vendure's identifier does not need to be an email. Use a simple stable identifier if none provided.
            const emailAddress = input.emailAddress || generatedId;
            const password = input.password || `svc_${rand(24)}`;
            return { ...input, firstName, lastName, emailAddress, password, isServiceAccount: true };
        },
        params: { id: params.id },
        onSuccess: async data => {
            toast(i18n.t(creatingNewEntity ? 'Successfully created service account' : 'Successfully updated service account'));
            resetForm();
            if (creatingNewEntity) {
                await navigate({ to: `../$id`, params: { id: data.id } });
            }
        },
        onError: err => {
            toast(i18n.t(creatingNewEntity ? 'Failed to create service account' : 'Failed to update service account'), {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    const name = (entity?.firstName?.trim()?.length)
        ? entity.firstName
        : (entity?.emailAddress || entity?.user?.identifier || '');
    const roleIds = form.watch('roleIds');

    const [createKeyOpen, setCreateKeyOpen] = React.useState(false);

    return (
        <Page pageId={pageId} form={form} submitHandler={submitHandler} entity={entity}>
            <PageTitle>{creatingNewEntity ? <Trans>New Service Account</Trans> : name}</PageTitle>

            <PageActionBar>
                <PageActionBarRight>
                    <PermissionGuard requires={['UpdateAdministrator']}>
                        <Button type="submit" disabled={!form.formState.isDirty || !form.formState.isValid || isPending}>
                            {creatingNewEntity ? <Trans>Create</Trans> : <Trans>Update</Trans>}
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
                            label={<Trans>Name</Trans>}
                            render={({ field }) => <Input placeholder="" {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="emailAddress"
                            label={<Trans>Identifier</Trans>}
                            render={({ field }) => (
                                <Input
                                    placeholder="e.g. svc-orders-sync"
                                    disabled={!creatingNewEntity}
                                    {...field}
                                />
                            )}
                        />
                    </div>
                </PageBlock>
                <CustomFieldsPageBlock column="main" entityType="Administrator" control={form.control} />
                <PageBlock column="main" blockId="roles" title={<Trans>Roles</Trans>}>
                    <FormFieldWrapper control={form.control} name="roleIds" render={({ field }) => (
                        <RoleSelector value={field.value ?? []} onChange={field.onChange} multiple={true} />
                    )} />
                    <RolePermissionsDisplay value={roleIds ?? []} />
                </PageBlock>
                {entity?.id && (
                    <PageBlock
                        column="main"
                        blockId="api-keys"
                        title={<span><Trans>API Keys</Trans></span>}
                    >
                        <ApiKeysPanel
                            administratorId={entity.id}
                            createDialogOpen={createKeyOpen}
                            onCreateDialogOpenChange={setCreateKeyOpen}
                        />
                    </PageBlock>
                )}
            </PageLayout>
        </Page>
    );
}
