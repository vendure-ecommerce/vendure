import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { ENTITY_ID_SCHEMA_KEY, idSchema } from './id-schema';

describe('idSchema', () => {
    it('accepts a string or a number', () => {
        expect(idSchema.parse('T_1')).toBe('T_1');
        expect(idSchema.parse(1)).toBe(1);
    });

    it('refuses any other value with a message naming what it expects', () => {
        const result = idSchema.safeParse(true);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe('must be a Vendure entity id (a string or a number)');
    });

    // #5626 — the McpPlugin finds the ids of a tool input by this keyword
    it('marks the property as an entity id in the JSON Schema, also when described or in a list', () => {
        const json = z.toJSONSchema(
            z.strictObject({
                productId: idSchema.describe('The product.'),
                assetIds: z.array(idSchema),
            }),
        ) as { properties: Record<string, any> };

        expect(json.properties.productId[ENTITY_ID_SCHEMA_KEY]).toBe(true);
        expect(json.properties.assetIds.items[ENTITY_ID_SCHEMA_KEY]).toBe(true);
    });
});
