import { SetMetadata } from '@nestjs/common';

import { Permission } from '../../../../shared/generated-types';

export const PERMISSIONS_METADATA_KEY = '__permissions__';

/**
 * Attatches metadata to the resolver defining which permissions are required to execute the
 * operation.
 *
 * @example
 * ```
 *  @Allow(Permission.SuperAdmin)
 *  @Query()
 *  getAdministrators() {
 *      // ...
 *  }
 * ```
 */
export const Allow = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_METADATA_KEY, permissions);
