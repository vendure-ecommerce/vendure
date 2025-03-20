import { createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { roleListQuery } from './roles.graphql.js';
import { ListPage } from '@/framework/page/list-page.js';

export const Route = createFileRoute('/_authenticated/_roles/roles')({
    component: RoleListPage,
    loader: () => ({ breadcrumb: () => <Trans>Roles</Trans> }),
});

function RoleListPage() {
    return (
        <ListPage
            title="Roles"
            listQuery={addCustomFields(roleListQuery)}
            route={Route}
            defaultVisibility={{
                description: true,
                code: true,
                channels: true,
                permissions: true,
            }}
        />
    );
}
