import { ReflectMetadata } from '@nestjs/common';

export const DECODE_METADATA_KEY = '__decode__';

/**
 * Attatches metadata to the resolver defining which keys are ids which need to be decoded.
 * By default, all keys named "id" will be implicitly decoded, but some operations have ID arguments
 * which are not named "id", e.g. assignRoleToAdministrator, where there are 2 ID arguments passed.
 *
 * @example
 * ```
 *  @Query()
 *  @Decode('administratorId', 'roleId')
 *  assignRoleToAdministrator(@Args() args) {
 *      // ...
 *  }
 * ```
 */
export const Decode = (...transformKeys: string[]) => ReflectMetadata(DECODE_METADATA_KEY, transformKeys);
