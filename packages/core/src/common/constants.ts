import { LanguageCode } from '@vendure/common/lib/generated-types';

import { CrudPermissionDefinition, PermissionDefinition } from './permission-definition';

/**
 * This value should be rarely used - only in those contexts where we have no access to the
 * VendureConfig to ensure at least a valid LanguageCode is available.
 */
export const DEFAULT_LANGUAGE_CODE = LanguageCode.en;
export const TRANSACTION_MANAGER_KEY = Symbol('TRANSACTION_MANAGER');
export const REQUEST_CONTEXT_KEY = 'vendureRequestContext';
export const DEFAULT_PERMISSIONS: PermissionDefinition[] = [
    new PermissionDefinition({
        name: 'Authenticated',
        description: 'Authenticated means simply that the user is logged in',
    }),
    new PermissionDefinition({
        name: 'SuperAdmin',
        description: 'SuperAdmin has unrestricted access to all operations',
    }),
    new PermissionDefinition({
        name: 'Owner',
        description: `Owner means the user owns this entity, e.g. a Customer's own Order`,
        assignable: false,
    }),
    new PermissionDefinition({
        name: 'Public',
        description: `Public means any unauthenticated user may perform the operation`,
    }),
    new CrudPermissionDefinition('Catalog'),
    new CrudPermissionDefinition('Customer'),
    new CrudPermissionDefinition('Administrator'),
    new CrudPermissionDefinition('Order'),
    new CrudPermissionDefinition('Promotion'),
    new CrudPermissionDefinition('Settings'),
];
