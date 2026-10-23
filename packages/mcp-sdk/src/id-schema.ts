import { z } from 'zod';

/**
 * @description
 * The JSON Schema keyword which marks a property as a Vendure entity ID. {@link idSchema} sets it.
 * The McpPlugin uses it to convert the IDs of a tool input to the type of the configured
 * EntityIdStrategy before the tool runs.
 *
 * @docsCategory mcp-sdk
 * @since 3.8.1
 */
export const ENTITY_ID_SCHEMA_KEY = 'x-vendure-entity-id';

/**
 * @description
 * A Zod schema for a Vendure entity ID. It accepts a string or a number, because the
 * project's ID strategy decides which one an ID is. With an auto-increment ID strategy, the
 * McpPlugin converts an ID string such as `"9"` to the number `9` before the tool runs.
 *
 * @example
 * ```ts
 * import { idSchema, MAX_ID_LIST_LENGTH } from '\@vendure/mcp-sdk';
 * import { z } from 'zod';
 *
 * const input = z.strictObject({
 *     productId: idSchema.describe('The product to update.'),
 *     assetIds: z.array(idSchema).max(MAX_ID_LIST_LENGTH).optional(),
 * });
 * ```
 *
 * @docsCategory mcp-sdk
 * @since 3.8.0
 */
export const idSchema = z
    .union([z.string(), z.number()], {
        error: 'must be a Vendure entity id (a string or a number)',
    })
    .meta({ [ENTITY_ID_SCHEMA_KEY]: true });

/**
 * @description
 * The most IDs one input list should hold: 100. Use it as the `.max()` of an ID array.
 *
 * @docsCategory mcp-sdk
 * @since 3.8.0
 */
export const MAX_ID_LIST_LENGTH = 100;
