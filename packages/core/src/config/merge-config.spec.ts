import { mergeConfig } from './merge-config';

describe('mergeConfig()', () => {
    it('creates a new object reference', () => {
        const nestedObject = { b: 2 };
        const input: any = {
            a: nestedObject,
        };

        const result = mergeConfig(input, { c: 5 } as any);
        expect(result).toEqual({
            a: nestedObject,
            c: 5,
        });
        expect(input).not.toBe(result);
        expect(input.a).not.toBe(result.a);
    });
    it('merges top-level properties', () => {
        const input: any = {
            a: 1,
            b: 2,
        };

        const result = mergeConfig(input, { b: 3, c: 5 } as any);
        expect(result).toEqual({
            a: 1,
            b: 3,
            c: 5,
        });
    });

    it('merges deep properties', () => {
        const input: any = {
            a: 1,
            b: { c: 2 },
        };

        const result = mergeConfig(input, { b: { c: 5 } } as any);
        expect(result).toEqual({
            a: 1,
            b: { c: 5 },
        });
    });

    it('replaces class instances rather than merging their properties', () => {
        class Foo {
            name = 'foo';
        }
        class Bar {
            name = 'bar';
        }

        const input: any = {
            class: new Foo(),
        };

        const result = mergeConfig(input, { class: new Bar() } as any);

        expect(result.class instanceof Bar).toBe(true);
        expect(result.class.name).toBe('bar');
    });
});
