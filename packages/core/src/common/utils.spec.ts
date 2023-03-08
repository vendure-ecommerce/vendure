import { describe, expect, it } from 'vitest';

import { convertRelationPaths } from './utils';

describe('convertRelationPaths()', () => {
    it('undefined', () => {
        const result = convertRelationPaths<any>(undefined);
        expect(result).toEqual(undefined);
    });

    it('null', () => {
        const result = convertRelationPaths<any>(null);
        expect(result).toEqual(undefined);
    });

    it('single relation', () => {
        const result = convertRelationPaths<any>(['a']);
        expect(result).toEqual({
            a: true,
        });
    });

    it('flat list', () => {
        const result = convertRelationPaths<any>(['a', 'b', 'c']);
        expect(result).toEqual({
            a: true,
            b: true,
            c: true,
        });
    });

    it('three-level nested', () => {
        const result = convertRelationPaths<any>(['a', 'b.c', 'd.e.f']);
        expect(result).toEqual({
            a: true,
            b: {
                c: true,
            },
            d: {
                e: {
                    f: true,
                },
            },
        });
    });
});
