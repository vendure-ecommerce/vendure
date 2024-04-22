import { Permission } from '@bb-vendure/common/lib/generated-types';

import { CustomFieldConfig } from '../../config/custom-field/custom-field-types';

import { RequestContext } from './request-context';

export function userHasPermissionsOnCustomField(ctx: RequestContext, fieldDef: CustomFieldConfig) {
    const requiresPermission = (fieldDef.requiresPermission as Permission[]) ?? [];
    const permissionsArray = Array.isArray(requiresPermission) ? requiresPermission : [requiresPermission];
    if (permissionsArray.length === 0) {
        return true;
    }
    return ctx.userHasPermissions(permissionsArray);
}
