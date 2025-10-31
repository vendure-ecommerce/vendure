import { EntityMetadata } from 'typeorm';
import { describe, expect, it } from 'vitest';

import { isTreeEntityMetadata } from './tree-relations-qb-joiner';

describe('isTreeEntityMetadata()', () => {
    it('returns true when treeType is defined', () => {
        const metadata = {
            treeType: 'closure-table',
            relations: [],
        } as unknown as EntityMetadata;

        expect(isTreeEntityMetadata(metadata)).toBe(true);
    });

    it('returns true when relation has isTreeParent', () => {
        const metadata = {
            treeType: undefined,
            relations: [
                {
                    isTreeParent: true,
                    isTreeChildren: false,
                },
            ],
        } as unknown as EntityMetadata;

        expect(isTreeEntityMetadata(metadata)).toBe(true);
    });

    it('returns true when relation has isTreeChildren', () => {
        const metadata = {
            treeType: undefined,
            relations: [
                {
                    isTreeParent: false,
                    isTreeChildren: true,
                },
            ],
        } as unknown as EntityMetadata;

        expect(isTreeEntityMetadata(metadata)).toBe(true);
    });

    it('returns true when relation is self-referencing (non-custom field)', () => {
        const metadata = {
            treeType: undefined,
            relations: [
                {
                    isTreeParent: false,
                    isTreeChildren: false,
                    propertyPath: 'parent',
                    inverseEntityMetadata: {} as EntityMetadata,
                },
            ],
        } as unknown as EntityMetadata;

        // Make the relation self-referencing
        metadata.relations[0].inverseEntityMetadata = metadata;

        expect(isTreeEntityMetadata(metadata)).toBe(true);
    });

    it('returns false when relation is self-referencing custom field', () => {
        const metadata = {
            treeType: undefined,
            relations: [
                {
                    isTreeParent: false,
                    isTreeChildren: false,
                    propertyPath: 'customFields.cfProduct',
                    inverseEntityMetadata: {} as EntityMetadata,
                },
            ],
        } as unknown as EntityMetadata;

        // Make the relation self-referencing (but it's a custom field)
        metadata.relations[0].inverseEntityMetadata = metadata;

        // Should return false because custom field relations should be skipped
        expect(isTreeEntityMetadata(metadata)).toBe(false);
    });

    it('returns false when no tree indicators are present', () => {
        const metadata = {
            treeType: undefined,
            relations: [
                {
                    isTreeParent: false,
                    isTreeChildren: false,
                    propertyPath: 'someRelation',
                    inverseEntityMetadata: {
                        // Different entity, not self-referencing
                        name: 'OtherEntity',
                    } as EntityMetadata,
                },
            ],
        } as unknown as EntityMetadata;

        expect(isTreeEntityMetadata(metadata)).toBe(false);
    });

    it('handles multiple relations with mixed types', () => {
        const metadata = {
            treeType: undefined,
            relations: [
                {
                    isTreeParent: false,
                    isTreeChildren: false,
                    propertyPath: 'customFields.cfProduct',
                    inverseEntityMetadata: {} as EntityMetadata,
                },
                {
                    isTreeParent: false,
                    isTreeChildren: false,
                    propertyPath: 'parent',
                    inverseEntityMetadata: {} as EntityMetadata,
                },
            ],
        } as unknown as EntityMetadata;

        // Make both relations self-referencing
        metadata.relations[0].inverseEntityMetadata = metadata;
        metadata.relations[1].inverseEntityMetadata = metadata;

        // Should return true because the second relation (non-custom field) makes it a tree
        expect(isTreeEntityMetadata(metadata)).toBe(true);
    });

    it('returns false when only custom field self-references exist', () => {
        const metadata = {
            treeType: undefined,
            relations: [
                {
                    isTreeParent: false,
                    isTreeChildren: false,
                    propertyPath: 'customFields.cfProduct',
                    inverseEntityMetadata: {} as EntityMetadata,
                },
                {
                    isTreeParent: false,
                    isTreeChildren: false,
                    propertyPath: 'customFields.relatedProduct',
                    inverseEntityMetadata: {} as EntityMetadata,
                },
            ],
        } as unknown as EntityMetadata;

        // Make both custom field relations self-referencing
        metadata.relations[0].inverseEntityMetadata = metadata;
        metadata.relations[1].inverseEntityMetadata = metadata;

        // Should return false because all self-references are custom fields
        expect(isTreeEntityMetadata(metadata)).toBe(false);
    });
});
