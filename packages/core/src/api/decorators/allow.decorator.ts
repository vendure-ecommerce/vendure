import { SetMetadata } from '@nestjs/common';
import { Permission } from '@vendure/common/lib/generated-types';

export const PERMISSIONS_METADATA_KEY = '__permissions__';

/**
 * @description
 * Attaches metadata to the resolver defining which permissions are required to execute the
 * operation, using one or more {@link Permission} values.
 *
 * In a GraphQL context, it can be applied to top-level queries and mutations as well as field resolvers.
 *
 * For REST controllers, it can be applied to route handlers.
 *
 * @example
 * ```TypeScript
 *  \@Allow(Permission.SuperAdmin)
 *  \@Query()
 *  getAdministrators() {
 *      // ...
 *  }
 * ```
 *
 * @docsCategory request
 * @docsPage Allow Decorator
 */
export const Allow = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_METADATA_KEY, permissions);
